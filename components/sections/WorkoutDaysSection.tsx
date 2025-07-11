import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles } from '../../styles/commonStyles';
import { COLORS, DIMENSIONS } from '../../constants';

interface WorkoutDaysSectionProps {
  days: string[];
}

const DayItem: React.FC<{ day: string }> = ({ day }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
    <Ionicons name="calendar" size={DIMENSIONS.ICON_SIZE_SMALL} color={COLORS.PRIMARY} />
    <Text style={{ fontSize: 16, color: '#666666' }}>{day}</Text>
  </View>
);

export const WorkoutDaysSection: React.FC<WorkoutDaysSectionProps> = ({ days }) => {
  return (
    <View style={commonStyles.card}>
      <Text style={commonStyles.sectionTitle}>Workout Days</Text>
      {days.map((day, index) => (
        <DayItem key={index} day={day} />
      ))}
    </View>
  );
};