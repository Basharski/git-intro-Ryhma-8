import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {postLogin} from '../controllers/kubios-auth-controller.js';
import * as UserController from '../controllers/user-controller.js'

const userRouter = express.Router();

// POST user login
userRouter.post('/login', postLogin);

userRouter.use(authenticateToken);

// Get and update users data
userRouter
  .get('/profile', UserController.getUserDataById)
  .patch('/profile', UserController.updateUserProfile);

userRouter.post(
  '/patient/claim-code',
  UserController.claimCode,
);

userRouter.put(
  '/patient/permissions',
  UserController.updateShareDataPermissions,
);

userRouter.delete(
  '/patient/revoke',
  UserController.revokeAccess,
);

export default userRouter;
