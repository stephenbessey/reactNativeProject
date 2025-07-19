import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { PageHeader } from '../components/sections/PageHeader';
import { ExerciseCard } from '../components/exercise/ExerciseCard';
import { AddExerciseModal } from '../components/forms/AddExerciseModal';
import { WorkoutTimer } from '../components/workout/WorkoutTimer';
import { useWorkout, Workout, Exercise } from '../contexts/WorkoutContext';
import { useTheme } from '../contexts/ThemeContext';
import { createWorkoutId, createExerciseId } from '../factories/IdFactory';

export default function WorkoutDetailScreen() {
  const { workoutName, partnerId, selectedDays } = useLocalSearchParams<Record<string, string>>();
  const [isAddExerciseModalVisible, setIsAddExerciseModalVisible] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [localWorkout, setLocalWorkout] = useState<Workout | null>(null);

  const { state, startWorkout, endWorkout, updateExercise } = useWorkout();
  const { theme } = useTheme();

  const currentWorkout = state.currentWorkout || localWorkout;
  const isWorkoutActive = state.isWorkoutActive;

  useEffect(() => {
    if (!currentWorkout && workoutName) {
      initializeWorkout();
    }
  }, []);

  const initializeWorkout = (): void => {
    const newWorkout: Workout = {
      id: createWorkoutId(),
      name: workoutName || 'New Workout',
      date: new Date(),
      exercises: [],
      isCompleted: false,
      partnerId: partnerId || undefined,
    };

    // Don't start the workout yet - just create it locally
    setLocalWorkout(newWorkout);
  };

  const handleAddExercise = (exercise: Omit<Exercise, 'id' | 'isCompleted' | 'completedSets'>): void => {
    const newExercise: Exercise = {
      ...exercise,
      id: createExerciseId(),
      isCompleted: false,
      completedSets: [],
    };

    if (currentWorkout) {
      const updatedWorkout = {
        ...currentWorkout,
        exercises: [...currentWorkout.exercises, newExercise],
      };

      if (state.isWorkoutActive) {
        // Update the active workout
        startWorkout(updatedWorkout);
      } else {
        // Update the local workout
        setLocalWorkout(updatedWorkout);
      }
    }

    setIsAddExerciseModalVisible(false);
  };

  const handleStartWorkout = (): void => {
    if (!currentWorkout || currentWorkout.exercises.length === 0) {
      Alert.alert('No Exercises', 'Please add at least one exercise before starting the workout.');
      return;
    }

    try {
      const updatedWorkout = {
        ...currentWorkout,
        startTime: new Date(),
      };

      startWorkout(updatedWorkout);
      setWorkoutStarted(true);
      setLocalWorkout(null); // Clear local workout since it's now active
    } catch (error) {
      console.error('Failed to start workout:', error);
      Alert.alert('Error', 'Failed to start workout. Please try again.');
    }
  };

  const handleEndWorkout = (): void => {
    Alert.alert(
      'End Workout',
      'Are you sure you want to end this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Workout',
          style: 'destructive',
          onPress: () => {
            endWorkout();
            setWorkoutStarted(false);
          },
        },
      ]
    );
  };

  const handleExerciseUpdate = (exerciseId: string, updates: Partial<Exercise>): void => {
    if (state.isWorkoutActive) {
      updateExercise(exerciseId, updates);
    } else if (localWorkout) {
      // Update local workout
      const updatedExercises = localWorkout.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      );
      setLocalWorkout({
        ...localWorkout,
        exercises: updatedExercises,
      });
    }
  };

  const completedExercises = currentWorkout?.exercises.filter(ex => ex.isCompleted).length || 0;
  const totalExercises = currentWorkout?.exercises.length || 0;
  const workoutProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const styles = createStyles(theme);

  if (!currentWorkout) {
    return (
      <ScreenContainer>
        <PageHeader title="Loading..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <PageHeader
        title={currentWorkout.name}
        subtitle={`${completedExercises}/${totalExercises} exercises completed`}
      />

      {workoutStarted && currentWorkout.startTime && (
        <WorkoutTimer
          startTime={currentWorkout.startTime}
          style={styles.timer}
        />
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${workoutProgress}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(workoutProgress)}% Complete
        </Text>
      </View>

      <ScrollView
        style={styles.exerciseList}
        showsVerticalScrollIndicator={false}
      >
        {currentWorkout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdate={(updates) => handleExerciseUpdate(exercise.id, updates)}
            isWorkoutActive={workoutStarted && isWorkoutActive}
          />
        ))}

        {currentWorkout.exercises.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No exercises added yet. Tap "Add Exercise" to get started!
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.actionContainer}>
        {!workoutStarted ? (
          <>
            <SelectionButton
              title="Add Exercise"
              onPress={() => setIsAddExerciseModalVisible(true)}
              variant="secondary"
            />
            <SelectionButton
              title="Start Workout"
              onPress={handleStartWorkout}
              variant="primary"
              disabled={currentWorkout.exercises.length === 0}
            />
          </>
        ) : (
          <>
            <SelectionButton
              title="Add Exercise"
              onPress={() => setIsAddExerciseModalVisible(true)}
              variant="secondary"
            />
            <SelectionButton
              title="End Workout"
              onPress={handleEndWorkout}
              variant="primary"
            />
          </>
        )}
      </View>

      <AddExerciseModal
        visible={isAddExerciseModalVisible}
        onClose={() => setIsAddExerciseModalVisible(false)}
        onAddExercise={handleAddExercise}
      />
    </ScreenContainer>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  timer: {
    marginBottom: theme.spacing.md,
  },
  progressContainer: {
    marginBottom: theme.spacing.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  progressText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeights.medium,
  },
  exerciseList: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionContainer: {
    gap: theme.spacing.sm,
  },
});