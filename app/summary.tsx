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
import { parseJsonSafely } from '../lib/transformers';
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

  const handleStartWorkout = (): void => {
    router.push({
      pathname: '/workout-detail',
      params: {
        workoutName: `${username}'s Workout`,
        partnerId: partners[0]?.name || '',
        selectedDays: JSON.stringify(days),
      },
    });
  };

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
        <SelectionButton
          title="Start Workout"
          variant="primary"
          onPress={handleStartWorkout}
        />
        <SelectionButton
          title="View Progress"
          onPress={handleViewProgress}
        />
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
