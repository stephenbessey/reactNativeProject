import { useState } from 'react';
import { User, WorkoutPartner, WorkoutDay, UserType } from '../types';
import { MOCK_COACHES, MOCK_TRAINEES, WORKOUT_DAYS } from '../constants/workoutData';
import { createUserId } from '../utils/userHelpers';
import { validateUsername, validateUserType } from '../utils/validation';
import { handleWorkoutError, WorkoutErrorCode } from '../utils/errorHandling';

interface UseWorkoutSetupReturn {
  user: User | null;
  partners: WorkoutPartner[];
  workoutDays: WorkoutDay[];
  setUser: (user: User) => void;
  createUser: (username: string, type: UserType) => User;
  initializePartners: (userType: UserType) => void;
  togglePartnerSelection: (partnerId: string) => void;
  toggleDaySelection: (dayId: string) => void;
  getSelectedPartners: () => WorkoutPartner[];
  getSelectedDays: () => WorkoutDay[];
  resetSelections: () => void;
}

export const useWorkoutSetup = (): UseWorkoutSetupReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [partners, setPartners] = useState<WorkoutPartner[]>([]);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(WORKOUT_DAYS);

  const createUser = (username: string, type: UserType): User => {
    try {
      if (!validateUsername(username)) {
        throw new Error('Invalid username provided');
      }

      if (!validateUserType(type)) {
        throw new Error('Invalid user type provided');
      }

      return {
        id: createUserId(),
        username: username.trim(),
        type,
      };
    } catch (error) {
      handleWorkoutError(
        new Error('Failed to create user profile'),
        { title: 'User Creation Error' }
      );
      throw error;
    }
  };

  const initializePartners = (userType: UserType): void => {
    try {
      const availablePartners = determineAvailablePartners(userType);
      setPartners([...availablePartners]);
    } catch (error) {
      handleWorkoutError(
        new Error('Failed to load available partners'),
        { title: 'Partner Loading Error' }
      );
    }
  };

  const determineAvailablePartners = (userType: UserType): WorkoutPartner[] => {
    switch (userType) {
      case 'coach':
        return MOCK_TRAINEES;
      case 'trainee':
        return MOCK_COACHES;
      default:
        throw new Error(`Unknown user type: ${userType}`);
    }
  };

  const togglePartnerSelection = (partnerId: string): void => {
    setPartners(currentPartners =>
      currentPartners.map(partner =>
        partner.id === partnerId
          ? { ...partner, isSelected: !partner.isSelected }
          : partner
      )
    );
  };

  const toggleDaySelection = (dayId: string): void => {
    setWorkoutDays(currentDays =>
      currentDays.map(day =>
        day.id === dayId
          ? { ...day, isSelected: !day.isSelected }
          : day
      )
    );
  };

  const getSelectedPartners = (): WorkoutPartner[] => {
    return partners.filter(partner => partner.isSelected);
  };

  const getSelectedDays = (): WorkoutDay[] => {
    return workoutDays.filter(day => day.isSelected);
  };

  const resetSelections = (): void => {
    setPartners(currentPartners =>
      currentPartners.map(partner => ({ ...partner, isSelected: false }))
    );
    setWorkoutDays(
      WORKOUT_DAYS.map(day => ({ ...day, isSelected: false }))
    );
  };

  return {
    user,
    partners,
    workoutDays,
    setUser,
    createUser,
    initializePartners,
    togglePartnerSelection,
    toggleDaySelection,
    getSelectedPartners,
    getSelectedDays,
    resetSelections,
  };
};