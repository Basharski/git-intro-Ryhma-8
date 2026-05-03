import {saveUserEntry} from '../models/entry-model.js';

export const postUserEntry = async (req, res, next) => {
  try {
    const {userId} = req.user;

    const {mood, workload, message} = req.body;

    const entryData = {mood, workload, message};

    const result = await saveUserEntry(userId, entryData);

    if (result) {
      res.json({message: 'Entry saved succesfully'});
    } else {
      res.status(500).json({message: 'Saving entry failed.'});
    }
  } catch (err) {
    next(err);
  }
};
