import { Exercise } from '../../contexts/WorkoutContext';

export const calculateTotalVolume = (exercises: Exercise[]): number => {
  return exercises.reduce((totalVolume, exercise) => {
    const exerciseVolume = exercise.completedSets.reduce((setVolume, set) => {
      const setWeight = set.weight || 0;
      return setVolume + (set.reps * setWeight);
    }, 0);
    return totalVolume + exerciseVolume;
  }, 0);
};