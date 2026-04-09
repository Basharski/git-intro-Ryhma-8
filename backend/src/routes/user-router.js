import express from 'express';
import {body} from 'express-validator';
import {authenticateToken} from '../middlewares/authentication.js';
import {validationErrorHandler} from '../middlewares/error-handlers.js';

// käytetään kubios auth controlleria kirjautumiseen vanhan user controllerin sijasta
import {
  getUsers,
//  getMe,
//  postLogin,
  postUser,
} from '../controllers/user-controller.js';
import {postLogin, getMe} from '../controllers/kubios-auth-controller.js';

const userRouter = express.Router();

// Users resource endpoints
userRouter
  .route('/')
  // GET all users
  .get(authenticateToken, getUsers)
  // POST new user
  .post(
    body('email').trim().isEmail(),
    body('password').trim().isLength({min: 8, max: 100}),
    body('name').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
    validationErrorHandler,
    postUser,
  );

// POST user login
userRouter.post('/login', postLogin);

// Get user info based on token
userRouter.get('/me', authenticateToken, getMe);

// TODO: get user by id
// app.get('/api/users/:id');
// TODO: put user by id
// TODO: delete user by id

export default userRouter;
