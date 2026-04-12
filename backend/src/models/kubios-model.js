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
    const [rows] = await promisePool.execute(sql, params);
    return rows
  } catch (e) {
    console.error('error', e.message);
    // eslint-disable-next-line preserve-caught-error
    throw new Error(e);
  }
};

export {addMeasurement};
