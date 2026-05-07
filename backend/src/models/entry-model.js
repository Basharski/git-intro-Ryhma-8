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

const getUserEntries = async (userId) => {
  const sql = `SELECT * FROM user_entries WHERE user_id = ? ORDER BY created_at DESC`;
  const params = [userId];

  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.log('error', e.message);
    throw new Error(e);
  }
};

const changeUserEntry = async (userId, data) => {
  const {entryId, mood, workload, message} = data;
  const sql = `UPDATE user_entries SET mood_score = ?, workload = ?, user_text = ? WHERE user_id = ? AND id = ?`;
  const params = [mood, workload, message, userId, entryId];

  try {
    const results = await promisePool.execute(sql, params);
    return results;
  } catch (e) {
    console.log('error', e.message);
    throw new Error(e);
  }
};

const deleteUserEntry = async (userId, entryId) => {
  const sql = `DELETE FROM user_entries WHERE id = ? AND user_id = ?`;
  const params = [entryId, userId];

  try {
    const results = await promisePool.execute(sql, params);
    return results;
  } catch (e) {
    console.log('error', e.message);
    throw new Error(e);
  }
};

export {saveUserEntry, getUserEntries, changeUserEntry, deleteUserEntry};
