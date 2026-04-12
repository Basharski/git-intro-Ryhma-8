import fetch from 'node-fetch';
import {addMeasurement} from '../models/hrv-model.js';

const baseUrl = process.env.KUBIOS_API_URI;

// Fetches users measurement data from KubiosCloud
const fetchKubiosData = async (tokenString) => {
  const headers = new Headers();
  headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
  headers.append('Authorization', tokenString);

  const response = await fetch(
    `${baseUrl}/result/self?from=2024-01-01T00%3A00%3A00%2B00%3A00`,
    {method: 'GET', headers: headers},
  );

  if (!response.ok) {
    throw new Error(`Kubios API error: ${response.status}`);
  }

  return await response.json();
};

export const getUserInfo = async (req, res, next) => {
  try {
    const {kubiosIdToken} = req.user;
    const headers = new Headers();
    headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
    headers.append('Authorization', kubiosIdToken);

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

// Syncs users measurement data to the database
export const syncMeasurements = async (req, res, next) => {
  try {
    const {kubiosIdToken, userId} = req.user;

    const measurements = await fetchKubiosData(kubiosIdToken);
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
        } = {},
      } = entry;

      // Change date to a format the database understands
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
      };
      console.log(newEntry);
      await addMeasurement(newEntry);
    }

    res.json({
      message: 'Sync complete',
      count: entries.length,
    });
  } catch (err) {
    console.error('syncMeasurements failed:', err);
    next(err);
  }
};
