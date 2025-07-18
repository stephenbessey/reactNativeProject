export enum WorkoutErrorCode {
  CAMERA_PERMISSION_DENIED = 'CAMERA_PERMISSION_DENIED',
  MEDIA_LIBRARY_PERMISSION_DENIED = 'MEDIA_LIBRARY_PERMISSION_DENIED',
  MOTION_DETECTION_FAILED = 'MOTION_DETECTION_FAILED',
  PHOTO_CAPTURE_FAILED = 'PHOTO_CAPTURE_FAILED',
  DATA_SAVE_FAILED = 'DATA_SAVE_FAILED',
  DATA_LOAD_FAILED = 'DATA_LOAD_FAILED',
  DATA_CORRUPTION = 'DATA_CORRUPTION',
  INVALID_EXERCISE_DATA = 'INVALID_EXERCISE_DATA',
  INVALID_USER_DATA = 'INVALID_USER_DATA',
  INVALID_WORKOUT_STATE = 'INVALID_WORKOUT_STATE',
  WORKOUT_START_FAILED = 'WORKOUT_START_FAILED',
  WORKOUT_END_FAILED = 'WORKOUT_END_FAILED',
  SET_COMPLETION_FAILED = 'SET_COMPLETION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SYNC_FAILED = 'SYNC_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class WorkoutError extends Error {
  constructor(
    message: string,
    public readonly code: WorkoutErrorCode,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'WorkoutError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WorkoutError);
    }
  }

  get fullMessage(): string {
    let message = `[${this.code}] ${this.message}`;
    
    if (this.context && Object.keys(this.context).length > 0) {
      const contextStr = Object.entries(this.context)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(', ');
      message += ` (Context: ${contextStr})`;
    }
    
    return message;
  }

  static permission(type: 'camera' | 'media', context?: Record<string, unknown>): WorkoutError {
    const code = type === 'camera' 
      ? WorkoutErrorCode.CAMERA_PERMISSION_DENIED 
      : WorkoutErrorCode.MEDIA_LIBRARY_PERMISSION_DENIED;
    
    const message = `${type === 'camera' ? 'Camera' : 'Media library'} permission denied`;
    
    return new WorkoutError(message, code, context);
  }

  static data(operation: 'save' | 'load' | 'corruption', cause?: unknown): WorkoutError {
    const codeMap = {
      save: WorkoutErrorCode.DATA_SAVE_FAILED,
      load: WorkoutErrorCode.DATA_LOAD_FAILED,
      corruption: WorkoutErrorCode.DATA_CORRUPTION,
    };

    const messageMap = {
      save: 'Failed to save data',
      load: 'Failed to load data',
      corruption: 'Data corruption detected',
    };

    return new WorkoutError(
      messageMap[operation], 
      codeMap[operation], 
      { cause, operation }
    );
  }

  get isRecoverable(): boolean {
    const recoverableErrors = [
      WorkoutErrorCode.MOTION_DETECTION_FAILED,
      WorkoutErrorCode.PHOTO_CAPTURE_FAILED,
      WorkoutErrorCode.DATA_SAVE_FAILED,
      WorkoutErrorCode.NETWORK_ERROR,
    ];

    return recoverableErrors.includes(this.code);
  }

  get requiresUserAction(): boolean {
    const userActionErrors = [
      WorkoutErrorCode.CAMERA_PERMISSION_DENIED,
      WorkoutErrorCode.MEDIA_LIBRARY_PERMISSION_DENIED,
      WorkoutErrorCode.INVALID_EXERCISE_DATA,
      WorkoutErrorCode.INVALID_USER_DATA,
    ];

    return userActionErrors.includes(this.code);
  }
}
