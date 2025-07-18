import { Workout } from '../../contexts/WorkoutContext';

const ANALYTICS_CONSTANTS = {
  MILLISECONDS_IN_MINUTE: 60 * 1000,
} as const;

export class DurationAnalyzer {
  calculateAverage(workouts: Workout[]): number {
    const workoutsWithTimingData = workouts.filter(this.hasCompleteTimingData);
    
    if (workoutsWithTimingData.length === 0) {
      return 0;
    }

    const totalDuration = workoutsWithTimingData.reduce((sum, workout) => {
      const duration = this.calculateWorkoutDuration(workout);
      return sum + duration;
    }, 0);

    return totalDuration / workoutsWithTimingData.length;
  }

  calculateWorkoutDuration(workout: Workout): number {
    if (!this.hasCompleteTimingData(workout)) {
      return 0;
    }

    return workout.endTime!.getTime() - workout.startTime!.getTime();
  }

  formatDuration(durationMs: number): string {
    const totalMinutes = Math.floor(durationMs / ANALYTICS_CONSTANTS.MILLISECONDS_IN_MINUTE);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    
    return `${minutes}m`;
  }

  private hasCompleteTimingData(workout: Workout): boolean {
    return Boolean(workout.startTime && workout.endTime);
  }
}