import * as EntryModel from '../models/entry-model.js';

const postUserEntry = async (req, res, next) => {
  try {
    const {userId} = req.user;
    const {mood, workload, message} = req.body;

    const result = await EntryModel.saveUserEntry(userId, {mood, workload, message});

    res.status(201).json({
      message: 'Entry saved successfully',
      id: result.insertId,
    });
  } catch (err) {
    next(err);
  }
};

const showUserEntries = async (req, res, next) => {
  try {
    const {userId} = req.user;

    const results = await EntryModel.getUserEntries(userId)
    if (results) {
      return res.json(results);
    } else {
      res.status(404).json({message: 'No entries found'})
    }
  } catch (err) {
    next(err);
  }
};

const updateUserEntry = async (req, res, next) => {
  try {
    const {userId} = req.user;
    const {id} = req.params;
    const {mood, workload, message} = req.body;

    const result = await EntryModel.changeUserEntry(userId, {
      entryId: id,
      mood,
      workload,
      message,
    });

    if (!result) {
      return res.status(404).json({message: 'Entry not found'});
    }

    res.json({message: 'Entry updated successfully'});
  } catch (err) {
    next(err);
  }
};

const deleteUserEntry = async (req, res, next) => {
  try {
    const {userId} = req.user;
    const {id} = req.params;

    const result = await EntryModel.deleteUserEntry(userId, id);

    if (!result) {
      return res
        .status(404)
        .json({message: 'Failed to delete: Entry not found'});
    }

    res.json({message: 'Entry deleted successfully'});
  } catch (err) {
    next(err);
  }
};

export {postUserEntry, showUserEntries, updateUserEntry, deleteUserEntry};
