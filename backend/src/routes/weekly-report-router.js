import express from 'express';
import {
  getUserReports,
  triggerReportGeneration,
  getLatestUserReport,
} from '../controllers/weekly-report-controller.js';
import {
  authenticateToken,
  requireProfessional,
} from '../middlewares/authentication.js';

const reportRouter = express.Router();

// Get reports for a specific user
reportRouter.get('/user', authenticateToken, getUserReports);

// Get the latest weekly report for specific user
reportRouter.get('/latest', authenticateToken, getLatestUserReport);

// Generate reports manually for a user
reportRouter.post('/generate', authenticateToken, triggerReportGeneration);

export default reportRouter;
