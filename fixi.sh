# Complete Missing Files Based on Existing Project

## 1. Update factories/index.ts (add missing utility functions)

```typescript
export * from './UserFactory';
export * from './WorkoutFactory';
export * from './IdFactory';

// Helper functions that are imported throughout the project
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
```

## 2. Update formatters/index.ts (add missing formatDuration function)

```typescript
export * from './WorkoutFormatter';

// Add the formatDuration function that's imported in RestTimer
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) return `${seconds}s`;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
};
```

## 3. Create components/workout/MotionDetector.tsx (imported in ExerciseCard)

```typescript
import React, { useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface MotionDetectorProps {
  visible: boolean;
  targetReps: number;
  onDetection: (reps: number) => void;
  onClose: () => void;
}

export const MotionDetector: React.FC<MotionDetectorProps> = ({
  visible,
  targetReps,
  onDetection,
  onClose,
}) => {
  const [detectedReps, setDetectedReps] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleStartDetection = () => {
    setIsDetecting(true);
    setDetectedReps(0);
    
    // Simple simulation - in real implementation this would use motion sensors
    const interval = setInterval(() => {
      setDetectedReps(prev => {
        const newCount = prev + 1;
        if (newCount >= targetReps) {
          clearInterval(interval);
          setIsDetecting(false);
          setTimeout(() => onDetection(newCount), 500);
        }
        return newCount;
      });
    }, 1000);
  };

  const handleManualComplete = () => {
    onDetection(detectedReps || targetReps);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Motion Rep Counter</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.counter}>
              <Text style={styles.repsText}>{detectedReps}</Text>
              <Text style={styles.targetText}>/ {targetReps} reps</Text>
            </View>

            {isDetecting && (
              <Text style={styles.statusText}>Detecting movement...</Text>
            )}
          </View>

          <View style={styles.controls}>
            {!isDetecting ? (
              <Pressable style={styles.startButton} onPress={handleStartDetection}>
                <Ionicons name="play" size={20} color="white" />
                <Text style={styles.buttonText}>Start Detection</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.completeButton} onPress={handleManualComplete}>
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.buttonText}>Complete Set</Text>
              </Pressable>
            )}
            
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: '90%',
    maxWidth: 400,
    ...theme.shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  counter: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  repsText: {
    fontSize: 64,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    lineHeight: 70,
  },
  targetText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  statusText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  controls: {
    gap: theme.spacing.md,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  cancelButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  cancelText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
});
```

## 4. Update components/workout/index.ts

```typescript
export * from './RestTimer';
export * from './WorkoutTimer';
export * from './NumberInput';
export * from './MotionDetector';
```

## 5. Create services/error/errorHandler.ts (imported in WorkoutContext)

```typescript
import { Alert } from 'react-native';
import { WorkoutError, WorkoutErrorCode } from './WorkoutError';

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
      case WorkoutErrorCode.MOTION_DETECTION_FAILED:
        return 'Unable to detect movement. Try adjusting sensitivity or use manual counting.';
      case WorkoutErrorCode.DATA_SAVE_FAILED:
        return 'Failed to save workout data. Please try again.';
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
```

## 6. Update lib/validation/index.ts

```typescript
export * from './ExerciseValidator';
export * from './UserValidator';
export * from './ValidationResult';
export * from './workoutValidation';
export * from './userValidation';
```

## 7. Create lib/validation/workoutValidation.ts (imported in WorkoutContext)

```typescript
import { WORKOUT_LIMITS } from '../../constants/workoutConstants';
import { Exercise } from '../../contexts/WorkoutContext';
import { WorkoutError, WorkoutErrorCode } from '../../services/error/WorkoutError';

export interface ExerciseValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateExerciseName = (name: string): boolean => {
  return name.trim().length > 0;
};

export const validateExerciseSets = (sets: number): boolean => {
  return sets >= WORKOUT_LIMITS.SETS.MINIMUM && 
         sets <= WORKOUT_LIMITS.SETS.MAXIMUM;
};

export const validateExerciseReps = (reps: number): boolean => {
  return reps >= WORKOUT_LIMITS.REPS.MINIMUM && 
         reps <= WORKOUT_LIMITS.REPS.MAXIMUM;
};

export const validateCompleteExercise = (exercise: Partial<Exercise>): ExerciseValidationResult => {
  const errors: string[] = [];

  if (!exercise.name || !validateExerciseName(exercise.name)) {
    errors.push('Exercise name is required and cannot be empty');
  }

  if (exercise.sets === undefined || !validateExerciseSets(exercise.sets)) {
    errors.push(`Sets must be between ${WORKOUT_LIMITS.SETS.MINIMUM} and ${WORKOUT_LIMITS.SETS.MAXIMUM}`);
  }

  if (exercise.reps === undefined || !validateExerciseReps(exercise.reps)) {
    errors.push(`Reps must be between ${WORKOUT_LIMITS.REPS.MINIMUM} and ${WORKOUT_LIMITS.REPS.MAXIMUM}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateWorkoutCanStart = (exercises: Exercise[]): void => {
  if (exercises.length === 0) {
    throw new WorkoutError(
      'Cannot start workout without exercises',
      WorkoutErrorCode.WORKOUT_START_FAILED,
      { exerciseCount: exercises.length }
    );
  }
};

export const validateSetCompletion = (reps: number): void => {
  if (reps < WORKOUT_LIMITS.REPS.MINIMUM) {
    throw new WorkoutError(
      'Set must have at least one rep',
      WorkoutErrorCode.INVALID_EXERCISE_DATA,
      { reps }
    );
  }
};
```

## 8. Create lib/validation/userValidation.ts (imported in multiple app files)

```typescript
import { UserType } from '../../types';

export const validateUsername = (username: string): boolean => {
  return username.trim().length >= 1;
};

export const validateUserType = (userType: UserType | null): boolean => {
  return userType === 'coach' || userType === 'trainee';
};

export const validateSelections = (selections: any[]): boolean => {
  return selections.length > 0;
};
```

## 9. Update lib/analytics/workoutAnalytics.ts (fix the imports)

Looking at your existing file, update the imports at the top:

```typescript
import { Workout, Exercise } from '../../contexts/WorkoutContext';
import { calculateTotalVolume } from '../calculations/workoutCalculations';
```

## 10. Update components/exercise/index.ts

```typescript
export * from './ExerciseCard';
export * from './SetTracker';
export * from './PhotoCapture';
export * from './NumberInput';
export * from './ExerciseHeader';
export * from './ExerciseProgress';
```

These are the actual missing files and updates needed based on what's imported throughout your existing project. The main issues were:

1. Missing utility functions in factories/index.ts
2. Missing MotionDetector component
3. Missing validation files  
4. Missing error handler
5. Missing formatDuration function

After creating these files, your imports should work correctly.