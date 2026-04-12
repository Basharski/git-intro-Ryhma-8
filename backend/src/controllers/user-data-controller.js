import {selectUserById} from '../models/user-model.js';

export const getUserDataById = async (req, res, next) => {
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
