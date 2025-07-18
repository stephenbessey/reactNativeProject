import { Exercise, Workout } from '../contexts/WorkoutContext';

/**
 * Calculates the completion percentage of a workout based on completed exercises
 * @param workout - The workout to analyze
 * @returns Progress percentage (0-100)
 */
export const calculateWorkoutProgress = (workout: Workout): number => {
  if (workout.exercises.length === 0) return 0;
  
  const completedExerciseCount = workout.exercises.filter(
    exercise => exercise.isCompleted
  ).length;
  
  return Math.round((completedExerciseCount / workout.exercises.length) * 100);
};

/**
 * Calculates the total volume (weight × reps) for a list of exercises
 * @param exercises - Array of exercises to calculate volume for
 * @returns Total volume in pounds
 */
export const calculateTotalVolume = (exercises: Exercise[]): number => {
  return exercises.reduce((totalVolume, exercise) => {
    const exerciseVolume = exercise.completedSets.reduce((setVolume, set) => {
      const setWeight = set.weight || 0;
      return setVolume + (set.reps * setWeight);
    }, 0);
    return totalVolume + exerciseVolume;
  }, 0);
};

/**
 * Calculates the total number of completed sets across all exercises
 * @param exercises - Array of exercises to count sets for
 * @returns Total number of completed sets
 */
export const calculateCompletedSets = (exercises: Exercise[]): number => {
  return exercises.reduce((totalSets, exercise) => {
    return totalSets + exercise.completedSets.length;
  }, 0);
};

/**
 * Calculates the total number of planned sets across all exercises
 * @param exercises - Array of exercises to count sets for
 * @returns Total number of planned sets
 */
export const calculatePlannedSets = (exercises: Exercise[]): number => {
  return exercises.reduce((totalSets, exercise) => {
    return totalSets + exercise.sets;
  }, 0);
};

/**
 * Calculates comprehensive workout statistics
 * @param workout - The workout to analyze
 * @returns Object containing various workout statistics
 */
export const getWorkoutStatistics = (workout: Workout) => {
  const totalExerciseCount = workout.exercises.length;
  const completedExerciseCount = workout.exercises.filter(ex => ex.isCompleted).length;
  const plannedSetCount = calculatePlannedSets(workout.exercises);
  const completedSetCount = calculateCompletedSets(workout.exercises);
  const totalVolumeLifted = calculateTotalVolume(workout.exercises);
  const progressPercentage = calculateWorkoutProgress(workout);
  
  return {
    totalExerciseCount,
    completedExerciseCount,
    plannedSetCount,
    completedSetCount,
    totalVolumeLifted,
    progressPercentage,
    isWorkoutComplete: isWorkoutComplete(workout),
  };
};

/**
 * Determines if a workout is completely finished
 * @param workout - The workout to check
 * @returns True if all exercises are completed, false otherwise
 */
export const isWorkoutComplete = (workout: Workout): boolean => {
  if (workout.exercises.length === 0) return false;
  
  return workout.exercises.every(exercise => exercise.isCompleted);
};

/**
 * Calculates workout duration in milliseconds
 * @param startTime - When the workout started
 * @param endTime - When the workout ended (optional, defaults to now)
 * @returns Duration in milliseconds
 */
export const calculateWorkoutDuration = (
  startTime: Date, 
  endTime: Date = new Date()
): number => {
  return endTime.getTime() - startTime.getTime();
};

/**
 * Gets the next incomplete exercise in a workout
 * @param workout - The workout to search
 * @returns The next incomplete exercise, or null if all are complete
 */
export const getNextIncompleteExercise = (workout: Workout): Exercise | null => {
  return workout.exercises.find(exercise => !exercise.isCompleted) || null;
};

/**
 * Calculates the average rest time between sets for an exercise
 * @param exercise - The exercise to analyze
 * @returns Average rest time in seconds, or 0 if insufficient data
 */
export const calculateAverageRestTime = (exercise: Exercise): number => {
  const completedSets = exercise.completedSets;
  
  if (completedSets.length < 2) return 0;
  
  let totalRestTime = 0;
  let restIntervalCount = 0;
  
  for (let i = 1; i < completedSets.length; i++) {
    const previousSet = completedSets[i - 1];
    const currentSet = completedSets[i];
    
    if (previousSet.timestamp && currentSet.timestamp) {
      const restTime = currentSet.timestamp.getTime() - previousSet.timestamp.getTime();
      totalRestTime += restTime;
      restIntervalCount++;
    }
  }
  
  return restIntervalCount > 0 ? Math.round(totalRestTime / restIntervalCount / 1000) : 0;
};

/**
 * Determines if an exercise can be marked as complete
 * @param exercise - The exercise to check
 * @returns True if the exercise has completed all planned sets
 */
export const canCompleteExercise = (exercise: Exercise): boolean => {
  return exercise.completedSets.length >= exercise.sets;
};

/**
 * Gets exercise performance summary for display
 * @param exercise - The exercise to summarize
 * @returns Object with performance metrics
 */
export const getExercisePerformanceSummary = (exercise: Exercise) => {
  const completedSetCount = exercise.completedSets.length;
  const plannedSetCount = exercise.sets;
  const setCompletionPercentage = Math.round((completedSetCount / plannedSetCount) * 100);
  
  const totalRepsCompleted = exercise.completedSets.reduce(
    (total, set) => total + set.reps, 0
  );
  
  const totalVolumeLifted = exercise.completedSets.reduce(
    (total, set) => total + (set.reps * (set.weight || 0)), 0
  );
  
  const averageRepsPerSet = completedSetCount > 0 
    ? Math.round(totalRepsCompleted / completedSetCount)
    : 0;
  
  return {
    completedSetCount,
    plannedSetCount,
    setCompletionPercentage,
    totalRepsCompleted,
    totalVolumeLifted,
    averageRepsPerSet,
    isComplete: exercise.isCompleted,
  };
};