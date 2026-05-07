import promisePool from '../utils/database.js';

export const getRecommendedExercises = async (intensity) => {
  let targetIntensity = 1;
  if (intensity > 0.9) targetIntensity = 5;
  else if (intensity > 0.7) targetIntensity = 4;
  else if (intensity > 0.4) targetIntensity = 3;
  else if (intensity > 0.2) targetIntensity = 2;

  const [rows] = await promisePool.execute(
    'SELECT title, description, category FROM exercise_library WHERE intensity = ? ORDER BY RAND() LIMIT 3',
    [targetIntensity],
  );

  return {
    intensityLevel: targetIntensity,
    factor: intensity.toFixed(2),
    exercises: rows,
  };
};
