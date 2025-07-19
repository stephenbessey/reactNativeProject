import React from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { PageHeader } from '../components/sections/PageHeader';
import { useWorkoutSetup } from '../hooks/useWorkoutSetup';
import { useWorkoutNavigation } from '../hooks/useWorkoutNavigation';
import { validateSelections } from "../lib/validation/userValidation";
import { parseJsonSafely } from "../lib/transformers";
import { getActionText } from "../factories";
import { UserType, WorkoutPartner } from '../types';
import { commonStyles } from '../styles/commonStyles';

export default function DaySelectScreen() {
  const { username, userType, selectedPartners } = useLocalSearchParams<Record<string, string>>();

  const { workoutDays, toggleDaySelection, getSelectedDays } = useWorkoutSetup();
  const { navigateToSummary } = useWorkoutNavigation();

  const handleDayToggle = (dayId: string): void => {
    toggleDaySelection(dayId);
  };

  const handleFinish = (): void => {
    const selectedDays = getSelectedDays();

    if (!validateSelections(selectedDays)) {
      return;
    }

    const partners = parseJsonSafely<WorkoutPartner[]>(selectedPartners, []);
    navigateToSummary(username!, userType as UserType, partners, selectedDays);
  };

  const selectedDays = getSelectedDays();
  const selectedCount = selectedDays.length;
  const actionText = getActionText(userType as UserType);

  const getSubtitle = (): string => {
    const baseText = `Choose which days you want to ${actionText}`;
    return selectedCount > 0 ? `${baseText} (${selectedCount} selected)` : baseText;
  };

  return (
    <ScreenContainer>
      <PageHeader 
        title="Select workout days"
        subtitle={getSubtitle()}
      />

      <ScrollView style={commonStyles.listContainer} showsVerticalScrollIndicator={false}>
        {workoutDays.map((day) => (
          <SelectionButton
            key={day.id}
            title={day.day}
            isSelected={day.isSelected}
            onPress={() => handleDayToggle(day.id)}
          />
        ))}
      </ScrollView>

      <View style={commonStyles.actionContainer}>
        <SelectionButton
          title="Complete Setup"
          variant="primary"
          onPress={handleFinish}
          disabled={selectedCount === 0}
        />
      </View>
    </ScreenContainer>
  );
}