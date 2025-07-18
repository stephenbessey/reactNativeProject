import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleWorkoutError, WorkoutErrorCode } from "../services/error";
import { validateSetCompletion, validateWorkoutCanStart } from "../lib/validation";

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // in seconds
  restTime?: number; // in seconds
  notes?: string;
  imageUri?: string;
  videoUri?: string;
  isCompleted: boolean;
  completedSets: ExerciseSet[];
}

export interface ExerciseSet {
  id: string;
  reps: number;
  weight?: number;
  duration?: number;
  completed: boolean;
  timestamp: Date;
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  isCompleted: boolean;
  startTime?: Date;
  endTime?: Date;
  notes?: string;
  partnerId?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  exercises: Omit<Exercise, 'isCompleted' | 'completedSets'>[];
  createdBy: string;
  createdAt: Date;
}

interface WorkoutState {
  currentWorkout: Workout | null;
  workoutHistory: Workout[];
  workoutTemplates: WorkoutTemplate[];
  isWorkoutActive: boolean;
}

type WorkoutAction =
  | { type: 'START_WORKOUT'; payload: Workout }
  | { type: 'END_WORKOUT' }
  | { type: 'UPDATE_EXERCISE'; payload: { exerciseId: string; updates: Partial<Exercise> } }
  | { type: 'COMPLETE_SET'; payload: { exerciseId: string; set: ExerciseSet } }
  | { type: 'ADD_WORKOUT_TO_HISTORY'; payload: Workout }
  | { type: 'LOAD_WORKOUT_DATA'; payload: Partial<WorkoutState> }
  | { type: 'ADD_TEMPLATE'; payload: WorkoutTemplate }
  | { type: 'UPDATE_WORKOUT_NOTES'; payload: string }
  | { type: 'CLEAR_CURRENT_WORKOUT' };

const INITIAL_WORKOUT_STATE: WorkoutState = {
  currentWorkout: null,
  workoutHistory: [],
  workoutTemplates: [],
  isWorkoutActive: false,
};

const STORAGE_KEYS = {
  WORKOUT_DATA: 'workout_data',
} as const;

const workoutReducer = (state: WorkoutState, action: WorkoutAction): WorkoutState => {
  switch (action.type) {
    case 'START_WORKOUT':
      return {
        ...state,
        currentWorkout: action.payload,
        isWorkoutActive: true,
      };

    case 'END_WORKOUT':
      if (state.currentWorkout) {
        const completedWorkout = createCompletedWorkout(state.currentWorkout);
        return {
          ...state,
          currentWorkout: null,
          isWorkoutActive: false,
          workoutHistory: [completedWorkout, ...state.workoutHistory],
        };
      }
      return state;

    case 'CLEAR_CURRENT_WORKOUT':
      return {
        ...state,
        currentWorkout: null,
        isWorkoutActive: false,
      };

    case 'UPDATE_EXERCISE':
      if (!state.currentWorkout) return state;
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: updateExerciseInList(
            state.currentWorkout.exercises,
            action.payload.exerciseId,
            action.payload.updates
          ),
        },
      };

    case 'COMPLETE_SET':
      if (!state.currentWorkout) return state;
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: completeSetForExercise(
            state.currentWorkout.exercises,
            action.payload.exerciseId,
            action.payload.set
          ),
        },
      };

    case 'ADD_WORKOUT_TO_HISTORY':
      return {
        ...state,
        workoutHistory: [action.payload, ...state.workoutHistory],
      };

    case 'LOAD_WORKOUT_DATA':
      return {
        ...state,
        ...action.payload,
      };

    case 'ADD_TEMPLATE':
      return {
        ...state,
        workoutTemplates: [action.payload, ...state.workoutTemplates],
      };

    case 'UPDATE_WORKOUT_NOTES':
      if (!state.currentWorkout) return state;
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          notes: action.payload,
        },
      };

    default:
      return state;
  }
};

// Helper functions for reducer
const createCompletedWorkout = (workout: Workout): Workout => {
  return {
    ...workout,
    isCompleted: true,
    endTime: new Date(),
  };
};

const updateExerciseInList = (
  exercises: Exercise[],
  exerciseId: string,
  updates: Partial<Exercise>
): Exercise[] => {
  return exercises.map(exercise =>
    exercise.id === exerciseId
      ? { ...exercise, ...updates }
      : exercise
  );
};

const completeSetForExercise = (
  exercises: Exercise[],
  exerciseId: string,
  newSet: ExerciseSet
): Exercise[] => {
  return exercises.map(exercise => {
    if (exercise.id !== exerciseId) return exercise;

    const updatedCompletedSets = [...exercise.completedSets, newSet];
    const isExerciseCompleted = updatedCompletedSets.length >= exercise.sets;

    return {
      ...exercise,
      completedSets: updatedCompletedSets,
      isCompleted: isExerciseCompleted,
    };
  });
};

