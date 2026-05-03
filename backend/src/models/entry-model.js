import promisePool from '../utils/database.js';

const saveUserEntry = async (userId, data) => {
  const {mood, workload, message} = data;
  const sql = `INSERT IGNORE INTO user_entries (user_id, mood_score, workload, user_text) VALUES(?, ?, ?, ?)`;
  const params = [userId, mood, workload, message];

  try {
    const result = await promisePool.execute(sql, params);
    return result;
  } catch (e) {
    console.error('error', e.message);
    throw new Error(e);
  }
};

export {saveUserEntry};
