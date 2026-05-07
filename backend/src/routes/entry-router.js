import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import * as EntryController from '../controllers/entry-controller.js';

const entryRouter = express.Router();

entryRouter.use(authenticateToken)

entryRouter
  .get('/', EntryController.showUserEntries)
  .post('/', EntryController.postUserEntry)
  .patch('/:id', EntryController.updateUserEntry)
  .delete('/:id', EntryController.deleteUserEntry);

export default entryRouter;
