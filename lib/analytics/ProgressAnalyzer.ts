import { Workout } from '../../contexts/WorkoutContext';

const ANALYTICS_CONSTANTS = {
  WEEKS_TO_ANALYZE: 8,
} as const;

export class ProgressAnalyzer {
  generateWeeklyData(workouts: Workout[]): Array<{ week: string; workouts: number; volume: number }> {
    const currentDate = new Date();
    const weeklyData: Array<{ week: string; workouts: number; volume: number }> = [];

    for (let weekOffset = 0; weekOffset < ANALYTICS_CONSTANTS.WEEKS_TO_ANALYZE; weekOffset++) {
      const weekData = this.calculateWeekData(workouts, currentDate, weekOffset);
      weeklyData.unshift(weekData);
    }

    return weeklyData;
  }

  private calculateWeekData(
    workouts: Workout[], 
    referenceDate: Date, 
    weekOffset: number
  ): { week: string; workouts: number; volume: number } {
    const { weekStart, weekEnd } = this.calculateWeekBoundaries(referenceDate, weekOffset);
    const weekWorkouts = this.filterWorkoutsByDateRange(workouts, weekStart, weekEnd);
    
    return {
      week: this.formatWeekLabel(weekStart),
      workouts: weekWorkouts.length,
      volume: this.calculateTotalVolume(weekWorkouts),
    };
  }

  private calculateTotalVolume(workouts: Workout[]): number {
    return workouts.reduce((total, workout) => 
      total + this.calculateWorkoutVolume(workout.exercises), 0
    );
  }

  private calculateWorkoutVolume(exercises: any[]): number {
    return exercises.reduce((volume, exercise) => 
      volume + this.calculateExerciseVolume(exercise), 0
    );
  }

  private calculateExerciseVolume(exercise: any): number {
    return exercise.completedSets.reduce((volume, set) => 
      volume + (set.reps * (set.weight || 0)), 0
    );
  }

  private calculateWeekBoundaries(
    referenceDate: Date, 
    weekOffset: number
  ): { weekStart: Date; weekEnd: Date } {
    const weekStart = new Date(referenceDate);
    weekStart.setDate(referenceDate.getDate() - (weekOffset * 7));
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    return { weekStart, weekEnd };
  }

  private filterWorkoutsByDateRange(
    workouts: Workout[], 
    startDate: Date, 
    endDate: Date
  ): Workout[] {
    return workouts.filter(workout => 
      workout.date >= startDate && workout.date <= endDate
    );
  }

  private formatWeekLabel(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  }
}
