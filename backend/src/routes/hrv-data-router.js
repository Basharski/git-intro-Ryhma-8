import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {
  syncMeasurements,
  getMeasurementsByUserId,
  showLatestMeasurement,
} from '../controllers/kubios-data-controller.js';

const hrvEntryRouter = express.Router();

hrvEntryRouter.get('/data', authenticateToken, getMeasurementsByUserId);

hrvEntryRouter.get('/data/latest', authenticateToken, showLatestMeasurement);

hrvEntryRouter.post('/fetch', authenticateToken, syncMeasurements);

export default hrvEntryRouter;
