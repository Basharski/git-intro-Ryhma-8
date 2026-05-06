import {
  getReportsByUserId,
  updateProComment,
  generateReportsForUser,
  getLatestReportByUserId,
} from '../models/weekly-report-model.js';

// Get all reports for a patient
export const getPatientReports = async (req, res) => {
  const patientId = req.params.patientId;

  try {
    const reports = await getReportsByUserId(patientId);
    if (reports.error) {
      return res.status(reports.error).json({message: reports.message});
    }

    res.json({reports});
  } catch (err) {
    console.error('getPatientReports Error:', err);
    res.status(500).json({message: 'Internal server error'});
  }
};

// Professional can add their comment on the users weekly reports
export const addCommentToReport = async (req, res) => {
  const reportId = req.params.reportId;
  const {comment} = req.body;

  if (!comment) {
    return res.status(400).json({message: 'Comment text is required'});
  }

  try {
    const result = await updateProComment(reportId, comment);
    if (result.error) {
      return res.status(result.error).json({message: result.message});
    }

    res.json({message: 'Comment saved successfully'});
  } catch (err) {
    console.error('addCommentToReport Error:', err);
    res.status(500).json({message: 'Internal server error'});
  }
};

// Gets the latest weekly report
export const getLatestPatientReport = async (req, res) => {
  const patientId = req.params.patientId;

  try {
    const report = await getLatestReportByUserId(patientId);
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
  const patientId = req.params.patientId;

  try {
    const result = await generateReportsForUser(patientId);
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
