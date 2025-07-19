import React from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { SuccessHeader } from '../components/sections/SuccessHeader';
import { ProfileSection } from '../components/sections/ProfileSection';
import { PartnersSection } from '../components/sections/PartnersSection';
import { WorkoutDaysSection } from '../components/sections/WorkoutDaysSection';
import { WorkflowSection } from '../components/sections/WorkflowSection';
import { useWorkoutNavigation } from '../hooks/useWorkoutNavigation';
import { parseJsonSafely } from "../lib/transformers";
import { User, UserType } from '../types';
import { commonStyles } from '../styles/commonStyles';

export default function SummaryScreen() {
  const { username, userType, selectedPartners, selectedDays } = useLocalSearchParams<Record<string, string>>();

  const { navigateToHome } = useWorkoutNavigation();

  const partners = parseJsonSafely(selectedPartners, []);
  const days = parseJsonSafely(selectedDays, []);

  const user: User = {
    id: '1',
    username: username!,
    type: userType as UserType,
  };

  const isCoach = userType === 'coach';
  const isTrainee = userType === 'trainee';

  // Coach actions
  const handleAssignWorkout = (): void => {
    router.push({
      pathname: '/workout-assignment',
      params: {
        partnerId: partners[0]?.name || 'Trainee',
        selectedDays: JSON.stringify(days),
      },
    });
  };

  const handleCreateTemplate = (): void => {
    router.push({
      pathname: '/create-workout-template',
      params: {
        returnTo: 'summary',
      },
    });
  };

  // Trainee actions
  const handleViewTodaysWorkout = (): void => {
    router.push({
      pathname: '/todays-workout',
      params: {
        username: username,
        partnerId: partners[0]?.name || '',
      },
    });
  };

  const handleStartWorkout = (): void => {
    // This should only start a workout that was already assigned
    router.push({
      pathname: '/perform-workout',
      params: {
        workoutId: 'todays-workout-id', // In real app, get from assigned workout
        workoutName: "Today's Assigned Workout",
        partnerId: partners[0]?.name || '',
      },
    });
  };

  // Shared actions
  const handleViewProgress = (): void => {
    router.push('/progress');
  };

  const handleOpenSettings = (): void => {
    router.push('/settings');
  };

  const handleStartOver = (): void => {
    navigateToHome();
  };

  return (
    <ScreenContainer>
      <SuccessHeader />

      <ScrollView style={commonStyles.listContainer} showsVerticalScrollIndicator={false}>
        <ProfileSection user={user} />
        <PartnersSection partners={partners} userType={userType as UserType} />
        <WorkoutDaysSection days={days} />
        <WorkflowSection userType={userType as UserType} />
      </ScrollView>

      <View style={commonStyles.actionContainer}>
        {isCoach && (
          <>
            <SelectionButton
              title="Assign a Workout"
              variant="primary"
              onPress={handleAssignWorkout}
            />
            <SelectionButton
              title="Create Template"
              onPress={handleCreateTemplate}
            />
            <SelectionButton
              title="View Progress"
              onPress={handleViewProgress}
            />
          </>
        )}

        {isTrainee && (
          <>
            <SelectionButton
              title="View Today's Workout"
              variant="primary"
              onPress={handleViewTodaysWorkout}
            />
            <SelectionButton
              title="Start Workout"
              onPress={handleStartWorkout}
            />
            <SelectionButton
              title="View Progress"
              onPress={handleViewProgress}
            />
          </>
        )}

        {/* Shared actions */}
        <SelectionButton
          title="Settings"
          onPress={handleOpenSettings}
        />
        <SelectionButton
          title="Start Over"
          onPress={handleStartOver}
        />
      </View>
    </ScreenContainer>
  );
}