import promisePool from '../utils/database.js';

// --- CONNECTION CODES ---

export const createInviteCode = async (code, proId) => {
  await promisePool.execute(
    'INSERT INTO connection_codes (code, pro_id) VALUES (?, ?)',
    [code, proId],
  );
};

export const findInviteCode = async (code) => {
  const [rows] = await promisePool.execute(
    'SELECT pro_id FROM connection_codes WHERE code = ?',
    [code],
  );
  return rows[0]; // Returns the row if found, undefined if not
};

export const deleteInviteCode = async (code) => {
  await promisePool.execute('DELETE FROM connection_codes WHERE code = ?', [
    code,
  ]);
  console.log('DELETED CODE');
};

// --- PRO/PATIENT LINKS ---

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

export const getLinkDetails = async (proId, patientId) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM patient_pro_links WHERE pro_id = ? AND patient_id = ?',
    [proId, patientId],
  );
  return rows[0];
};

export const createPatientProLink = async (
  proId,
  patientId,
  permissionsJson,
) => {
  await promisePool.execute(
    'INSERT INTO patient_pro_links (pro_id, patient_id, permissions) VALUES (?, ?, ?)',
    [proId, patientId, permissionsJson],
  );
};

export const updatePatientProCode = async (userId, proCode) => {
  await promisePool.execute('UPDATE users SET pro_code = ? WHERE id = ?', [
    proCode,
    userId,
  ]);
};

export const updateLinkPermissions = async (
  proId,
  patientId,
  permissionsJson,
) => {
  const [result] = await promisePool.execute(
    'UPDATE patient_pro_links SET permissions = ? WHERE patient_id = ? AND pro_id = ?',
    [permissionsJson, patientId, proId],
  );
  return result.affectedRows > 0; // Returns true if a row was updated
};

export const removePatientProLink = async (userId) => {
  // Remove link from database
  await promisePool.execute(
    'DELETE FROM patient_pro_links WHERE patient_id = ?',
    [userId],
  );

  // Remove share code from users information
  await promisePool.execute(
    'UPDATE users SET pro_code = NULL WHERE id = ?',
    [userId],
  );
};

// --- PATIENT DATA (For Pro View) ---

export const getRecentMeasurements = async (patientId, limit = 30) => {
  const [rows] = await promisePool.execute(
    'SELECT rmssd, lf_hf, stress_index, readiness, measured_at FROM kubios_results WHERE user_id = ? ORDER BY measured_at DESC LIMIT ?',
    [patientId, limit.toString()],
  );
  return rows;
};
