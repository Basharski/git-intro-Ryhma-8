import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {syncMeasurements} from '../controllers/kubios-data-controller.js';
import {getMeasurements} from '../controllers/hrv-controller.js';

const hrvEntryRouter = express.Router();

hrvEntryRouter.get('/data', authenticateToken, getMeasurements);

hrvEntryRouter.post('/saveData', authenticateToken, syncMeasurements);

export default hrvEntryRouter;
