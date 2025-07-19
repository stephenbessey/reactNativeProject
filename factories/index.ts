export * from './UserFactory';
export * from './WorkoutFactory';
export * from './IdFactory';

export const getUserDescription = (userType: string): string => {
  switch (userType) {
    case 'coach':
      return 'Create workouts and track trainee progress';
    case 'trainee':
      return 'Follow workout plans and provide feedback';
    default:
      return '';
  }
};

export const getPartnerLabel = (userType: string): string => {
  return userType === 'coach' ? 'trainees' : 'coaches';
};

export const getActionText = (userType: string): string => {
  return userType === 'coach' ? 'create workouts' : 'receive workouts';
};

export const getWorkflowDescription = (userType: string): string => {
  switch (userType) {
    case 'coach':
      return 'Create workouts → Monitor completion → Review feedback';
    case 'trainee':
      return 'Receive workouts → Complete exercises → Provide feedback';
    default:
      return '';
  }
};

export const getNextStepsText = (userType: string): string => {
  switch (userType) {
    case 'coach':
      return 'You can now create daily workouts for your trainees and track their progress.';
    case 'trainee':
      return 'You will receive daily workouts from your coach and can provide feedback.';
    default:
      return '';
  }
};