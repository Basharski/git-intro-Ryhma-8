import * as exerciseModel from '../models/exercise-model.js';

export const getExercises = async (readiness, stress_index) => {
  try {
    // Calculate the ration between readiness and stress_index
    const intensityFactor = (readiness / 100) * (1 - (stress_index / 25));

    const recommendations = await exerciseModel.getRecommendedExercises(intensityFactor);

    return recommendations;
  } catch (err) {
    console.error('getExercises virhe:', err);
    throw err;
  }
};
