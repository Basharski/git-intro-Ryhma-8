import fetch from 'node-fetch';
import {
  addMeasurement,
  getMeasurements,
  getLatestMeasurement,
} from '../models/hrv-data-model.js';
import {getExercises} from '../controllers/exercise-controller.js';

const baseUrl = process.env.KUBIOS_API_URI;

const fetchKubiosData = async (tokenString) => {
  const headers = {
    'User-Agent': process.env.KUBIOS_USER_AGENT,
    Authorization: tokenString,
  };

  const response = await fetch(
    `${baseUrl}/result/self?from=2024-01-01T00%3A00%3A00%2B00%3A00`,
    {method: 'GET', headers: headers},
  );

  if (!response.ok) {
    throw new Error(`Kubios API error: ${response.status}`);
  }

  return await response.json();
};

const performSync = async (userId, token) => {
  const measurements = await fetchKubiosData(token);
  const entries = measurements.results || [];

  for (const entry of entries) {
    const {
      measure_id,
      measured_timestamp: measured_at,
      result: {
        artefact_level,
        mean_hr_bpm: mean_hr,
        pns_index,
        readiness,
        rmssd_ms: rmssd,
        sdnn_ms: sdnn,
        sns_index,
        stress_index,
        freq_domain: {LF_HF_power: lf_hf} = {},
      } = {},
    } = entry;

    // Change date to a format MySql understands
    const db_measured_at = new Date(measured_at)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const newEntry = {
      user_id: userId,
      measure_id,
      measured_at: db_measured_at,
      artefact_level,
      mean_hr,
      pns_index,
      readiness,
      rmssd,
      sdnn,
      sns_index,
      stress_index,
      lf_hf,
    };

    await addMeasurement(newEntry);
  }
  return entries.length;
};

export const getUserInfo = async (req, res, next) => {
  try {
    const {kubiosIdToken} = req.user;
    const headers = {
      'User-Agent': process.env.KUBIOS_USER_AGENT,
      Authorization: kubiosIdToken,
    };

    const response = await fetch(`${baseUrl}/user/self`, {
      method: 'GET',
      headers: headers,
    });

    const userInfo = await response.json();
    res.json(userInfo);
  } catch (err) {
    next(err);
  }
};

// Synchronizes local database and Kubios
const syncMeasurements = async (userId, kubiosIdToken) => {
  try {
    await performSync(userId, kubiosIdToken);
  } catch (err) {
    console.error('syncMeasurements failed:', err);
  }
};

// Syncs Kubios and database, returns latest measurement and personalized exercises
export const syncAndReturn = async (req, res) => {
  try {
    const {userId, kubiosIdToken} = req.user;
    await syncMeasurements(userId, kubiosIdToken);

    const measurement = await getLatestMeasurement(userId);
    const recommendations = await getExercises(
      measurement.readiness,
      measurement.stress_index,
    );

    res.json({measurement, recommendations});
  } catch (err) {
    console.error('Synchronization error', err);
    res.status(500).json({error: 'Synchronization failed'});
  }
};

export const getMeasurementsByUserId = async (req, res, next) => {
  try {
    const {userId} = req.user;
    const measurements = await getMeasurements(userId);
    res.json(measurements);
  } catch (err) {
    next(err);
  }
};

// Gets the latest measurements from Kubios and updates the personalized exercises
export const showLatestMeasurement = async (req, res, next) => {
  try {
    const {userId} = req.user;

    // Get the latest measurement from database
    const measurement = await getLatestMeasurement(userId);

    if (!measurement) {
      return res
        .status(404)
        .json({message: 'No measurements found after sync'});
    }

    // Gets the personalized exercises from database
    const recommendations = await getExercises(
      measurement.readiness,
      measurement.stress_index,
    );

    res.json({measurement: measurement, recommendations: recommendations});
  } catch (err) {
    console.error('showLatestMeasurement failed:', err);
    next(err);
  }
};
