export const validateUsername = (username: string): boolean => {
  return username.trim().length > 0;
};

export const validateUserType = (userType: string | null): boolean => {
  return userType === 'coach' || userType === 'trainee';
};

export const validateSelections = (selections: unknown[]): boolean => {
  return Array.isArray(selections) && selections.length > 0;
};