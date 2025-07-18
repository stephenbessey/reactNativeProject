import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise, ExerciseSet } from '../../contexts/WorkoutContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PhotoCapture } from './PhotoCapture';
import { SetTracker } from './SetTracker';
import { RestTimer } from '../workout/RestTimer';
import { MotionDetector } from '../motion/MotionDetector';
import { createSetId } from "../../factories";

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdate: (updates: Partial<Exercise>) => void;
  isWorkoutActive: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onUpdate,
  isWorkoutActive,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [isMotionDetectionActive, setIsMotionDetectionActive] = useState(false);
  
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCompleteSet = (reps: number, weight?: number, duration?: number): void => {
    const newSet: ExerciseSet = {
      id: createSetId(),
      reps,
      weight,
      duration,
      completed: true,
      timestamp: new Date(),
    };

    const updatedCompletedSets = [...exercise.completedSets, newSet];
    const isExerciseCompleted = updatedCompletedSets.length >= exercise.sets;

    onUpdate({
      completedSets: updatedCompletedSets,
      isCompleted: isExerciseCompleted,
    });

    if (!isExerciseCompleted && exercise.restTime) {
      setIsRestTimerActive(true);
    }
  };

  const handlePhotoCapture = (photoUri: string): void => {
    onUpdate({ imageUri: photoUri });
    setIsPhotoModalVisible(false);
  };

  const handleMotionDetection = (detectedReps: number): void => {
    const currentSetIndex = exercise.completedSets.length;
    if (currentSetIndex < exercise.sets) {
      handleCompleteSet(detectedReps, exercise.weight);
    }
    setIsMotionDetectionActive(false);
  };

  const completedSets = exercise.completedSets.length;
  const remainingSets = Math.max(0, exercise.sets - completedSets);
  const progressPercentage = (completedSets / exercise.sets) * 100;

  return (
    <View style={[styles.container, exercise.isCompleted && styles.completedContainer]}>
      <Pressable 
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.header}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{exercise.name}</Text>
          {exercise.isCompleted && (
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color={theme.colors.success} 
            />
          )}
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={styles.stats}>
            {completedSets}/{exercise.sets} sets • {exercise.reps} reps
            {exercise.weight && ` • ${exercise.weight}lbs`}
          </Text>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={theme.colors.textTertiary} 
          />
        </View>
      </Pressable>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
      </View>

      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Exercise Description */}
          {exercise.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <Text style={styles.description}>{exercise.description}</Text>
            </View>
          )}

          {exercise.imageUri && (
            <View style={styles.imageContainer}>
              <Text style={styles.sectionTitle}>Form Reference</Text>
              <Image source={{ uri: exercise.imageUri }} style={styles.exerciseImage} />
            </View>
          )}
          <View style={styles.actionButtons}>
            <Pressable 
              style={styles.actionButton}
              onPress={() => setIsPhotoModalVisible(true)}
            >
              <Ionicons name="camera" size={20} color={theme.colors.primary} />
              <Text style={styles.actionButtonText}>Photo</Text>
            </Pressable>

            <Pressable 
              style={styles.actionButton}
              onPress={() => setIsMotionDetectionActive(true)}
              disabled={!isWorkoutActive || exercise.isCompleted}
            >
              <Ionicons name="fitness" size={20} color={theme.colors.primary} />
              <Text style={styles.actionButtonText}>Auto Count</Text>
            </Pressable>
          </View>

          {isWorkoutActive && !exercise.isCompleted && (
            <SetTracker
              exercise={exercise}
              onCompleteSet={handleCompleteSet}
              currentSetNumber={completedSets + 1}
            />
          )}

          {exercise.completedSets.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.sectionTitle}>Completed Sets</Text>
              {exercise.completedSets.map((set, index) => (
                <View key={set.id} style={styles.setHistoryItem}>
                  <Text style={styles.setNumber}>Set {index + 1}</Text>
                  <Text style={styles.setDetails}>
                    {set.reps} reps
                    {set.weight && ` × ${set.weight}lbs`}
                    {set.duration && ` × ${Math.round(set.duration / 60)}min`}
                  </Text>
                  <Ionicons name="checkmark" size={16} color={theme.colors.success} />
                </View>
              ))}
            </View>
          )}

          {exercise.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.notes}>{exercise.notes}</Text>
            </View>
          )}
        </View>
      )}

      <PhotoCapture
        visible={isPhotoModalVisible}
        onClose={() => setIsPhotoModalVisible(false)}
        onCapture={handlePhotoCapture}
      />

      <RestTimer
        visible={isRestTimerActive}
        duration={exercise.restTime || 60}
        onComplete={() => setIsRestTimerActive(false)}
        onSkip={() => setIsRestTimerActive(false)}
      />

      <MotionDetector
        visible={isMotionDetectionActive}
        targetReps={exercise.reps}
        onDetection={handleMotionDetection}
        onClose={() => setIsMotionDetectionActive(false)}
      />
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  completedContainer: {
    backgroundColor: theme.colors.success + '10',
    borderWidth: 1,
    borderColor: theme.colors.success + '30',
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  progressContainer: {
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.sm,
  },
  expandedContent: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  descriptionContainer: {
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  imageContainer: {
    marginBottom: theme.spacing.md,
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.border,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + '10',
    gap: theme.spacing.xs,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  historyContainer: {
    marginBottom: theme.spacing.md,
  },
  setHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  setNumber: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
    minWidth: 50,
  },
  setDetails: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    flex: 1,
  },
  notesContainer: {
    marginTop: theme.spacing.sm,
  },
  notes: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
