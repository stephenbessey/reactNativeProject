import { Exercise, Workout } from '../../contexts/WorkoutContext';

export const calculateWorkoutProgress = (workout: Workout): number => {
  if (workout.exercises.length === 0) return 0;
  
  const completedExerciseCount = workout.exercises.filter(
    exercise => exercise.isCompleted
  ).length;
  
  return Math.round((completedExerciseCount / workout.exercises.length) * 100);
};

export const calculateTotalVolume = (exercises: Exercise[]): number => {
  return exercises.reduce((totalVolume, exercise) => {
    const exerciseVolume = exercise.completedSets.reduce((setVolume, set) => {
      const setWeight = set.weight || 0;
      return setVolume + (set.reps * setWeight);
    }, 0);
    return totalVolume + exerciseVolume;
  }, 0);
};
