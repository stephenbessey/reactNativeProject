import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { PageHeader } from '../components/sections/PageHeader';
import { useTheme } from '../contexts/ThemeContext';
import { useWorkout } from '../contexts/WorkoutContext';
import { calculateWorkoutAnalytics, formatDate, formatWorkoutDuration } from '../utils/analytics';

const screenWidth = Dimensions.get('window').width;

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, color }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: (color || theme.colors.primary) + '15' }]}>
          <Ionicons name={icon} size={24} color={color || theme.colors.primary} />
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );
};

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const { theme } = useTheme();
  const { state } = useWorkout();
  const styles = createStyles(theme);

  const analytics = useMemo(() => {
    return calculateWorkoutAnalytics(state.workoutHistory);
  }, [state.workoutHistory]);

  const chartConfig = {
    backgroundColor: theme.colors.background,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.textSecondary,
    style: {
      borderRadius: theme.borderRadius.lg,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const workoutFrequencyData = {
    labels: analytics.weeklyProgress.map(week => week.week),
    datasets: [
      {
        data: analytics.weeklyProgress.map(week => week.workouts),
      },
    ],
  };

  const volumeProgressData = {
    labels: analytics.weeklyProgress.map(week => week.week),
    datasets: [
      {
        data: analytics.weeklyProgress.map(week => Math.round(week.volume / 1000)), // Convert to thousands
      },
    ],
  };

  const exerciseDistributionData = analytics.mostCommonExercises.map((exercise, index) => ({
    name: exercise.name.length > 12 ? exercise.name.substring(0, 12) + '...' : exercise.name,
    count: exercise.count,
    color: [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.success,
      theme.colors.warning,
      theme.colors.error,
    ][index % 5],
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  }));

  const recentWorkouts = state.workoutHistory
    .filter(workout => workout.isCompleted)
    .slice(0, 5);

  const formatAverageWorkoutDuration = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  return (
    <ScreenContainer>
      <PageHeader 
        title="Progress"
        subtitle="Track your fitness journey"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="fitness"
              title="Total Workouts"
              value={analytics.totalWorkouts.toString()}
              subtitle="Completed sessions"
              color={theme.colors.primary}
            />
            <StatCard
              icon="barbell"
              title="Total Volume"
              value={`${Math.round(analytics.totalVolume / 1000)}K`}
              subtitle="lbs lifted"
              color={theme.colors.success}
            />
            <StatCard
              icon="time"
              title="Avg Duration"
              value={formatAverageWorkoutDuration(analytics.averageWorkoutDuration)}
              subtitle="per workout"
              color={theme.colors.secondary}
            />
            <StatCard
              icon="trophy"
              title="Total Exercises"
              value={analytics.totalExercises.toString()}
              subtitle="completed"
              color={theme.colors.warning}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Frequency</Text>
          <View style={styles.chartContainer}>
            {analytics.weeklyProgress.length > 0 ? (
              <LineChart
                data={workoutFrequencyData}
                width={screenWidth - 48}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisSuffix=" workouts"
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Ionicons name="bar-chart" size={48} color={theme.colors.textTertiary} />
                <Text style={styles.noDataText}>No workout data available</Text>
                <Text style={styles.noDataSubtext}>Complete some workouts to see your progress</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Volume Progress (K lbs)</Text>
          <View style={styles.chartContainer}>
            {analytics.weeklyProgress.length > 0 ? (
              <BarChart
                data={volumeProgressData}
                width={screenWidth - 48}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisSuffix="K"
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Ionicons name="trending-up" size={48} color={theme.colors.textTertiary} />
                <Text style={styles.noDataText}>No volume data available</Text>
              </View>
            )}
          </View>
        </View>

        {exerciseDistributionData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most Common Exercises</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={exerciseDistributionData}
                width={screenWidth - 48}
                height={220}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 0]}
                style={styles.chart}
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          {recentWorkouts.length > 0 ? (
            <View style={styles.workoutsList}>
              {recentWorkouts.map((workout) => (
                <View key={workout.id} style={styles.workoutItem}>
                  <View style={styles.workoutHeader}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <Text style={styles.workoutDate}>{formatDate(workout.date)}</Text>
                  </View>
                  <View style={styles.workoutStats}>
                    <View style={styles.workoutStat}>
                      <Ionicons name="fitness" size={16} color={theme.colors.textSecondary} />
                      <Text style={styles.workoutStatText}>
                        {workout.exercises.length} exercises
                      </Text>
                    </View>
                    {workout.startTime && workout.endTime && (
                      <View style={styles.workoutStat}>
                        <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
                        <Text style={styles.workoutStatText}>
                          {formatWorkoutDuration(workout.startTime, workout.endTime)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="calendar" size={48} color={theme.colors.textTertiary} />
              <Text style={styles.noDataText}>No recent workouts</Text>
              <Text style={styles.noDataSubtext}>Start a workout to see it here</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsSection}>
          <SelectionButton
            title="View All Workouts"
            onPress={() => {
              console.log('Navigate to workout history');
            }}
            variant="secondary"
          />
          <SelectionButton
            title="Export Progress"
            onPress={() => {
              console.log('Export progress data', analytics);
            }}
            variant="primary"
          />
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  content: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  statTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statSubtitle: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textTertiary,
  },
  chartContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    ...theme.shadows.small,
  },
  chart: {
    borderRadius: theme.borderRadius.lg,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  noDataText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  noDataSubtext: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  workoutsList: {
    gap: theme.spacing.sm,
  },
  workoutItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  workoutName: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    flex: 1,
  },
  workoutDate: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  workoutStatText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  actionsSection: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  footer: {
    height: theme.spacing.xl,
  },
});
