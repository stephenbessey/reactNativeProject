import { WORKOUT_LIMITS } from '../../constants/workoutConstants';
import { Exercise } from '../../contexts/WorkoutContext';
import { WorkoutError, WorkoutErrorCode } from '../../services/error/WorkoutError';

export interface ExerciseValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateExerciseName = (name: string): boolean => {
  return name.trim().length > 0;
};

export const validateExerciseSets = (sets: number): boolean => {
  return sets >= WORKOUT_LIMITS.SETS.MINIMUM && 
         sets <= WORKOUT_LIMITS.SETS.MAXIMUM;
};

export const validateExerciseReps = (reps: number): boolean => {
  return reps >= WORKOUT_LIMITS.REPS.MINIMUM && 
         reps <= WORKOUT_LIMITS.REPS.MAXIMUM;
};

export const validateExerciseWeight = (weight: number): boolean => {
  return weight >= WORKOUT_LIMITS.WEIGHT.MINIMUM && 
         weight <= WORKOUT_LIMITS.WEIGHT.MAXIMUM;
};

export const validateExerciseDuration = (durationSeconds: number): boolean => {
  return durationSeconds >= WORKOUT_LIMITS.DURATION.MINIMUM_SECONDS && 
         durationSeconds <= WORKOUT_LIMITS.DURATION.MAXIMUM_SECONDS;
};

export const validateRestTime = (restTimeSeconds: number): boolean => {
  return restTimeSeconds >= WORKOUT_LIMITS.REST_TIME.MINIMUM_SECONDS && 
         restTimeSeconds <= WORKOUT_LIMITS.REST_TIME.MAXIMUM_SECONDS;
};

export const validateCompleteExercise = (exercise: Partial<Exercise>): ExerciseValidationResult => {
  const errors: string[] = [];

  if (!exercise.name || !validateExerciseName(exercise.name)) {
    errors.push('Exercise name is required and cannot be empty');
  }

  if (exercise.sets === undefined || !validateExerciseSets(exercise.sets)) {
    errors.push(`Sets must be between ${WORKOUT_LIMITS.SETS.MINIMUM} and ${WORKOUT_LIMITS.SETS.MAXIMUM}`);
  }

  if (exercise.reps === undefined || !validateExerciseReps(exercise.reps)) {
    errors.push(`Reps must be between ${WORKOUT_LIMITS.REPS.MINIMUM} and ${WORKOUT_LIMITS.REPS.MAXIMUM}`);
  }

  if (exercise.weight !== undefined && !validateExerciseWeight(exercise.weight)) {
    errors.push(`Weight must be between ${WORKOUT_LIMITS.WEIGHT.MINIMUM} and ${WORKOUT_LIMITS.WEIGHT.MAXIMUM} lbs`);
  }

  if (exercise.duration !== undefined && !validateExerciseDuration(exercise.duration)) {
    errors.push(`Duration must be between ${WORKOUT_LIMITS.DURATION.MINIMUM_SECONDS} and ${WORKOUT_LIMITS.DURATION.MAXIMUM_SECONDS} seconds`);
  }

  if (exercise.restTime !== undefined && !validateRestTime(exercise.restTime)) {
    errors.push(`Rest time must be between ${WORKOUT_LIMITS.REST_TIME.MINIMUM_SECONDS} and ${WORKOUT_LIMITS.REST_TIME.MAXIMUM_SECONDS} seconds`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateWorkoutCanStart = (exercises: Exercise[]): void => {
  if (exercises.length === 0) {
    throw new WorkoutError(
      'Cannot start workout without exercises',
      WorkoutErrorCode.WORKOUT_START_FAILED,
      { exerciseCount: exercises.length }
    );
  }
};

export const validateSetCompletion = (reps: number): void => {
  if (reps < WORKOUT_LIMITS.REPS.MINIMUM) {
    throw new WorkoutError(
      'Set must have at least one rep',
      WorkoutErrorCode.INVALID_EXERCISE_DATA,
      { reps }
    );
  }
};