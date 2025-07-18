import { UserType, USER_TYPES } from '../../constants/userTypes';
import { ValidationResult } from './ValidationResult';

interface UserCreationData {
  username: string;
  type: UserType;
}

export class UserValidator {
  private static readonly VALIDATION_RULES = {
    USERNAME: {
      minLength: 1,
      maxLength: 50,
      allowedCharacters: /^[a-zA-Z0-9_-]+$/,
    },
  } as const;

  validateUserCreation(userData: Partial<UserCreationData>): ValidationResult {
    const errors: string[] = [];

    this.validateUsername(userData.username, errors);
    this.validateUserType(userData.type, errors);

    return new ValidationResult(errors);
  }

  isValidUsername(username: string | undefined): boolean {
    const result = this.validateUsernameOnly(username);
    return result.isValid;
  }

  isValidUserType(userType: UserType | undefined): boolean {
    return userType === USER_TYPES.COACH || userType === USER_TYPES.TRAINEE;
  }

  validateUsernameOnly(username: string | undefined): ValidationResult {
    const errors: string[] = [];
    this.validateUsername(username, errors);
    return new ValidationResult(errors);
  }

  private validateUsername(username: string | undefined, errors: string[]): void {
    if (!username) {
      errors.push('Username is required');
      return;
    }

    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      errors.push('Username cannot be empty or just whitespace');
      return;
    }

    const { minLength, maxLength, allowedCharacters } = UserValidator.VALIDATION_RULES.USERNAME;

    if (trimmedUsername.length < minLength) {
      errors.push(`Username must be at least ${minLength} character long`);
    }

    if (trimmedUsername.length > maxLength) {
      errors.push(`Username cannot be longer than ${maxLength} characters`);
    }

    if (!allowedCharacters.test(trimmedUsername)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }

    if (trimmedUsername.toLowerCase().includes('admin')) {
      errors.push('Username cannot contain "admin"');
    }

    if (trimmedUsername.toLowerCase().includes('test')) {
      errors.push('Username cannot contain "test"');
    }
  }

  private validateUserType(userType: UserType | undefined, errors: string[]): void {
    if (!userType) {
      errors.push('User type is required');
      return;
    }

    if (!this.isValidUserType(userType)) {
      const validTypes = Object.values(USER_TYPES).join(', ');
      errors.push(`User type must be one of: ${validTypes}`);
    }
  }
}