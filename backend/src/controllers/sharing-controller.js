import * as SharingModel from '../models/sharing-model.js';

// --- FUNCTIONS FOR PROFESSIONAL ---

export const generateCode = async (req, res, next) => {
  try {
    const proId = req.user.userId;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    await SharingModel.createInviteCode(code, proId);

    res.status(201).json({message: 'Code generated', inviteCode: code});
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
    const {patientId} = req.params;

    const link = await SharingModel.getLinkDetails(proId, patientId);

    if (!link) {
      return res
        .status(403)
        .json({message: 'Access denied or no active link.'});
    }

    const measurements = await SharingModel.getRecentMeasurements(
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

// --- FUNCTIONS FOR USER ---

export const claimCode = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {shareCode} = req.body;

    const invite = await SharingModel.findInviteCode(shareCode);

    if (!invite) {
      return res.status(404).json({message: 'Invalid or expired code.'});
    }

    const proId = invite.pro_id;
    const existingLink = await SharingModel.getLinkDetails(proId, userId);

    if (existingLink) {
      await SharingModel.deleteInviteCode(code);
      return res
        .status(400)
        .json({message: 'Already linked to this professional.'});
    }

    const defaultPermissions = JSON.stringify({
      share_hrv: true,
      share_entries: true,
    });

    console.log('DATA: ', proId, userId, defaultPermissions);

    await SharingModel.createPatientProLink(
      proId,
      userId,
      defaultPermissions,
    );
    await SharingModel.updatePatientProCode(userId, shareCode)
    await SharingModel.deleteInviteCode(shareCode);

    res.status(201).json({message: 'Successfully linked!'});
  } catch (err) {
    next(err);
  }
};

export const shareData = async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const {proId, permissions} = req.body;

    const success = await SharingModel.updateLinkPermissions(
      proId,
      patientId,
      JSON.stringify(permissions),
    );

    if (!success) {
      return res.status(404).json({message: 'Link not found.'});
    }

    res.json({message: 'Permissions updated successfully.'});
  } catch (err) {
    next(err);
  }
};

export const revokeAccess = async (req, res, next) => {
  try {
    const patientId = req.user.userId;

    await SharingModel.removePatientProLink(patientId);

    res.status(200).json({message: 'Access revoked successfully.'});
  } catch (err) {
    next(err);
  }
};
