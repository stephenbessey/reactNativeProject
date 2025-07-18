import { router } from 'expo-router';
import { UserType } from '../constants/userTypes';
import { WorkoutPartner, WorkoutDay } from '../types';
import { serializePartners, serializeDays } from '../utils/dataTransformers';

export const useWorkoutNavigation = () => {
  const navigateToPartnerSelect = (username: string, userType: UserType): void => {
    router.push({
      pathname: '/partner-select',
      params: { username, userType },
    });
  };

  const navigateToDaySelect = (
    username: string, 
    userType: UserType, 
    selectedPartners: WorkoutPartner[]
  ): void => {
    router.push({
      pathname: '/day-select',
      params: {
        username,
        userType,
        selectedPartners: serializePartners(selectedPartners),
      },
    });
  };

  const navigateToSummary = (
    username: string,
    userType: UserType,
    selectedPartners: WorkoutPartner[],
    selectedDays: WorkoutDay[]
  ): void => {
    router.push({
      pathname: '/summary',
      params: {
        username,
        userType,
        selectedPartners: serializePartners(selectedPartners),
        selectedDays: serializeDays(selectedDays),
      },
    });
  };

  const navigateToHome = (): void => {
    router.dismissAll();
    router.replace('/');
  };

  return {
    navigateToPartnerSelect,
    navigateToDaySelect,
    navigateToSummary,
    navigateToHome,
  };
};
