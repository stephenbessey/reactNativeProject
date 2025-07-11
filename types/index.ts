import { USER_TYPES } from '../constants/userTypes';

export interface User {
  id: string;
  username: string;
  type: UserType;
}

export interface WorkoutPartner {
  id: string;
  name: string;
  type: UserType;
  isSelected: boolean;
}

export interface WorkoutDay {
  id: string;
  day: string;
  isSelected: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface DailyWorkout {
  id: string;
  day: string;
  exercises: Exercise[];
  isCompleted: boolean;
  completedAt?: Date;
  feedback?: string;
}

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

export interface NavigationParams {
  username: string;
  userType: string;
  selectedPartners?: string;
  selectedDays?: string;
}