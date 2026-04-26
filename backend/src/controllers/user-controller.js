import {selectUserById, updateUserDataById} from '../models/user-model.js';

const getUserDataById = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await selectUserById(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const {given_name, email, height, weight, date_of_birth} = req.body;

    const updateData = {};
    if (given_name !== undefined) updateData.name = given_name;
    if (email !== undefined) updateData.email = email;
    if (height !== undefined) updateData.height = height;
    if (weight !== undefined) updateData.weight = weight;
    if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth;

    if (Object.keys(updateData).lenght === 0) {
      return res.status(400).json({message: 'Nothing to update'});
    }

    const result = await updateUserDataById(userId, updateData);

    if (result) {
      res.json({message: 'Profile updated succesfully'});
    } else {
      res.status(404).json({message: 'User not found or no changes made'});
    }
  } catch (err) {
    next(err);
  }
};

export {getUserDataById, updateUserProfile};
