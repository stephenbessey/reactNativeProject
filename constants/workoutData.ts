import { WorkoutDay, WorkoutPartner } from '../types';

export const WORKOUT_DAYS: WorkoutDay[] = [
  { id: '1', day: 'Monday', isSelected: false },
  { id: '2', day: 'Tuesday', isSelected: false },
  { id: '3', day: 'Wednesday', isSelected: false },
  { id: '4', day: 'Thursday', isSelected: false },
  { id: '5', day: 'Friday', isSelected: false },
  { id: '6', day: 'Saturday', isSelected: false },
  { id: '7', day: 'Sunday', isSelected: false },
];

export const MOCK_COACHES: WorkoutPartner[] = [
  { id: '1', name: 'Alex Johnson', type: 'coach', isSelected: false },
  { id: '2', name: 'Sarah Wilson', type: 'coach', isSelected: false },
  { id: '3', name: 'Mike Chen', type: 'coach', isSelected: false },
  { id: '4', name: 'Emma Davis', type: 'coach', isSelected: false },
];

export const MOCK_TRAINEES: WorkoutPartner[] = [
  { id: '5', name: 'Jordan Smith', type: 'trainee', isSelected: false },
  { id: '6', name: 'Taylor Brown', type: 'trainee', isSelected: false },
  { id: '7', name: 'Casey Lee', type: 'trainee', isSelected: false },
  { id: '8', name: 'Riley Taylor', type: 'trainee', isSelected: false },
];
