import * as ProModel from '../models/pro-model.js';

// --- FUNCTIONS FOR PROFESSIONAL ---

export const generateCode = async (req, res, next) => {
  try {
    const proId = req.user.userId;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    await ProModel.createInviteCode(code, proId);

    res.status(201).json({message: 'Code generated', inviteCode: code});
  } catch (err) {
    next(err);
  }
};

export const getPatients = async (req, res, next) => {
  try {
    const proId = req.user.userId;
    const patients = await ProModel.getLinkedPatients(proId);

    res.json(patients);
  } catch (err) {
    next(err);
  }
};

export const getPatientData = async (req, res, next) => {
  try {
    const proId = req.user.userId;
    const {patientId} = req.params;

    const link = await ProModel.getLinkDetails(proId, patientId);

    if (!link) {
      return res
        .status(403)
        .json({message: 'Access denied or no active link.'});
    }

    const measurements = await ProModel.getRecentMeasurements(
      patientId,
      30,
    );

    res.json({
      patientId,
      permissions: link.permissions,
      data: measurements,
    });
  } catch (err) {
    next(err);
  }
};

// Professional can add their comment on the users weekly reports
export const addCommentToReport = async (req, res) => {
  const reportId = req.user.reportId;
  const {comment} = req.body;

  if (!comment) {
    return res.status(400).json({message: 'Comment text is required'});
  }

  try {
    const result = await ProModel.updateProComment(reportId, comment);
    if (result.error) {
      return res.status(result.error).json({message: result.message});
    }

    res.json({message: 'Comment saved successfully'});
  } catch (err) {
    console.error('addCommentToReport Error:', err);
    res.status(500).json({message: 'Internal server error'});
  }
};
