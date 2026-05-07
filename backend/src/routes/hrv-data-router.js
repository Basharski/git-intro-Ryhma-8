import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import * as KubiosController from '../controllers/kubios-data-controller.js';

const hrvEntryRouter = express.Router();

hrvEntryRouter.use(authenticateToken);

hrvEntryRouter.get('/data', KubiosController.getMeasurementsByUserId);

hrvEntryRouter.get('/data/latest', KubiosController.showLatestMeasurement);

hrvEntryRouter.post('/data/sync', KubiosController.syncAndReturn);

export default hrvEntryRouter;
