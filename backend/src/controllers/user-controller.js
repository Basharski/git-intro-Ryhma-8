import * as UserModel from '../models/user-model.js';

// Get users data by their ID
export const getUserDataById = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await UserModel.selectUserById(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Updates the users profile data
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const {name, height, weight} = req.body;

    const updateData = {name, height, weight};

    const result = await UserModel.updateUserDataById(userId, updateData);

    if (result) {
      res.json({message: 'Profile updated succesfully'});
    } else {
      res.status(404).json({message: 'User not found or no changes made'});
    }
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    await UserModel.deleteUserData(userId);
    res.json({message: 'Tili ja kaikki tiedot poistettu onnistuneesti.'});
  } catch (err) {
    res.status(500).json({error: 'Tilin poistaminen epäonnistui.'});
  }
};

// Claims the invitation code and creates a link between user and professional
export const claimCode = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {shareCode} = req.body;

    const invite = await UserModel.findInviteCode(shareCode);

    if (!invite) {
      return res.status(404).json({message: 'Invalid or expired code.'});
    }

    const proId = invite.pro_id;
    const existingLink = await UserModel.getLinkDetails(proId, userId);

    if (existingLink) {
      await UserPro.deleteInviteCode(code);
      return res
        .status(400)
        .json({message: 'Already linked to this professional.'});
    }

    const defaultPermissions = JSON.stringify({
      share_hrv: true,
      share_entries: true,
    });

    console.log('DATA: ', proId, userId, defaultPermissions);

    await UserModel.createPatientProLink(proId, userId, defaultPermissions);
    await UserModel.updatePatientProCode(userId, shareCode);
    await UserModel.deleteInviteCode(shareCode);

    res.status(201).json({message: 'Successfully linked!'});
  } catch (err) {
    next(err);
  }
};

// Updates the professionals permissions on what data they can see
export const updateShareDataPermissions = async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const {proId, permissions} = req.body;

    const success = await UserModel.updateLinkPermissions(
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

// Revoke the professionals access to users data
export const revokeAccess = async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    console.log(patientId);

    await UserModel.removePatientProLink(patientId);

    res.status(200).json({message: 'Access revoked successfully.'});
  } catch (err) {
    next(err);
  }
};