interface WorkoutContextType {
  state: WorkoutState;
  startWorkout: (workout: Workout) => void;
  endWorkout: () => void;
  clearCurrentWorkout: () => void;
  updateExercise: (exerciseId: string, updates: Partial<Exercise>) => void;
  completeSet: (exerciseId: string, set: ExerciseSet) => void;
  addTemplate: (template: WorkoutTemplate) => void;
  updateWorkoutNotes: (notes: string) => void;
  saveWorkoutData: () => Promise<void>;
  loadWorkoutData: () => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
  children: ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(workoutReducer, INITIAL_WORKOUT_STATE);

  useEffect(() => {
    initializeWorkoutData();
  }, []);

  useEffect(() => {
    saveWorkoutDataToStorage();
  }, [state.workoutHistory, state.workoutTemplates]);

  const initializeWorkoutData = async (): Promise<void> => {
    try {
      await loadWorkoutData();
    } catch (error) {
      handleWorkoutError(
        error instanceof Error ? error : new Error('Failed to initialize workout data'),
        { title: 'Initialization Error' }
      );
    }
  };

  const saveWorkoutDataToStorage = async (): Promise<void> => {
    try {
      await saveWorkoutData();
    } catch (error) {
      handleWorkoutError(
        error instanceof Error ? error : new Error('Failed to save workout data'),
        { title: 'Save Error', showUserAlert: false }
      );
    }
  };

  const saveWorkoutData = async (): Promise<void> => {
    try {
      const dataToSave = {
        workoutHistory: state.workoutHistory,
        workoutTemplates: state.workoutTemplates,
        lastSaved: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.WORKOUT_DATA, 
        JSON.stringify(dataToSave)
      );
    } catch (error) {
      throw new Error(`Failed to save workout data: ${error}`);
    }
  };

  const loadWorkoutData = async (): Promise<void> => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_DATA);
      
      if (!savedData) {
        return; // No saved data, use initial state
      }

      const parsedData = JSON.parse(savedData);
      const workoutHistory = deserializeWorkoutHistory(parsedData.workoutHistory || []);
      const workoutTemplates = deserializeWorkoutTemplates(parsedData.workoutTemplates || []);

      dispatch({
        type: 'LOAD_WORKOUT_DATA',
        payload: { workoutHistory, workoutTemplates },
      });
    } catch (error) {
      throw new Error(`Failed to load workout data: ${error}`);
    }
  };

  const deserializeWorkoutHistory = (workoutData: any[]): Workout[] => {
    return workoutData.map((workout: any) => ({
      ...workout,
      date: new Date(workout.date),
      startTime: workout.startTime ? new Date(workout.startTime) : undefined,
      endTime: workout.endTime ? new Date(workout.endTime) : undefined,
      exercises: workout.exercises?.map((exercise: any) => ({
        ...exercise,
        completedSets: exercise.completedSets?.map((set: any) => ({
          ...set,
          timestamp: new Date(set.timestamp),
        })) || [],
      })) || [],
    }));
  };

  const deserializeWorkoutTemplates = (templateData: any[]): WorkoutTemplate[] => {
    return templateData.map((template: any) => ({
      ...template,
      createdAt: new Date(template.createdAt),
    }));
  };

  const startWorkout = (workout: Workout): void => {
    try {
      validateWorkoutCanStart(workout.exercises);
      dispatch({ type: 'START_WORKOUT', payload: workout });
    } catch (error) {
      handleWorkoutError(
        error instanceof Error ? error : new Error('Failed to start workout'),
        { title: 'Workout Start Error' }
      );
      throw error;
    }
  };

  const endWorkout = (): void => {
    dispatch({ type: 'END_WORKOUT' });
  };

  const clearCurrentWorkout = (): void => {
    dispatch({ type: 'CLEAR_CURRENT_WORKOUT' });
  };

  const updateExercise = (exerciseId: string, updates: Partial<Exercise>): void => {
    dispatch({ type: 'UPDATE_EXERCISE', payload: { exerciseId, updates } });
  };

  const completeSet = (exerciseId: string, set: ExerciseSet): void => {
    try {
      validateSetCompletion(set.reps);
      dispatch({ type: 'COMPLETE_SET', payload: { exerciseId, set } });
    } catch (error) {
      handleWorkoutError(
        error instanceof Error ? error : new Error('Failed to complete set'),
        { title: 'Set Completion Error' }
      );
      throw error;
    }
  };

  const addTemplate = (template: WorkoutTemplate): void => {
    dispatch({ type: 'ADD_TEMPLATE', payload: template });
  };

  const updateWorkoutNotes = (notes: string): void => {
    dispatch({ type: 'UPDATE_WORKOUT_NOTES', payload: notes });
  };

  const contextValue: WorkoutContextType = {
    state,
    startWorkout,
    endWorkout,
    clearCurrentWorkout,
    updateExercise,
    completeSet,
    addTemplate,
    updateWorkoutNotes,
    saveWorkoutData,
    loadWorkoutData,
  };

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};