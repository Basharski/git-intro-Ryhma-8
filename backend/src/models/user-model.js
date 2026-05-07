import promisePool from '../utils/database.js';

// POST /api/users - add a new user
export const addUser = async (user) => {
  const {name, email, password, height, weight, date_of_birth} = user;
  const sql = `INSERT INTO users (name, email, password, height, weight, date_of_birth)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [name, email, password, height, weight, date_of_birth];
  try {
    const result = await promisePool.execute(sql, params);
    //console.log('insert result', result);
    return {user_id: result[0].insertId};
  } catch (e) {
    console.error('error', e.message);
    // eslint-disable-next-line preserve-caught-error
    throw new Error(e);
  }
};

/**
 * Fetches a user by email with an optional flag to include the password
 * @param {string} email
 * @param {boolean} includePassword - Default is false for security
 */
export const selectUserByEmail = async (email, includePassword = false) => {
  try {
    const sql = 'SELECT * FROM users WHERE email=?';
    const params = [email];
    const [rows] = await promisePool.query(sql, params);
    if (rows.length === 0) {
      return {error: 404, message: 'user not found'};
    }

    const user = rows[0];

    if (!includePassword) {
      delete user.password;
    }
    return rows[0];
  } catch (error) {
    console.error('selectUserByEmail', error);
    return {error: 500, message: 'db error'};
  }
};

export const selectUserById = async (id) => {
  try {
    const sql =
      'SELECT name, email, height, weight, pro_code, TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age FROM users WHERE id=?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    console.log(rows);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: 'user not found'};
    }

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('selectUserByID', error);
    return {error: 500, message: 'db error'};
  }
};

export const updateUserDataById = async (userId, data) => {
  const {name, height, weight} = data;

  const params = [name, height, weight, userId];

  const sql = `UPDATE users SET name = ?, height = ?, weight = ? WHERE id = ?`;

  const [result] = await promisePool.execute(sql, params);

  return result.affectedRows > 0;
};

// --- FUNCTIONS FOR USER-PROFESSIONAL LINKS ---

// Checks the database if there is a invitation code
export const findInviteCode = async (code) => {
  const [rows] = await promisePool.execute(
    'SELECT pro_id FROM connection_codes WHERE code = ?',
    [code],
  );
  return rows[0]; // Returns the row if found, undefined if not
};

// Deletes the invitation code from database
export const deleteInviteCode = async (code) => {
  await promisePool.execute('DELETE FROM connection_codes WHERE code = ?', [
    code,
  ]);
  console.log('DELETED CODE');
};

//
export const getLinkDetails = async (proId, patientId) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM patient_pro_links WHERE pro_id = ? AND patient_id = ?',
    [proId, patientId],
  );
  return rows[0];
};

// Creates the link between the user and the professional
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

// Adds the invitation code to the users table so it can be shown in frontend
export const updatePatientProCode = async (userId, proCode) => {
  await promisePool.execute('UPDATE users SET pro_code = ? WHERE id = ?', [
    proCode,
    userId,
  ]);
};

// Updates the professionals access to a users information
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
