import { USER_MESSAGES, UserType } from '../constants/userTypes';

export const getUserDescription = (userType: UserType): string => {
  return USER_MESSAGES[userType].description;
};

export const getWorkflowDescription = (userType: UserType): string => {
  return USER_MESSAGES[userType].workflow;
};

export const getNextStepsText = (userType: UserType): string => {
  return USER_MESSAGES[userType].nextSteps;
};

export const getPartnerLabel = (userType: UserType): string => {
  return USER_MESSAGES[userType].partnerLabel;
};

export const getActionText = (userType: UserType): string => {
  return USER_MESSAGES[userType].actionText;
};

export const createUserId = (): string => {
  return Date.now().toString();
};
