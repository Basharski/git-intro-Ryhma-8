import promisePool from '../utils/database.js';

// Fetch all reports for a specific user
export const getReportsByUserId = async (userId) => {
  try {
    const sql = 'SELECT * FROM weekly_reports WHERE user_id = ? ORDER BY year DESC, week_number DESC';
    const [rows] = await promisePool.query(sql, [userId]);
    return rows;
  } catch (error) {
    console.error('getReportsByUserId error:', error);
    return { error: 500, message: 'db error' };
  }
};

// Gets the latest weekly report
export const getLatestReportByUserId = async (userId) => {
  try {
    const sql = `
      SELECT * FROM weekly_reports
      WHERE user_id = ?
      ORDER BY year DESC, week_number DESC
      LIMIT 1`;

    const [rows] = await promisePool.query(sql, [userId]);

    if (rows.length === 0) {
      return { error: 404, message: 'No reports found for this user' };
    }
    return rows[0];
  } catch (error) {
    console.error('getLatestReportByUserId error:', error);
    return { error: 500, message: 'db error' };
  }
};

// Generates the reports
export const generateReportsForUser = async (userId) => {
  try {
    const sql = `
      INSERT IGNORE INTO weekly_reports (user_id, week_number, year, avg_rmssd, avg_readiness, avg_stress_score, avg_mood_score)
      SELECT
          hrv.user_id,
          WEEK(hrv.raw_date, 1) as week_number,
          YEAR(hrv.raw_date) as year,
          hrv.avg_rmssd,
          hrv.avg_readiness,
          hrv.avg_stress,
          moods.avg_mood
      FROM (
          SELECT user_id, MIN(measured_at) as raw_date, AVG(rmssd) as avg_rmssd,
                 AVG(readiness) as avg_readiness, AVG(stress_index) as avg_stress
          FROM kubios_results WHERE user_id = ? GROUP BY user_id, YEARWEEK(measured_at, 1)
      ) hrv
      LEFT JOIN (
          SELECT user_id, AVG(mood_score) as avg_mood, YEARWEEK(created_at, 1) as wk
          FROM diary_entries WHERE user_id = ? GROUP BY user_id, wk
      ) moods ON YEARWEEK(hrv.raw_date, 1) = moods.wk AND hrv.user_id = moods.user_id
    `;
    const [result] = await promisePool.query(sql, [userId, userId]);
    return { success: true, inserted: result.affectedRows };
  } catch (error) {
    console.error('generateReports error:', error);
    return { error: 500, message: 'db error' };
  }
};
