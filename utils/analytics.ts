import { Workout, Exercise } from '../contexts/WorkoutContext';
import { calculateTotalVolume } from './workoutUtils';

export interface WorkoutAnalytics {
  totalWorkouts: number;
  totalExercises: number;
  totalVolume: number;
  averageWorkoutDuration: number;
  mostCommonExercises: Array<{ name: string; count: number }>;
  weeklyProgress: Array<{ week: string; workouts: number; volume: number }>;
}

const ANALYTICS_CONSTANTS = {
  WEEKS_TO_ANALYZE: 8,
  TOP_EXERCISES_COUNT: 5,
  MILLISECONDS_IN_MINUTE: 60 * 1000,
} as const;

/**
 * Calculates comprehensive workout analytics from workout history
 * @param workouts - Array of all workouts to analyze
 * @returns Complete analytics object with various metrics
 */
export const calculateWorkoutAnalytics = (workouts: Workout[]): WorkoutAnalytics => {
  const completedWorkouts = filterCompletedWorkouts(workouts);
  
  return {
    totalWorkouts: completedWorkouts.length,
    totalExercises: calculateTotalExerciseCount(completedWorkouts),
    totalVolume: calculateTotalVolumeAcrossWorkouts(completedWorkouts),
    averageWorkoutDuration: calculateAverageWorkoutDuration(completedWorkouts),
    mostCommonExercises: findMostCommonExercises(completedWorkouts),
    weeklyProgress: generateWeeklyProgressData(completedWorkouts),
  };
};

/**
 * Filters workouts to only include completed ones
 * @param workouts - All workouts
 * @returns Only completed workouts
 */
const filterCompletedWorkouts = (workouts: Workout[]): Workout[] => {
  return workouts.filter(workout => workout.isCompleted);
};

/**
 * Calculates total number of exercises across all workouts
 * @param workouts - Completed workouts to analyze
 * @returns Total exercise count
 */
const calculateTotalExerciseCount = (workouts: Workout[]): number => {
  return workouts.reduce(
    (totalCount, workout) => totalCount + workout.exercises.length, 
    0
  );
};

/**
 * Calculates total volume lifted across all workouts
 * @param workouts - Completed workouts to analyze
 * @returns Total volume in pounds
 */
const calculateTotalVolumeAcrossWorkouts = (workouts: Workout[]): number => {
  return workouts.reduce(
    (totalVolume, workout) => totalVolume + calculateTotalVolume(workout.exercises), 
    0
  );
};

/**
 * Calculates average workout duration for workouts with timing data
 * @param workouts - Completed workouts to analyze
 * @returns Average duration in milliseconds
 */
const calculateAverageWorkoutDuration = (workouts: Workout[]): number => {
  const workoutsWithTimingData = workouts.filter(hasCompleteTimingData);
  
  if (workoutsWithTimingData.length === 0) {
    return 0;
  }

  const totalDuration = workoutsWithTimingData.reduce((sum, workout) => {
    const duration = workout.endTime!.getTime() - workout.startTime!.getTime();
    return sum + duration;
  }, 0);

  return totalDuration / workoutsWithTimingData.length;
};

/**
 * Checks if a workout has complete timing data (both start and end times)
 * @param workout - Workout to check
 * @returns True if both start and end times exist
 */
const hasCompleteTimingData = (workout: Workout): boolean => {
  return Boolean(workout.startTime && workout.endTime);
};

/**
 * Finds the most frequently performed exercises across all workouts
 * @param workouts - Completed workouts to analyze
 * @returns Array of exercises sorted by frequency
 */
const findMostCommonExercises = (workouts: Workout[]): Array<{ name: string; count: number }> => {
  const exerciseFrequencyMap = buildExerciseFrequencyMap(workouts);
  
  return Object.entries(exerciseFrequencyMap)
    .map(([exerciseName, count]) => ({ name: exerciseName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, ANALYTICS_CONSTANTS.TOP_EXERCISES_COUNT);
};

/**
 * Builds a frequency map of exercise names to occurrence count
 * @param workouts - Completed workouts to analyze
 * @returns Map of exercise names to their frequency
 */
const buildExerciseFrequencyMap = (workouts: Workout[]): Record<string, number> => {
  const frequencyMap: Record<string, number> = {};
  
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      frequencyMap[exercise.name] = (frequencyMap[exercise.name] || 0) + 1;
    });
  });
  
  return frequencyMap;
};

/**
 * Generates weekly progress data for the last several weeks
 * @param workouts - Completed workouts to analyze
 * @returns Array of weekly progress data
 */
const generateWeeklyProgressData = (workouts: Workout[]): Array<{ week: string; workouts: number; volume: number }> => {
  const currentDate = new Date();
  const weeklyData: Array<{ week: string; workouts: number; volume: number }> = [];

  for (let weekOffset = 0; weekOffset < ANALYTICS_CONSTANTS.WEEKS_TO_ANALYZE; weekOffset++) {
    const weekData = calculateWeekData(workouts, currentDate, weekOffset);
    weeklyData.unshift(weekData); // Add to beginning to maintain chronological order
  }

  return weeklyData;
};

/**
 * Calculates workout data for a specific week
 * @param workouts - All completed workouts
 * @param referenceDate - Date to calculate week from
 * @param weekOffset - Number of weeks back from reference date
 * @returns Week data object
 */
const calculateWeekData = (
  workouts: Workout[], 
  referenceDate: Date, 
  weekOffset: number
): { week: string; workouts: number; volume: number } => {
  const { weekStart, weekEnd } = calculateWeekBoundaries(referenceDate, weekOffset);
  const weekWorkouts = filterWorkoutsByDateRange(workouts, weekStart, weekEnd);
  
  return {
    week: formatWeekLabel(weekStart),
    workouts: weekWorkouts.length,
    volume: calculateTotalVolumeAcrossWorkouts(weekWorkouts),
  };
};

/**
 * Calculates the start and end boundaries for a week
 * @param referenceDate - Date to calculate from
 * @param weekOffset - Number of weeks back
 * @returns Object with week start and end dates
 */
const calculateWeekBoundaries = (
  referenceDate: Date, 
  weekOffset: number
): { weekStart: Date; weekEnd: Date } => {
  const weekStart = new Date(referenceDate);
  weekStart.setDate(referenceDate.getDate() - (weekOffset * 7));
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { weekStart, weekEnd };
};

/**
 * Filters workouts that fall within a specific date range
 * @param workouts - All workouts to filter
 * @param startDate - Range start date
 * @param endDate - Range end date
 * @returns Workouts within the date range
 */
const filterWorkoutsByDateRange = (
  workouts: Workout[], 
  startDate: Date, 
  endDate: Date
): Workout[] => {
  return workouts.filter(workout => 
    workout.date >= startDate && workout.date <= endDate
  );
};

/**
 * Formats a date as a week label
 * @param date - Date to format
 * @returns Formatted week label (MM/DD)
 */
const formatWeekLabel = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

/**
 * Formats a date for display in analytics
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats workout duration for display
 * @param startTime - Workout start time
 * @param endTime - Workout end time
 * @returns Formatted duration string
 */
export const formatWorkoutDuration = (startTime: Date, endTime: Date): string => {
  const durationMilliseconds = endTime.getTime() - startTime.getTime();
  const durationMinutes = Math.floor(durationMilliseconds / ANALYTICS_CONSTANTS.MILLISECONDS_IN_MINUTE);
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
};