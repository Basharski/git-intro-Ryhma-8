import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {syncMeasurements} from '../controllers/kubios-data-controller.js';
import {getMeasurements} from '../controllers/hrv-controller.js'

const entryRouter = express.Router();

entryRouter
  .get('/data', authenticateToken, getMeasurements)
  .post('/saveData', authenticateToken, syncMeasurements);
export default entryRouter;
