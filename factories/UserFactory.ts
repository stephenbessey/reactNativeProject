import { User, UserType } from '../types';
import { createUserId } from './IdFactory';

interface CreateUserParams {
  username: string;
  type: UserType;
}

export class UserFactory {
  static createUser(params: CreateUserParams): User {
    return {
      id: createUserId(),
      username: params.username.trim(),
      type: params.type,
    };
  }

  static createMockUser(overrides: Partial<User> = {}): User {
    return {
      id: createUserId(),
      username: 'TestUser',
      type: 'trainee',
      ...overrides,
    };
  }
}