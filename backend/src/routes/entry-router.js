import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {postUserEntry} from '../controllers/entry-controller.js';

const entryRouter = express.Router();

entryRouter.post('/mood', authenticateToken, postUserEntry);

export default entryRouter
