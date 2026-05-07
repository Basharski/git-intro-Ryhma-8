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

// Haetaan kaikki asiantuntijaan linkitetyt potilaat
export const getPatients = async (req, res) => {
  try {
    const proId = req.user.userId;
    const patients = await ProModel.getLinkedPatients(proId);
    res.json(patients);
  } catch (error) {
    res.status(500).json({error: 'Palvelinvirhe potilaiden haussa'});
  }
};

// Haetaan tietyn potilaan viikkoraportit
export const getPatientReports = async (req, res) => {
  try {
    const proId = req.user.userId;
    const {patientId} = req.params;

    const hasAccess = await ProModel.checkAccess(proId, patientId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({error: 'Ei käyttöoikeutta potilaan tietoihin'});
    }

    const reports = await ProModel.getPatientWeeklyReports(patientId);
    res.json(reports);
  } catch (error) {
    res.status(500).json({error: 'Virhe raporttien haussa'});
  }
};

// Haetaan päivätason tarkka data
export const getPatientDailyLogs = async (req, res) => {
  try {
    const proId = req.user.userId;
    const patientId = req.params.id;
    const {start, end} = req.query; // Haetaan aikaväli query-parametreista

    const hasAccess = await ProModel.checkAccess(proId, patientId);
    if (!hasAccess) {
      return res.status(403).json({error: 'Pääsy evätty'});
    }

    const logs = await ProModel.getPatientDailyLogs(patientId, start, end);
    res.json(logs);
  } catch (error) {
    res.status(500).json({error: 'Virhe lokien haussa'});
  }
};

// Päivitetään ammattilaisen palaute
export const addFeedback = async (req, res) => {
  try {
    const {reportId, feedback} = req.body;
    const result = await ProModel.updateProComment(reportId, feedback);

    if (result.error) {
      return res.status(result.error).json({error: result.message});
    }
    res.json({message: 'Palaute tallennettu'});
  } catch (error) {
    res.status(500).json({error: 'Virhe palautteen tallennuksessa'});
  }
};
