import {
  getReportsByUserId,
  generateReportsForUser,
  getLatestReportByUserId,
} from '../models/weekly-report-model.js';

// Get all reports for a specific user
export const getUserReports = async (req, res) => {
  const userId = req.user.userId;

  try {
    const reports = await getReportsByUserId(userId);
    if (reports.error) {
      return res.status(reports.error).json({message: reports.message});
    }

    res.json({reports});
  } catch (err) {
    console.error('getPatientReports Error:', err);
    res.status(500).json({message: 'Internal server error'});
  }
};

// Gets the latest weekly report
export const getLatestUserReport = async (req, res) => {
  const userId = req.user.userId;

  try {
    const report = await getLatestReportByUserId(userId);
    if (report.error) {
      return res.status(report.error).json({message: report.message});
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({message: 'Internal server error'});
  }
};

// Generates weekly reports for the user from the data already in the database
export const triggerReportGeneration = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await generateReportsForUser(userId);
    if (result.error) {
      return res.status(result.error).json({message: result.message});
    }
    res
      .status(201)
      .json({message: `Successfully generated ${result.inserted} reports.`});
  } catch (err) {
    console.error('triggerReportGeneration Error:', err);
    res.status(500).json({message: 'Internal server error'});
  }
};
