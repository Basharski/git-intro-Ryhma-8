import promisePool from '../utils/database.js';

const addMeasurement = async (data) => {
  const {
    user_id,
    measure_id,
    measured_at,
    artefact_level,
    mean_hr,
    pns_index,
    readiness,
    rmssd,
    sdnn,
    sns_index,
    stress_index,
  } = data;

  const sql = `INSERT IGNORE INTO kubios_results (user_id, measure_id, measured_at,
              artefact_level, mean_hr,
              pns_index, readiness, rmssd, sdnn,
              sns_index, stress_index)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    user_id,
    measure_id,
    measured_at,
    artefact_level,
    mean_hr,
    pns_index,
    readiness,
    rmssd,
    sdnn,
    sns_index,
    stress_index,
  ];
  try {
    const results = await promisePool.execute(sql, params);
    return {"Measurements added": results};
  } catch (e) {
    console.error('error', e.message);
    // eslint-disable-next-line preserve-caught-error
    throw new Error(e);
  }
};

const getMeasurementsByUserId = async (userId) => {
  const sql = `SELECT * FROM kubios_results
              WHERE user_id = ?
              ORDER BY measured_at DESC`;
  const [rows] = await promisePool.execute(sql, [userId]);
  if (rows.length === 0) {
    console.log('No measurements found')
    return
  } else {
    return rows
  }
};

export {addMeasurement, getMeasurementsByUserId};
