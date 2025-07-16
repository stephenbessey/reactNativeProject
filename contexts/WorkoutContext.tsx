import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  | { type: 'UPDATE_WORKOUT_NOTES'; payload: string };

const initialState: WorkoutState = {
  currentWorkout: null,
  workoutHistory: [],
  workoutTemplates: [],
  isWorkoutActive: false,
};

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
        const completedWorkout = {
          ...state.currentWorkout,
          isCompleted: true,
          endTime: new Date(),
        };
        return {
          ...state,
          currentWorkout: null,
          isWorkoutActive: false,
          workoutHistory: [completedWorkout, ...state.workoutHistory],
        };
      }
      return state;

    case 'UPDATE_EXERCISE':
      if (!state.currentWorkout) return state;
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? { ...exercise, ...action.payload.updates }
              : exercise
          ),
        },
      };

    case 'COMPLETE_SET':
      if (!state.currentWorkout) return state;
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? {
                  ...exercise,
                  completedSets: [...exercise.completedSets, action.payload.set],
                  isCompleted: exercise.completedSets.length + 1 >= exercise.sets,
                }
              : exercise
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

interface WorkoutContextType {
  state: WorkoutState;
  startWorkout: (workout: Workout) => void;
  endWorkout: () => void;
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
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  useEffect(() => {
    loadWorkoutData();
  }, []);

  useEffect(() => {
    saveWorkoutData();
  }, [state.workoutHistory, state.workoutTemplates]);

  const saveWorkoutData = async (): Promise<void> => {
    try {
      const dataToSave = {
        workoutHistory: state.workoutHistory,
        workoutTemplates: state.workoutTemplates,
      };
      await AsyncStorage.setItem('workout_data', JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('Failed to save workout data:', error);
    }
  };

  const loadWorkoutData = async (): Promise<void> => {
    try {
      const savedData = await AsyncStorage.getItem('workout_data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const workoutHistory = parsedData.workoutHistory?.map((workout: any) => ({
          ...workout,
          date: new Date(workout.date),
          startTime: workout.startTime ? new Date(workout.startTime) : undefined,
          endTime: workout.endTime ? new Date(workout.endTime) : undefined,
        })) || [];

        const workoutTemplates = parsedData.workoutTemplates?.map((template: any) => ({
          ...template,
          createdAt: new Date(template.createdAt),
        })) || [];

        dispatch({
          type: 'LOAD_WORKOUT_DATA',
          payload: { workoutHistory, workoutTemplates },
        });
      }
    } catch (error) {
      console.warn('Failed to load workout data:', error);
    }
  };

  const startWorkout = (workout: Workout): void => {
    dispatch({ type: 'START_WORKOUT', payload: workout });
  };

  const endWorkout = (): void => {
    dispatch({ type: 'END_WORKOUT' });
  };

  const updateExercise = (exerciseId: string, updates: Partial<Exercise>): void => {
    dispatch({ type: 'UPDATE_EXERCISE', payload: { exerciseId, updates } });
  };

  const completeSet = (exerciseId: string, set: ExerciseSet): void => {
    dispatch({ type: 'COMPLETE_SET', payload: { exerciseId, set } });
  };

  const addTemplate = (template: WorkoutTemplate): void => {
    dispatch({ type: 'ADD_TEMPLATE', payload: template });
  };

  const updateWorkoutNotes = (notes: string): void => {
    dispatch({ type: 'UPDATE_WORKOUT_NOTES', payload: notes });
  };

  const value: WorkoutContextType = {
    state,
    startWorkout,
    endWorkout,
    updateExercise,
    completeSet,
    addTemplate,
    updateWorkoutNotes,
    saveWorkoutData,
    loadWorkoutData,
  };

  return (
    <WorkoutContext.Provider value={value}>
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
