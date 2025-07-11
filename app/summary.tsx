import React from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { SuccessHeader } from '../components/sections/SuccessHeader';
import { ProfileSection } from '../components/sections/ProfileSection';
import { PartnersSection } from '../components/sections/PartnersSection';
import { WorkoutDaysSection } from '../components/sections/WorkoutDaysSection';
import { WorkflowSection } from '../components/sections/WorkflowSection';
import { useWorkoutNavigation } from '../hooks/useWorkoutNavigation';
import { parseJsonSafely } from '../utils/dataTransformers';
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
    console.log('Starting workout management with:', { username, userType, partners, days });
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
          title="Start Managing Workouts"
          variant="primary"
          onPress={handleStartWorkout}
        />
        <SelectionButton
          title="Start Over"
          onPress={handleStartOver}
        />
      </View>
    </ScreenContainer>
  );
}