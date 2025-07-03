import { useState } from 'react';
import { User, WorkoutPartner, WorkoutDay } from '../types';
import { MOCK_COACHES, MOCK_TRAINEES, WORKOUT_DAYS } from '../constants/workoutData';

export const useWorkoutSetup = () => {
  const [user, setUser] = useState<User | null>(null);
  const [partners, setPartners] = useState<WorkoutPartner[]>([]);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(WORKOUT_DAYS);

  const createUser = (username: string, type: 'coach' | 'trainee'): User => {
    return {
      id: Date.now().toString(),
      name: username,
      type,
      username,
    };
  };

  const initializePartners = (userType: 'coach' | 'trainee'): void => {
    const availablePartners = userType === 'coach' ? MOCK_TRAINEES : MOCK_COACHES;
    setPartners(availablePartners);
  };

  const togglePartnerSelection = (partnerId: string): void => {
    setPartners(prevPartners =>
      prevPartners.map(partner =>
        partner.id === partnerId
          ? { ...partner, isSelected: !partner.isSelected }
          : partner
      )
    );
  };

  const toggleDaySelection = (dayId: string): void => {
    setWorkoutDays(prevDays =>
      prevDays.map(day =>
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

  return {
    user,
    setUser,
    partners,
    workoutDays,
    createUser,
    initializePartners,
    togglePartnerSelection,
    toggleDaySelection,
    getSelectedPartners,
    getSelectedDays,
  };
};
