import promisePool from '../utils/database.js';

// POST /api/users - add a new user
const addUser = async (user) => {
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

const selectUserByEmail = async (email) => {
  try {
    const sql = 'SELECT * FROM users WHERE email=?';
    const params = [email];
    const [rows] = await promisePool.query(sql, params);
    // console.log(rows);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: 'user not found'};
    }
    // Remove password property from result
    delete rows[0].password;
    return rows[0];
  } catch (error) {
    console.error('selectUserByEmail', error);
    return {error: 500, message: 'db error'};
  }
};

const selectUserById = async (id) => {
  try {
    const sql =
      'SELECT name, email, height, weight, TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age FROM users WHERE id=?';
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

const updateUserDataById = async (userId, data) => {
  const {name, height, weight} = data;

  const params = [name, height, weight, userId];

  const sql = `UPDATE users SET name = ?, height = ?, weight = ? WHERE id = ?`;

  const [result] = await promisePool.execute(sql, params);

  return result.affectedRows > 0;
};

export {addUser, selectUserByEmail, selectUserById, updateUserDataById};
