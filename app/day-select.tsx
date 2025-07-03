import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { useWorkoutSetup } from '../hooks/useWorkoutSetup';

export default function DaySelectScreen() {
  const { username, userType, selectedPartners } = useLocalSearchParams<{
    username: string;
    userType: string;
    selectedPartners: string;
  }>();

  const { workoutDays, toggleDaySelection, getSelectedDays } = useWorkoutSetup();

  const handleDayToggle = (dayId: string): void => {
    toggleDaySelection(dayId);
  };

  const handleFinish = (): void => {
    const selectedDays = getSelectedDays();

    if (selectedDays.length === 0) {
      return;
    }

    router.push({
      pathname: '/summary',
      params: {
        username,
        userType,
        selectedPartners,
        selectedDays: JSON.stringify(selectedDays.map(d => d.day)),
      }
    });
  };

  const selectedCount = getSelectedDays().length;
  const actionText = userType === 'coach' ? 'create workouts' : 'receive workouts';

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Select workout days</Text>
        <Text style={styles.subtitle}>
          Choose which days you want to {actionText}
          {selectedCount > 0 && ` (${selectedCount} selected)`}
        </Text>
      </View>

      <ScrollView style={styles.dayList} showsVerticalScrollIndicator={false}>
        {workoutDays.map((day) => (
          <SelectionButton
            key={day.id}
            title={day.day}
            isSelected={day.isSelected}
            onPress={() => handleDayToggle(day.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.finishSection}>
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

const styles = StyleSheet.create({
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  dayList: {
    flex: 1,
  },
  finishSection: {
    marginTop: 20,
    marginBottom: 20,
  },
});