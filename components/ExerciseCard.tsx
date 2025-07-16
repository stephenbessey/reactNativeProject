import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise, ExerciseSet } from '../../contexts/WorkoutContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PhotoCapture } from './PhotoCapture';
import { SetTracker } from './SetTracker';
import { RestTimer } from './RestTimer';
import { MotionDetector } from './MotionDetector';
import { createSetId } from '../../utils/idHelpers';

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
            {complet
