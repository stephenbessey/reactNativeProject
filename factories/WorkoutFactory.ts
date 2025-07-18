import { Workout, Exercise, ExerciseSet } from '../contexts/WorkoutContext';
import { createWorkoutId, createExerciseId, createSetId } from './IdFactory';

export interface CreateWorkoutParams {
  name: string;
  partnerId?: string;
  notes?: string;
}

export interface CreateExerciseParams {
  name: string;
  description?: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  notes?: string;
}

export interface CreateSetParams {
  reps: number;
  weight?: number;
  duration?: number;
}

export class WorkoutFactory {
  static createWorkout(params: CreateWorkoutParams): Workout {
    return {
      id: createWorkoutId(),
      name: params.name.trim(),
      date: new Date(),
      exercises: [],
      isCompleted: false,
      partnerId: params.partnerId,
      notes: params.notes?.trim(),
    };
  }

  static createExercise(params: CreateExerciseParams): Exercise {
    return {
      id: createExerciseId(),
      name: params.name.trim(),
      description: params.description?.trim(),
      sets: params.sets,
      reps: params.reps,
      weight: params.weight,
      duration: params.duration,
      restTime: params.restTime,
      notes: params.notes?.trim(),
      isCompleted: false,
      completedSets: [],
    };
  }

  static createCompletedSet(params: CreateSetParams): ExerciseSet {
    return {
      id: createSetId(),
      reps: params.reps,
      weight: params.weight,
      duration: params.duration,
      completed: true,
      timestamp: new Date(),
    };
  }

  static createMockWorkout(overrides: Partial<Workout> = {}): Workout {
    return {
      id: createWorkoutId(),
      name: 'Test Workout',
      date: new Date(),
      exercises: [],
      isCompleted: false,
      ...overrides,
    };
  }

  static createMockExercise(overrides: Partial<Exercise> = {}): Exercise {
    return {
      id: createExerciseId(),
      name: 'Test Exercise',
      sets: 3,
      reps: 10,
      weight: 135,
      isCompleted: false,
      completedSets: [],
      ...overrides,
    };
  }
}