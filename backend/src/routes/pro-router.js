import express from 'express';
import * as ProController from '../controllers/pro-controller.js';
import {
  authenticateToken,
  requireProfessional,
} from '../middlewares/authentication.js';

const proRouter = express.Router();

proRouter.use(authenticateToken);

// --- PROFESSIONAL ROUTES ---
// NEED 'role': 'pro' TO ACCESS

proRouter.post(
  '/generate-code',
  requireProfessional,
  ProController.generateCode,
);

// Gets linked patients
proRouter.get('/patients', requireProfessional, ProController.getPatients);

// Gets linked patients data
proRouter.get(
  '/patients/:patientId/reports',
  requireProfessional,
  ProController.getPatientReports,
);

// Gets the daily data of a patient
proRouter.get('/patients/:id/daily', ProController.getPatientDailyLogs);

// Updates a specific weekly reports comment
proRouter.put(
  '/reports/feedback',
  requireProfessional,
  ProController.addFeedback,
);

export default proRouter;
