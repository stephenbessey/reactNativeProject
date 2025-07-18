import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, WorkoutTemplate, Exercise } from '../../contexts/WorkoutContext';
import { StorageError } from './StorageError';

export interface WorkoutData {
  workoutHistory: Workout[];
  workoutTemplates: WorkoutTemplate[];
}

export class WorkoutStorageService {
  private static readonly STORAGE_KEYS = {
    WORKOUT_DATA: 'workout_data',
    USER_PREFERENCES: 'user_preferences',
  } as const;

  async saveWorkoutData(data: WorkoutData): Promise<void> {
    try {
      const serializedData = this.serializeWorkoutData(data);
      await AsyncStorage.setItem(
        WorkoutStorageService.STORAGE_KEYS.WORKOUT_DATA, 
        serializedData
      );
    } catch (error) {
      throw new StorageError('Failed to save workout data', { cause: error });
    }
  }

  async loadWorkoutData(): Promise<WorkoutData> {
    try {
      const serializedData = await AsyncStorage.getItem(
        WorkoutStorageService.STORAGE_KEYS.WORKOUT_DATA
      );
      
      if (!serializedData) {
        return this.createEmptyWorkoutData();
      }

      return this.deserializeWorkoutData(serializedData);
    } catch (error) {
      throw new StorageError('Failed to load workout data', { cause: error });
    }
  }

  async clearWorkoutData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(WorkoutStorageService.STORAGE_KEYS.WORKOUT_DATA);
    } catch (error) {
      throw new StorageError('Failed to clear workout data', { cause: error });
    }
  }

  private serializeWorkoutData(data: WorkoutData): string {
    const serializable = {
      ...data,
      lastSaved: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(serializable);
  }

  private deserializeWorkoutData(serializedData: string): WorkoutData {
    const parsed = JSON.parse(serializedData);
    return {
      workoutHistory: this.deserializeWorkouts(parsed.workoutHistory || []),
      workoutTemplates: this.deserializeTemplates(parsed.workoutTemplates || []),
    };
  }

  private deserializeWorkouts(workoutData: any[]): Workout[] {
    return workoutData.map(workout => ({
      ...workout,
      date: new Date(workout.date),
      startTime: workout.startTime ? new Date(workout.startTime) : undefined,
      endTime: workout.endTime ? new Date(workout.endTime) : undefined,
      exercises: this.deserializeExercises(workout.exercises || []),
    }));
  }

  private deserializeExercises(exerciseData: any[]): Exercise[] {
    return exerciseData.map(exercise => ({
      ...exercise,
      completedSets: exercise.completedSets?.map((set: any) => ({
        ...set,
        timestamp: new Date(set.timestamp),
      })) || [],
    }));
  }

  private deserializeTemplates(templateData: any[]): WorkoutTemplate[] {
    return templateData.map(template => ({
      ...template,
      createdAt: new Date(template.createdAt),
    }));
  }

  private createEmptyWorkoutData(): WorkoutData {
    return {
      workoutHistory: [],
      workoutTemplates: [],
    };
  }
}
