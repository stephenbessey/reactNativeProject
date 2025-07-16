import { Workout, Exercise } from '../contexts/WorkoutContext';

export interface WorkoutAnalytics {
  totalWorkouts: number;
  totalExercises: number;
  totalVolume: number;
  averageWorkoutDuration: number;
  mostCommonExercises: Array<{ name: string; count: number }>;
  weeklyProgress: Array<{ week: string; workouts: number; volume: number }>;
}

export const calculateWorkoutAnalytics = (workouts: Workout[]): WorkoutAnalytics => {
  const completedWorkouts = workouts.filter(w => w.isCompleted);
  
  const totalWorkouts = completedWorkouts.length;
  const totalExercises = completedWorkouts.reduce((sum, w) => sum + w.exercises.length, 0);
  const totalVolume = completedWorkouts.reduce((sum, w) => sum + calculateTotalVolume(w.exercises), 0);
  
  const workoutsWithDuration = completedWorkouts.filter(w => w.startTime && w.endTime);
  const averageWorkoutDuration = workoutsWithDuration.length > 0
    ? workoutsWithDuration.reduce((sum, w) => {
        const duration = w.endTime!.getTime() - w.startTime!.getTime();
        return sum + duration;
      }, 0) / workoutsWithDuration.length
    : 0;

  const exerciseFrequency: { [key: string]: number } = {};
  completedWorkouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      exerciseFrequency[exercise.name] = (exerciseFrequency[exercise.name] || 0) + 1;
    });
  });
  
  const mostCommonExercises = Object.entries(exerciseFrequency)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  const now = new Date();
  const weeklyProgress = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (i * 7));
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const weekWorkouts = completedWorkouts.filter(w => 
      w.date >= weekStart && w.date <= weekEnd
    );
    
    const weekVolume = weekWorkouts.reduce((sum, w) => 
      sum + calculateTotalVolume(w.exercises), 0
    );
    
    return {
      week: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
      workouts: weekWorkouts.length,
      volume: weekVolume,
    };
  }).reverse();
  
  return {
    totalWorkouts,
    totalExercises,
    totalVolume,
    averageWorkoutDuration,
    mostCommonExercises,
    weeklyProgress,
  };
};
