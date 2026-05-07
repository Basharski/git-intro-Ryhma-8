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
    lf_hf,
  } = data;

  const sql = `INSERT IGNORE INTO kubios_results (user_id, measure_id, measured_at,
              artefact_level, mean_hr,
              pns_index, readiness, rmssd, sdnn,
              sns_index, stress_index, lf_hf)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
    lf_hf,
  ];
  try {
    const results = await promisePool.execute(sql, params);
    return {'Measurements added': results};
  } catch (e) {
    console.error('error', e.message);
    // eslint-disable-next-line preserve-caught-error
    throw new Error(e);
  }
};

const getMeasurements = async (userId) => {
  const sql = `SELECT measured_at, rmssd, lf_hf, stress_index, readiness FROM kubios_results
              WHERE user_id = ?
              ORDER BY measured_at ASC`;
  const [rows] = await promisePool.execute(sql, [userId]);
  if (rows.length === 0) {
    console.log('No measurements found');
    return;
  } else {
    return rows;
  }
};

const getLatestMeasurement = async (userId) => {
  const sql = `SELECT measured_at, rmssd, lf_hf, stress_index, readiness
               FROM kubios_results
               WHERE user_id = ?
               ORDER BY measured_at DESC
               LIMIT 1`;

  const [rows] = await promisePool.execute(sql, [userId]);

  if (rows.length === 0) {
    console.log('No measurements found');
    return null;
  }
  return rows[0];
};

export {addMeasurement, getMeasurements, getLatestMeasurement};
