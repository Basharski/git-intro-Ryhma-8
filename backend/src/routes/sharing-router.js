import express from 'express';
import * as SharingController from '../controllers/sharing-controller.js';
import { authenticateToken, requireProfessional } from '../middlewares/authentication.js';

const router = express.Router();

// ==========================================
// PROFESSIONAL ROUTES
// ==========================================
// All these routes require the user to be logged in AND have the 'professional' role

router.post(
  '/pro/generate-code',
  authenticateToken,
  requireProfessional,
  SharingController.generateCode
);

router.get(
  '/pro/patients',
  authenticateToken,
  requireProfessional,
  SharingController.getPatients
);

router.get(
  '/pro/patients/:patientId/data',
  authenticateToken,
  requireProfessional,
  SharingController.getPatientData
);


// ==========================================
// PATIENT / USER ROUTES
// ==========================================
// These routes only require standard authentication

router.post(
  '/patient/claim-code',
  authenticateToken,
  SharingController.claimCode
);

router.put(
  '/patient/permissions',
  authenticateToken,
  SharingController.shareData
);

router.delete(
  '/patient/revoke',
  authenticateToken,
  SharingController.revokeAccess
);

export default router;
