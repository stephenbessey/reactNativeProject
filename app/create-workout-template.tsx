import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { PageHeader } from '../components/sections/PageHeader';
import { useTheme } from '../contexts/ThemeContext';

// Mock workout data - in a real app this would come from your coach
const mockTodaysWorkout = {
  id: '1',
  name: 'Upper Body Strength',
  assignedBy: 'Coach Sarah',
  assignedDate: new Date(),
  dueDate: new Date(),
  exercises: [
    {
      id: '1',
      name: 'Push-ups',
      sets: 3,
      reps: 12,
      notes: 'Focus on form, keep core tight',
      restTime: 60,
    },
    {
      id: '2',
      name: 'Pull-ups',
      sets: 3,
      reps: 8,
      weight: 0,
      notes: 'Use assistance if needed',
      restTime: 90,
    },
    {
      id: '3',
      name: 'Bench Press',
      sets: 4,
      reps: 10,
      weight: 135,
      notes: 'Increase weight from last session',
      restTime: 120,
    },
    {
      id: '4',
      name: 'Dumbbell Rows',
      sets: 3,
      reps: 12,
      weight: 30,
      notes: 'Each arm, control the movement',
      restTime: 60,
    },
  ],
  coachNotes: 'Great progress last week! Focus on your form today and try to increase weight where possible.',
  isCompleted: false,
};

export default function TodaysWorkoutScreen() {
  const { username, partnerId } = useLocalSearchParams<Record<string, string>>();
  const [workoutData] = useState(mockTodaysWorkout);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleStartWorkout = (): void => {
    router.push({
      pathname: '/perform-workout',
      params: {
        workoutId: workoutData.id,
        workoutName: workoutData.name,
        partnerId: workoutData.assignedBy,
      },
    });
  };

  const handleViewPrevious = (): void => {
    router.push('/progress');
  };

  const handleContactCoach = (): void => {
    // In a real app, this would open messaging or contact options
    router.push({
      pathname: '/chat',
      params: {
        partnerId: partnerId,
      },
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalEstimatedTime = workoutData.exercises.reduce((total, exercise) => {
    // Rough estimate: 2 minutes per set + rest time
    const exerciseTime = (exercise.sets * 120) + (exercise.sets * (exercise.restTime || 60));
    return total + exerciseTime;
  }, 0);

  const estimatedMinutes = Math.round(totalEstimatedTime / 60);

  return (
    <ScreenContainer>
      <PageHeader 
        title="Today's Workout"
        subtitle={`Assigned by ${workoutData.assignedBy}`}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Workout Info Card */}
        <View style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <View style={styles.workoutIcon}>
              <Ionicons name="fitness" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>{workoutData.name}</Text>
              <Text style={styles.workoutDate}>{formatDate(workoutData.assignedDate)}</Text>
            </View>
            {workoutData.isCompleted && (
              <Ionicons name="checkmark-circle" size={32} color={theme.colors.success} />
            )}
          </View>

          <View style={styles.workoutStats}>
            <View style={styles.statItem}>
              <Ionicons name="barbell" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.statText}>{workoutData.exercises.length} exercises</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.statText}>~{estimatedMinutes} minutes</Text>
            </View>
          </View>

          {workoutData.coachNotes && (
            <View style={styles.coachNotesContainer}>
              <Text style={styles.coachNotesTitle}>Coach Notes:</Text>
              <Text style={styles.coachNotesText}>{workoutData.coachNotes}</Text>
            </View>
          )}
        </View>

        {/* Exercise Preview */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Today's Exercises</Text>
          
          {workoutData.exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseItem}>
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
              </View>
              
              <View style={styles.exerciseDetails}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseSpecs}>
                  {exercise.sets} sets × {exercise.reps} reps
                  {exercise.weight && ` @ ${exercise.weight}lbs`}
                </Text>
                {exercise.notes && (
                  <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
                )}
              </View>

              <View style={styles.exerciseRest}>
                <Text style={styles.restTime}>{exercise.restTime}s</Text>
                <Text style={styles.restLabel}>rest</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {!workoutData.isCompleted ? (
            <SelectionButton
              title="Start Workout"
              variant="primary"
              onPress={handleStartWorkout}
            />
          ) : (
            <View style={styles.completedMessage}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
              <Text style={styles.completedText}>Workout completed!</Text>
            </View>
          )}

          <SelectionButton
            title="View Previous Workouts"
            onPress={handleViewPrevious}
            variant="secondary"
          />

          <SelectionButton
            title="Contact Coach"
            onPress={handleContactCoach}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  content: {
    flex: 1,
  },
  workoutCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  workoutDate: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  coachNotesContainer: {
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  coachNotesTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  coachNotesText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  exercisesSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  exerciseNumberText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  exerciseSpecs: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  exerciseNotes: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
  exerciseRest: {
    alignItems: 'center',
  },
  restTime: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
  },
  restLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textTertiary,
  },
  actionSection: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  completedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.success + '15',
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  completedText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.success,
  },
});