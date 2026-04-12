import promisePool from '../utils/database.js';

// TODO: lisää modelit ja muokkaa kontrollerit reiteille:
// GET /api/users/:id - get user by id

// POST /api/users - add a new user
const addUser = async (user) => {
  const {given_name, email, password, height, weight, birthdate} = user;
  const sql = `INSERT INTO Users (name, email, password, height, weight, date_of_birth)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [given_name, email, password, height, weight, birthdate];
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
    const sql = 'SELECT * FROM Users WHERE email=?';
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
    const sql = 'SELECT * FROM Users WHERE id=?';
    const params = [id];
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
    console.error('selectUserByID', error);
    return {error: 500, message: 'db error'};
  }
};

export {
  addUser,
  selectUserByEmail,
  selectUserById,
};
