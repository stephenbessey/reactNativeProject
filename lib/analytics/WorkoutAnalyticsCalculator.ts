import { Workout } from '../../contexts/WorkoutContext';
import { ProgressAnalyzer } from './ProgressAnalyzer';
import { ExerciseAnalyzer } from './ExerciseAnalyzer';
import { DurationAnalyzer } from './DurationAnalyzer';

export interface WorkoutAnalytics {
  totalWorkouts: number;
  totalExercises: number;
  totalVolume: number;
  averageWorkoutDuration: number;
  mostCommonExercises: Array<{ name: string; count: number }>;
  weeklyProgress: Array<{ week: string; workouts: number; volume: number }>;
}

export class WorkoutAnalyticsCalculator {
  private readonly progressAnalyzer: ProgressAnalyzer;
  private readonly exerciseAnalyzer: ExerciseAnalyzer;
  private readonly durationAnalyzer: DurationAnalyzer;

  constructor() {
    this.progressAnalyzer = new ProgressAnalyzer();
    this.exerciseAnalyzer = new ExerciseAnalyzer();
    this.durationAnalyzer = new DurationAnalyzer();
  }

  calculateAnalytics(workouts: Workout[]): WorkoutAnalytics {
    const completedWorkouts = this.filterCompleted(workouts);
    
    return {
      totalWorkouts: completedWorkouts.length,
      totalExercises: this.exerciseAnalyzer.countTotalExercises(completedWorkouts),
      totalVolume: this.exerciseAnalyzer.calculateTotalVolume(completedWorkouts),
      averageWorkoutDuration: this.durationAnalyzer.calculateAverage(completedWorkouts),
      mostCommonExercises: this.exerciseAnalyzer.findMostCommon(completedWorkouts),
      weeklyProgress: this.progressAnalyzer.generateWeeklyData(completedWorkouts),
    };
  }

  private filterCompleted(workouts: Workout[]): Workout[] {
    return workouts.filter(workout => workout.isCompleted);
  }
}
