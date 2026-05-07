import promisePool from '../utils/database.js';

// --- PROFESSIONAL FUNCTIONS (For Pro View) ---

// Creates a 6 character code that links a user and a professional if used
export const createInviteCode = async (code, proId) => {
  await promisePool.execute(
    'INSERT INTO connection_codes (code, pro_id) VALUES (?, ?)',
    [code, proId],
  );
};

// Gets all linked user to a specific professional
export const getLinkedPatients = async (proId) => {
  const [rows] = await promisePool.execute(
    `
    SELECT u.id, u.name, u.email, p.permissions, p.created_at as linked_at
    FROM users u
    JOIN patient_pro_links p ON u.id = p.patient_id
    WHERE p.pro_id = ?
  `,
    [proId],
  );
  return rows;
};

// Gets patients weekly reports
export const getPatientWeeklyReports = async (patientId) => {
  const [rows] = await promisePool.execute(
    `
    SELECT id, week_number, year, avg_rmssd, avg_readiness, avg_stress_score, avg_mood_score, pro_comment, created_at
    FROM weekly_reports
    WHERE user_id = ?
    ORDER BY year DESC, week_number DESC
    `,
    [patientId],
  );
  return rows;
};

// Gets more detailed information from the users measurement data
export const getPatientDailyLogs = async (patientId, startDate, endDate) => {
  try {
    const [rows] = await promisePool.execute(
      `
      SELECT
        k.measured_at,
        k.rmssd,
        k.readiness,
        k.stress_index,
        u.mood_score,
        u.user_text,
        u.created_at AS entry_created_at
      FROM kubios_results k
      LEFT JOIN user_entries u
        ON k.user_id = u.user_id
        AND DATE(k.measured_at) = DATE(u.created_at)
      WHERE k.user_id = ?
        AND k.measured_at >= ?
        AND k.measured_at <= ?
      ORDER BY k.measured_at ASC
      `,
      [patientId, `${startDate} 00:00:00`, `${endDate} 23:59:59`],
    );
    return rows;
  } catch (error) {
    console.error('getPatientDailyLogs error:', error);
    throw error;
  }
};

// Checks if the professional has access to the users data
export const checkAccess = async (proId, patientId) => {
  const [rows] = await promisePool.execute(
    'SELECT 1 FROM patient_pro_links WHERE pro_id = ? AND patient_id = ?',
    [proId, patientId],
  );
  return rows.length > 0;
};

// Professional can add their comment on the weekly report
export const updateProComment = async (reportId, feedback) => {
  try {
    const sql = 'UPDATE weekly_reports SET pro_comment = ? WHERE id = ?';
    const [result] = await promisePool.query(sql, [feedback, reportId]);

    if (result.affectedRows === 0) {
      return {error: 404, message: 'Report not found'};
    }
    return {success: true};
  } catch (error) {
    console.error('updateProComment error:', error);
    return {error: 500, message: 'db error'};
  }
};
