import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  addUser,
  findUserByUsername,
  listAllUsers,
} from '../models/user-model.js';

// TODO: lisää tietokantafunktiot user modeliin
// ja käytä niitä täällä

// TODO: getUserById
// TODO: putUserById
// TODO: deleteUserById

const getUsers = async (req, response) => {
  const users = await listAllUsers();
  response.json(users);
};

// Käyttäjän lisäys (rekisteröityminen)
const postUser = async (req, response) => {
  const newUser = req.body;

  // Lasketaan salasanasta tiiviste (hash)
  const hash = await bcrypt.hash(newUser.password, 10);
  //console.log('salasanatiiviste:', hash);
  // Korvataan selväkielinen salasana tiivisteellä ennen kantaan tallennusta
  newUser.password = hash;
  try {
    const newUserId = await addUser(newUser);
    response.status(201).json({message: 'new user added', user_id: newUserId});
  } catch (error) {
    // uuden virheen heittäminen käsitellään oletus error handlerilla
    // vaihtoehto next(error) käyttöön
    // eslint-disable-next-line preserve-caught-error
    throw new Error(error.message);
  }
};

// Tietokantaversio valmis
const postLogin = async (req, res) => {
  const {username, password} = req.body;
  // haetaan käyttäjä-objekti käyttäjän nimen perusteella
  const user = await findUserByUsername(username);
  //console.log('postLogin user from db', user);
  if (user) {
    // jos asiakkaalta tullut salasana vastaa tietokannasta haettua tiivistettä, ehto on tosi
    if (await bcrypt.compare(password, user.password)) {
      delete user.password;
      // generate & sign token using a secret and expiration time
      // read from .env file
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      return res.json({message: 'login ok', user, token});
    }
    return res.status(403).json({error: 'invalid password'});
  }
  res.status(404).json({error: 'user not found'});
};

// Get user information stored inside token
const getMe = (req, res) => {
  res.json(req.user);
};

export {getUsers, postUser, postLogin, getMe};
