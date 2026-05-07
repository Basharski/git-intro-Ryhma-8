import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {postLogin} from '../controllers/kubios-auth-controller.js';
import * as UserController from '../controllers/user-controller.js'

const userRouter = express.Router();

// POST user login
userRouter.post('/login', postLogin);

// Get and update users data
userRouter
  .get('/profile', authenticateToken, UserController.getUserDataById)
  .patch('/profile', authenticateToken, UserController.updateUserProfile);

userRouter.post(
  '/patient/claim-code',
  authenticateToken,
  UserController.claimCode,
);

userRouter.put(
  '/patient/permissions',
  authenticateToken,
  UserController.updateShareDataPermissions,
);

userRouter.delete(
  '/patient/revoke',
  authenticateToken,
  UserController.revokeAccess,
);

export default userRouter;
