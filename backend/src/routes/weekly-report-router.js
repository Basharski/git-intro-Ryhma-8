import express from 'express';
import {
  getPatientReports,
  addCommentToReport,
  triggerReportGeneration,
  getLatestPatientReport,
} from '../controllers/weekly-report-controller.js';
import {
  authenticateToken,
  requireProfessional,
} from '../middlewares/authentication.js';

const reportRouter = express.Router();

// Get reports for a patient
reportRouter.get('/patient/:patientId', authenticateToken, getPatientReports);

// Add a comment to a specific weekly report
// Requires 'role': 'pro' to access
reportRouter.put(
  '/:reportId/comment',
  authenticateToken,
  requireProfessional,
  addCommentToReport,
);

// Get the latest weekly report for specific user
reportRouter.get('/latest/:patientId', authenticateToken, getLatestPatientReport);

// Generate reports manually for a patient
reportRouter.post('/generate/:patientId', authenticateToken, triggerReportGeneration);

export default reportRouter;
