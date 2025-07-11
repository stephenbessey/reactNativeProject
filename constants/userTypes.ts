export const USER_TYPES = {
  COACH: 'coach',
  TRAINEE: 'trainee',
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

export const USER_MESSAGES = {
  [USER_TYPES.COACH]: {
    description: 'Create workouts and track trainee progress',
    workflow: 'Create workouts → Monitor completion → Review feedback',
    nextSteps: 'You can now create daily workouts for your trainees and track their progress.',
    partnerLabel: 'trainees',
    actionText: 'create workouts',
  },
  [USER_TYPES.TRAINEE]: {
    description: 'Follow workout plans and provide feedback',
    workflow: 'Receive workouts → Complete exercises → Provide feedback',
    nextSteps: 'You will receive daily workouts from your coach and can provide feedback.',
    partnerLabel: 'coaches',
    actionText: 'receive workouts',
  },
} as const;