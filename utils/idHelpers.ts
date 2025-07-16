export const createWorkoutId = (): string => {
  return `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createExerciseId = (): string => {
  return `exercise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createSetId = (): string => {
  return `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createTemplateId = (): string => {
  return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
