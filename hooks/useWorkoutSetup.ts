import { useState } from 'react';
import { createUserId } from "../factories";
import { UserType, WorkoutPartner, WorkoutDay } from '../types';

export interface User {
  id: string;
  username: string;
  type: UserType;
}

const INITIAL_PARTNERS: WorkoutPartner[] = [
  { id: '1', name: 'Alex Smith', type: 'trainee', isSelected: false },
  { id: '2', name: 'Sarah Johnson', type: 'trainee', isSelected: false },
  { id: '3', name: 'Mike Davis', type: 'coach', isSelected: false },
];

const INITIAL_DAYS: WorkoutDay[] = [
  { id: '1', day: 'Monday', isSelected: false },
  { id: '2', day: 'Tuesday', isSelected: false },
  { id: '3', day: 'Wednesday', isSelected: false },
  { id: '4', day: 'Thursday', isSelected: false },
  { id: '5', day: 'Friday', isSelected: false },
  { id: '6', day: 'Saturday', isSelected: false },
  { id: '7', day: 'Sunday', isSelected: false },
];

export const useWorkoutSetup = () => {
  const [user, setUser] = useState<User | null>(null);
  const [partners, setPartners] = useState<WorkoutPartner[]>(INITIAL_PARTNERS);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(INITIAL_DAYS);

  const createUser = (username: string, type: UserType): User => {
    return {
      id: createUserId(),
      username,
      type,
    };
  };

  const initializePartners = (userType: UserType) => {
    // Filter partners based on user type
    const filteredPartners = INITIAL_PARTNERS.filter(p => p.type !== userType);
    setPartners(filteredPartners);
  };

  const togglePartnerSelection = (partnerId: string) => {
    setPartners(prev => prev.map(p => 
      p.id === partnerId ? { ...p, isSelected: !p.isSelected } : p
    ));
  };

  const toggleDaySelection = (dayId: string) => {
    setWorkoutDays(prev => prev.map(d => 
      d.id === dayId ? { ...d, isSelected: !d.isSelected } : d
    ));
  };

  const getSelectedPartners = () => partners.filter(p => p.isSelected);
  const getSelectedDays = () => workoutDays.filter(d => d.isSelected);

  return {
    user,
    setUser,
    createUser,
    partners,
    workoutDays,
    initializePartners,
    togglePartnerSelection,
    toggleDaySelection,
    getSelectedPartners,
    getSelectedDays,
  };
};
