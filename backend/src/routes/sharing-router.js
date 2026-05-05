import express from 'express';
import * as SharingController from '../controllers/sharing-controller.js';
import {
  authenticateToken,
  requireProfessional,
} from '../middlewares/authentication.js';

const sharingRouter = express.Router();

// --- PROFESSIONAL ROUTES ---
// NEED 'role': 'pro' TO ACCESS
sharingRouter.post(
  '/pro/generate-code',
  authenticateToken,
  requireProfessional,
  SharingController.generateCode,
);

sharingRouter.get(
  '/pro/patients',
  authenticateToken,
  requireProfessional,
  SharingController.getPatients,
);

sharingRouter.get(
  '/pro/patients/:patientId/data',
  authenticateToken,
  requireProfessional,
  SharingController.getPatientData,
);

// --- NORMAL USER ROUTES ---
// WORK WITH NORMAL 'role': 'user'
sharingRouter.post(
  '/patient/claim-code',
  authenticateToken,
  SharingController.claimCode,
);

sharingRouter.put(
  '/patient/permissions',
  authenticateToken,
  SharingController.shareData,
);

sharingRouter.delete(
  '/patient/revoke',
  authenticateToken,
  SharingController.revokeAccess,
);

export default sharingRouter;
