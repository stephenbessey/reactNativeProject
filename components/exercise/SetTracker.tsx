import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise } from '../../contexts/WorkoutContext';
import { useTheme } from '../../contexts/ThemeContext';
import { NumberInput } from '../workout/NumberInput';

interface SetTrackerProps {
  exercise: Exercise;
  currentSetNumber: number;
  onCompleteSet: (reps: number, weight?: number, duration?: number) => void;
}

export const SetTracker: React.FC<SetTrackerProps> = ({
  exercise,
  currentSetNumber,
  onCompleteSet,
}) => {
  const [currentReps, setCurrentReps] = useState(exercise.reps);
  const [currentWeight, setCurrentWeight] = useState(exercise.weight || 0);
  const [currentDuration, setCurrentDuration] = useState(Math.round((exercise.duration || 0) / 60));
  
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCompleteSet = (): void => {
    const duration = currentDuration > 0 ? currentDuration * 60 : undefined;
    const weight = currentWeight > 0 ? currentWeight : undefined;
    
    onCompleteSet(currentReps, weight, duration);
  };

  const isValidSet = currentReps > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set {currentSetNumber}</Text>
      
      <View style={styles.inputContainer}>
        <NumberInput
          label="Reps"
          value={currentReps}
          onChangeValue={setCurrentReps}
          min={1}
          max={999}
          icon="fitness"
        />

        {exercise.weight !== undefined && (
          <NumberInput
            label="Weight (lbs)"
            value={currentWeight}
            onChangeValue={setCurrentWeight}
            min={0}
            max={9999}
            step={2.5}
            icon="barbell"
          />
        )}

        {exercise.duration !== undefined && (
          <NumberInput
            label="Duration (min)"
            value={currentDuration}
            onChangeValue={setCurrentDuration}
            min={0}
            max={999}
            icon="time"
          />
        )}
      </View>

      <Pressable
        style={[styles.completeButton, !isValidSet && styles.disabledButton]}
        onPress={handleCompleteSet}
        disabled={!isValidSet}
      >
        <Ionicons 
          name="checkmark" 
          size={20} 
          color={isValidSet ? 'white' : theme.colors.textTertiary} 
        />
        <Text style={[styles.completeButtonText, !isValidSet && styles.disabledButtonText]}>
          Complete Set
        </Text>
      </Pressable>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  disabledButton: {
    backgroundColor: theme.colors.surface,
  },
  completeButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  disabledButtonText: {
    color: theme.colors.textTertiary,
  },
});
