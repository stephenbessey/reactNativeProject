import { Exercise, Workout } from '../contexts/WorkoutContext';

export const calculateWorkoutProgress = (workout: Workout): number => {
  if (workout.exercises.length === 0) return 0;
  
  const completedExercises = workout.exercises.filter(ex => ex.isCompleted).length;
  return (completedExercises / workout.exercises.length) * 100;
};

export const calculateTotalVolume = (exercises: Exercise[]): number => {
  return exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.completedSets.reduce((setTotal, set) => {
      return setTotal + (set.reps * (set.weight || 0));
    }, 0);
    return total + exerciseVolume;
  }, 0);
};

export const getWorkoutStats = (workout: Workout) => {
  const totalExercises = workout.exercises.length;
  const completedExercises = workout.exercises.filter(ex => ex.isCompleted).length;
  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedSets = workout.exercises.reduce((sum, ex) => sum + ex.completedSets.length, 0);
  const totalVolume = calculateTotalVolume(workout.exercises);
  
  return {
    totalExercises,
    completedExercises,
    totalSets,
    completedSets,
    totalVolume,
    progressPercentage: calculateWorkoutProgress(workout),
  };
};

export const isWorkoutComplete = (workout: Workout): boolean => {
  return workout.exercises.length > 0 && workout.exercises.every(ex => ex.isCompleted);
};
