import { Workout } from '../../contexts/WorkoutContext';
import { calculateTotalVolume } from './workoutUtils';

const ANALYTICS_CONSTANTS = {
  TOP_EXERCISES_COUNT: 5,
} as const;

export class ExerciseAnalyzer {
  countTotalExercises(workouts: Workout[]): number {
    return workouts.reduce(
      (totalCount, workout) => totalCount + workout.exercises.length, 
      0
    );
  }

  calculateTotalVolume(workouts: Workout[]): number {
    return workouts.reduce(
      (totalVolume, workout) => totalVolume + calculateTotalVolume(workout.exercises), 
      0
    );
  }

  findMostCommon(workouts: Workout[]): Array<{ name: string; count: number }> {
    const exerciseFrequencyMap = this.buildExerciseFrequencyMap(workouts);
    
    return Object.entries(exerciseFrequencyMap)
      .map(([exerciseName, count]) => ({ name: exerciseName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, ANALYTICS_CONSTANTS.TOP_EXERCISES_COUNT);
  }

  private buildExerciseFrequencyMap(workouts: Workout[]): Record<string, number> {
    const frequencyMap: Record<string, number> = {};
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        frequencyMap[exercise.name] = (frequencyMap[exercise.name] || 0) + 1;
      });
    });
    
    return frequencyMap;
  }
}