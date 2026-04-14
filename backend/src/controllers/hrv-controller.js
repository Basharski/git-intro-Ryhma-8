import {getMeasurementsByUserId} from '../models/hrv-model.js';

export const getMeasurements = async (req, res, next) => {
  try {
    const {userId} = req.user;

    const measurements = await getMeasurementsByUserId(userId);
    console.log(measurements);
    res.json(measurements);
  } catch (err) {
    next(err);
  }
};
