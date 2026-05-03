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

    const {name, height, weight} = req.body;

    const updateData = {name, height, weight};

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
