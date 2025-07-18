import { Alert } from 'react-native';

export enum WorkoutErrorCode {
  CAMERA_PERMISSION_DENIED = 'CAMERA_PERMISSION_DENIED',
  MEDIA_LIBRARY_PERMISSION_DENIED = 'MEDIA_LIBRARY_PERMISSION_DENIED',
  MOTION_DETECTION_FAILED = 'MOTION_DETECTION_FAILED',
  DATA_SAVE_FAILED = 'DATA_SAVE_FAILED',
  DATA_LOAD_FAILED = 'DATA_LOAD_FAILED',
  INVALID_EXERCISE_DATA = 'INVALID_EXERCISE_DATA',
  WORKOUT_START_FAILED = 'WORKOUT_START_FAILED',
  PHOTO_CAPTURE_FAILED = 'PHOTO_CAPTURE_FAILED'
}

export class WorkoutError extends Error {
  constructor(
    message: string,
    public code: WorkoutErrorCode,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'WorkoutError';
  }
}

interface ErrorHandlerOptions {
  showUserAlert?: boolean;
  logToConsole?: boolean;
  title?: string;
}

export const handleWorkoutError = (
  error: Error | WorkoutError,
  options: ErrorHandlerOptions = {}
): void => {
  const {
    showUserAlert = true,
    logToConsole = true,
    title = 'Error'
  } = options;

  if (logToConsole) {
    console.error('Workout Error:', error.message, error);
  }

  if (showUserAlert) {
    const userMessage = getUserFriendlyErrorMessage(error);
    Alert.alert(title, userMessage);
  }
};

const getUserFriendlyErrorMessage = (error: Error | WorkoutError): string => {
  if (error instanceof WorkoutError) {
    switch (error.code) {
      case WorkoutErrorCode.CAMERA_PERMISSION_DENIED:
        return 'Camera access is required to capture exercise photos. Please enable camera permissions in your device settings.';
      case WorkoutErrorCode.MEDIA_LIBRARY_PERMISSION_DENIED:
        return 'Photo library access is required to save exercise photos. Please enable photo permissions in your device settings.';
      case WorkoutErrorCode.MOTION_DETECTION_FAILED:
        return 'Unable to detect movement. Try adjusting sensitivity or use manual counting.';
      case WorkoutErrorCode.DATA_SAVE_FAILED:
        return 'Failed to save workout data. Please try again.';
      case WorkoutErrorCode.DATA_LOAD_FAILED:
        return 'Failed to load workout data. Some information may be unavailable.';
      case WorkoutErrorCode.INVALID_EXERCISE_DATA:
        return 'Invalid exercise information. Please check your inputs and try again.';
      case WorkoutErrorCode.WORKOUT_START_FAILED:
        return 'Unable to start workout. Please ensure you have added at least one exercise.';
      case WorkoutErrorCode.PHOTO_CAPTURE_FAILED:
        return 'Failed to capture photo. Please try again.';
      default:
        return error.message;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export const createWorkoutError = (
  code: WorkoutErrorCode,
  message: string,
  context?: Record<string, unknown>
): WorkoutError => {
  return new WorkoutError(message, code, context);
};