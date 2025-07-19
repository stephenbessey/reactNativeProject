import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { PageHeader } from '../components/sections/PageHeader';
import { ExerciseCard } from '../components/exercise/ExerciseCard';
import { WorkoutTimer } from '../components/workout/WorkoutTimer';
import { useWorkout, Workout, Exercise } from '../contexts/WorkoutContext';
import { useTheme } from '../contexts/ThemeContext';

// Mock assigned workout data - in real app this would come from coach assignment
const mockAssignedWorkout: Workout = {
  id: 'assigned-workout-1',
  name: 'Upper Body Strength',
  date: new Date(),
  exercises: [
    {
      id: '1',
      name: 'Push-ups',
      sets: 3,
      reps: 12,
      isCompleted: false,
      completedSets: [],
      notes: 'Focus on form, keep core tight',
      restTime: 60,
    },
    {
      id: '2',
      name: 'Pull-ups',
      sets: 3,
      reps: 8,
      isCompleted: false,
      completedSets: [],
      notes: 'Use assistance if needed',
      restTime: 90,
    },
    {
      id: '3',
      name: 'Bench Press',
      sets: 4,
      reps: 10,
      weight: 135,
      isCompleted: false,
      completedSets: [],
      notes: 'Increase weight from last session',
      restTime: 120,
    },
    {
      id: '4',
      name: 'Dumbbell Rows',
      sets: 3,
      reps: 12,
      weight: 30,
      isCompleted: false,
      completedSets: [],
      notes: 'Each arm, control the movement',
      restTime: 60,
    },
  ],
  isCompleted: false,
  partnerId: 'coach-sarah',
};

export default function PerformWorkoutScreen() {
  const { workoutId, workoutName, partnerId } = useLocalSearchParams<Record<string, string>>();
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Workout>(mockAssignedWorkout);

  const { state, startWorkout, endWorkout, updateExercise } = useWorkout();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const isWorkoutActive = state.isWorkoutActive;

  const handleStartWorkout = (): void => {
    try {
      const updatedWorkout = {
        ...currentWorkout,
        startTime: new Date(),
      };

      startWorkout(updatedWorkout);
      setWorkoutStarted(true);
    } catch (error) {
      console.error('Failed to start workout:', error);
      Alert.alert('Error', 'Failed to start workout. Please try again.');
    }
  };

  const handleCompleteWorkout = (): void => {
    const completedExercises = currentWorkout.exercises.filter(ex => ex.isCompleted).length;
    const totalExercises = currentWorkout.exercises.length;
    
    if (completedExercises < totalExercises) {
      Alert.alert(
        'Incomplete Workout',
        `You've only completed ${completedExercises} of ${totalExercises} exercises. Are you sure you want to finish?`,
        [
          { text: 'Continue Workout', style: 'cancel' },
          { text: 'Finish Anyway', onPress: finishWorkout },
        ]
      );
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = (): void => {
    endWorkout();
    setWorkoutStarted(false);
    
    Alert.alert(
      'Workout Complete!',
      'Great job! Your coach will be able to see your progress.',
      [
        { text: 'View Progress', onPress: () => router.replace('/progress') },
        { text: 'Done', onPress: () => router.replace('/summary') },
      ]
    );
  };

  const handleExerciseUpdate = (exerciseId: string, updates: Partial<Exercise>): void => {
    if (state.isWorkoutActive) {
      updateExercise(exerciseId, updates);
    }
    
    // Also update local state for UI
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      ),
    }));
  };

  const completedExercises = currentWorkout.exercises.filter(ex => ex.isCompleted).length;
  const totalExercises = currentWorkout.exercises.length;
  const workoutProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  return (
    <ScreenContainer>
      <PageHeader
        title={currentWorkout.name}
        subtitle={`Assigned by ${partnerId} • ${completedExercises}/${totalExercises} exercises completed`}
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

      {!workoutStarted ? (
        <View style={styles.startContainer}>
          <Text style={styles.startTitle}>Ready to begin your workout?</Text>
          <Text style={styles.startSubtext}>
            This workout was assigned by {partnerId}. Complete all exercises and your progress will be automatically shared.
          </Text>
          
          <SelectionButton
            title="Start Workout"
            variant="primary"
            onPress={handleStartWorkout}
          />
          
          <SelectionButton
            title="View Workout Details"
            onPress={() => router.push('/todays-workout')}
            variant="secondary"
          />
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.exerciseList}
            showsVerticalScrollIndicator={false}
          >
            {currentWorkout.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onUpdate={(updates) => handleExerciseUpdate(exercise.id, updates)}
                isWorkoutActive={isWorkoutActive}
              />
            ))}
          </ScrollView>

          <View style={styles.actionContainer}>
            <SelectionButton
              title="Complete Workout"
              variant="primary"
              onPress={handleCompleteWorkout}
            />
            <SelectionButton
              title="Pause Workout"
              onPress={() => {
                Alert.alert(
                  'Pause Workout',
                  'Your progress will be saved. You can resume anytime.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Pause', onPress: () => router.back() },
                  ]
                );
              }}
              variant="secondary"
            />
          </View>
        </>
      )}
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
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  startTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  startSubtext: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  exerciseList: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  actionContainer: {
    gap: theme.spacing.sm,
  },
});