import { useState, useCallback, useMemo } from 'react';
import { User, UserType } from '../../types';
import { UserFactory } from '../../factories/UserFactory';
import { UserValidator } from '../../lib/validation/UserValidator';

export const useUserSetup = () => {
  const [user, setUser] = useState<User | null>(null);
  const userValidator = useMemo(() => new UserValidator(), []);

  const createUser = useCallback((username: string, type: UserType): User => {
    const validationResult = userValidator.validateUserCreation({ username, type });
    
    if (!validationResult.isValid) {
      throw new Error(validationResult.firstError!);
    }

    return UserFactory.createUser({ username: username.trim(), type });
  }, [userValidator]);

  const validateUsername = useCallback((username: string): boolean => {
    return userValidator.isValidUsername(username);
  }, [userValidator]);

  const validateUserType = useCallback((type: UserType): boolean => {
    return userValidator.isValidUserType(type);
  }, [userValidator]);

  const resetUser = useCallback((): void => {
    setUser(null);
  }, []);

  return {
    user,
    setUser,
    createUser,
    validateUsername,
    validateUserType,
    resetUser,
  };
};
