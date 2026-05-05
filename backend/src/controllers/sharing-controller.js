import * as SharingModel from '../models/sharing-model.js';

// --- FUNCTIONS FOR PROFESSIONAL ---

export const generateCode = async (req, res, next) => {
  try {
    const proId = req.user.userId;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    await SharingModel.createInviteCode(code, proId);

    res.status(201).json({ message: 'Code generated', inviteCode: code });
  } catch (err) {
    next(err);
  }
};

export const getPatients = async (req, res, next) => {
  try {
    const proId = req.user.userId;
    const patients = await SharingModel.getLinkedPatients(proId);

    res.json(patients);
  } catch (err) {
    next(err);
  }
};

export const getPatientData = async (req, res, next) => {
  try {
    const proId = req.user.userId;
    const { patientId } = req.params;

    const link = await SharingModel.getLinkDetails(proId, patientId);

    if (!link) {
      return res.status(403).json({ message: 'Access denied or no active link.' });
    }

    // You would use link.permissions here to decide what to return
    const measurements = await SharingModel.getRecentMeasurements(patientId, 30);

    res.json({
      patientId,
      permissions: link.permissions,
      data: measurements
    });
  } catch (err) {
    next(err);
  }
};


// --- FUNCTIONS FOR USER ---

export const claimCode = async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { code } = req.body;

    const invite = await SharingModel.findInviteCode(code);

    if (!invite) {
      return res.status(404).json({ message: 'Invalid or expired code.' });
    }

    const proId = invite.pro_id;
    const existingLink = await SharingModel.getLinkDetails(proId, patientId);

    if (existingLink) {
      await SharingModel.deleteInviteCode(code); // Clean it up anyway
      return res.status(400).json({ message: 'Already linked to this professional.' });
    }

    const defaultPermissions = JSON.stringify({ share_hrv: true, share_sleep: true });

    await SharingModel.createPatientProLink(proId, patientId, defaultPermissions);
    await SharingModel.deleteInviteCode(code);

    res.status(201).json({ message: 'Successfully linked!' });
  } catch (err) {
    next(err);
  }
};

export const shareData = async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { proId, permissions } = req.body;

    const success = await SharingModel.updateLinkPermissions(proId, patientId, JSON.stringify(permissions));

    if (!success) {
      return res.status(404).json({ message: 'Link not found.' });
    }

    res.json({ message: 'Permissions updated successfully.' });
  } catch (err) {
    next(err);
  }
};

export const revokeAccess = async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { proId } = req.body;

    const success = await SharingModel.removePatientProLink(proId, patientId);

    if (!success) {
      return res.status(404).json({ message: 'Link not found.' });
    }

    res.json({ message: 'Access revoked successfully.' });
  } catch (err) {
    next(err);
  }
};
