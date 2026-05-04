import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {
  postUserEntry,
  updateUserEntry,
  showUserEntries,
  deleteUserEntry,
} from '../controllers/entry-controller.js';

const entryRouter = express.Router();

entryRouter
  .get('/mood', authenticateToken, showUserEntries)
  .post('/mood', authenticateToken, postUserEntry)
  .patch('/mood/:id', authenticateToken, updateUserEntry)
  .delete('/mood/:id', authenticateToken, deleteUserEntry);

export default entryRouter;
