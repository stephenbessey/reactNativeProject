export type UserType = 'coach' | 'trainee';

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

export const USER_TYPES = {
  COACH: 'coach' as UserType,
  TRAINEE: 'trainee' as UserType,
};
