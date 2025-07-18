import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ExerciseProgressProps {
  completedSets: number;
  totalSets: number;
}

export const ExerciseProgress: React.FC<ExerciseProgressProps> = ({
  completedSets,
  totalSets
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const progressPercentage = (completedSets / totalSets) * 100;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill, 
            { width: `${progressPercentage}%` }
          ]} 
        />
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
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
});