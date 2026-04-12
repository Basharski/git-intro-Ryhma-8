import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {syncMeasurements} from '../controllers/kubios-controller.js';

const entryRouter = express.Router();

entryRouter
  //.get('/getMeasurements')
  .post('/addMeasurement', authenticateToken, syncMeasurements);
export default entryRouter;
