import express from 'express';
import * as ProController from '../controllers/pro-controller.js';
import {
  authenticateToken,
  requireProfessional,
} from '../middlewares/authentication.js';

const proRouter = express.Router();

// --- PROFESSIONAL ROUTES ---
// NEED 'role': 'pro' TO ACCESS
proRouter.post(
  '/pro/generate-code',
  authenticateToken,
  requireProfessional,
  ProController.generateCode,
);

// Gets linked patients
proRouter.get(
  '/pro/patients',
  authenticateToken,
  requireProfessional,
  ProController.getPatients,
);

// Gets linked patients data
proRouter.get(
  '/pro/patient/:patientId/data',
  authenticateToken,
  requireProfessional,
  ProController.getPatientData,
);

// Updates a specific weekly reports comment
proRouter.patch(
  '/:reportId/comment',
  authenticateToken,
  requireProfessional,
  ProController.addCommentToReport,
);

export default proRouter;
