import promisePool from '../utils/database.js';

// TODO: lisää modelit ja muokkaa kontrollerit reiteille:
// GET /api/users/:id - get user by id

// GET /api/users - list all users
const listAllUsers = async () => {
  const sql = 'SELECT username, created_at FROM Users';
  const [rows] = await promisePool.query(sql);
  return rows;
};

// POST /api/users - add a new user
const addUser = async (user) => {
  const {email, password, name} = user;
  const sql = `INSERT INTO Users (email, password, name)
               VALUES (?, ?, ?)`;
  const params = [email, password, name];
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

// Huom: virheenkäsittely puuttuu, mutta sen voi tehdä myös kontrollerissa
const findUserByUsername = async (username) => {
  const sql = 'SELECT * FROM Users WHERE username = ?';
  const [rows] = await promisePool.execute(sql, [username]);
  return rows[0];
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
    const sql = 'SELECT * FROM Users WHERE user_id=?';
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
  findUserByUsername,
  addUser,
  listAllUsers,
  selectUserByEmail,
  selectUserById,
};
