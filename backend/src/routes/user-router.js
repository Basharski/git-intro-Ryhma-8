import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {postLogin, getMe} from '../controllers/kubios-auth-controller.js';

const userRouter = express.Router();


// POST user login
userRouter.post('/login', postLogin);

// Get user info based on token
userRouter.get('/me', authenticateToken, getMe);

export default userRouter;
