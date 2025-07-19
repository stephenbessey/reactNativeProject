import { UserType } from '../../types';

export const validateUsername = (username: string): boolean => {
  return username.trim().length >= 1;
};

export const validateUserType = (userType: UserType | null): boolean => {
  return userType === 'coach' || userType === 'trainee';
};

export const validateSelections = (selections: any[]): boolean => {
  return selections.length > 0;
};