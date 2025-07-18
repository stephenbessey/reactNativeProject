import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise } from '../../contexts/WorkoutContext';
import { useTheme } from '../../contexts/ThemeContext';

interface ExerciseHeaderProps {
  exercise: Exercise;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  exercise,
  isExpanded,
  onToggleExpanded
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <Pressable 
      onPress={onToggleExpanded} 
      style={styles.header}
      testID="exercise-header"
      accessibilityLabel={`Exercise: ${exercise.name}`}
      accessibilityRole="button"
      accessibilityHint="Tap to expand exercise details"
    >
      <ExerciseTitleRow exercise={exercise} />
      <ExerciseStatsRow exercise={exercise} isExpanded={isExpanded} />
    </Pressable>
  );
};

const ExerciseTitleRow: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{exercise.name}</Text>
      {exercise.isCompleted && (
        <Ionicons 
          name="checkmark-circle" 
          size={24} 
          color={theme.colors.success}
          testID="completion-indicator"
        />
      )}
    </View>
  );
};

const ExerciseStatsRow: React.FC<{ exercise: Exercise; isExpanded: boolean }> = ({ 
  exercise, 
  isExpanded 
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const statsText = `${exercise.completedSets.length}/${exercise.sets} sets • ${exercise.reps} reps${
    exercise.weight ? ` • ${exercise.weight}lbs` : ''
  }`;

  return (
    <View style={styles.statsContainer}>
      <Text style={styles.stats}>{statsText}</Text>
      <Ionicons 
        name={isExpanded ? "chevron-up" : "chevron-down"} 
        size={20} 
        color={theme.colors.textTertiary} 
      />
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
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
});