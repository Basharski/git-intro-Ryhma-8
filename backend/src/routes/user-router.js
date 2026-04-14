import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {postLogin, getMe} from '../controllers/kubios-auth-controller.js';
import {getUserDataById, updateUserProfile} from '../controllers/user-controller.js'

const userRouter = express.Router();

// POST user login
userRouter.post('/login', postLogin);

// Get and update users data
userRouter
  .get('/profile', authenticateToken, getUserDataById)
  .patch('/profile', authenticateToken, updateUserProfile);

// Get user info based on token
userRouter.get('/me', authenticateToken, getMe);

export default userRouter;
