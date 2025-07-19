import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { PageHeader } from '../components/sections/PageHeader';
import { useTheme } from '../contexts/ThemeContext';

// Mock workout templates - in real app this would come from your database
const mockWorkoutTemplates = [
  {
    id: '1',
    name: 'Upper Body Strength',
    description: 'Focus on chest, shoulders, and arms',
    exercises: [
      { name: 'Push-ups', sets: 3, reps: 12 },
      { name: 'Pull-ups', sets: 3, reps: 8 },
      { name: 'Bench Press', sets: 4, reps: 10, weight: 135 },
      { name: 'Dumbbell Rows', sets: 3, reps: 12, weight: 30 },
    ],
    estimatedTime: 45,
  },
  {
    id: '2',
    name: 'Lower Body Power',
    description: 'Legs and glutes workout',
    exercises: [
      { name: 'Squats', sets: 4, reps: 12 },
      { name: 'Deadlifts', sets: 4, reps: 8, weight: 185 },
      { name: 'Lunges', sets: 3, reps: 10 },
      { name: 'Calf Raises', sets: 3, reps: 15 },
    ],
    estimatedTime: 50,
  },
  {
    id: '3',
    name: 'Cardio Circuit',
    description: 'High intensity cardio workout',
    exercises: [
      { name: 'Burpees', sets: 4, reps: 10 },
      { name: 'Mountain Climbers', sets: 4, duration: 30 },
      { name: 'Jump Rope', sets: 5, duration: 60 },
      { name: 'High Knees', sets: 3, duration: 30 },
    ],
    estimatedTime: 30,
  },
];

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function WorkoutAssignmentScreen() {
  const { partnerId, selectedDays } = useLocalSearchParams<Record<string, string>>();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleTemplateSelect = (templateId: string): void => {
    setSelectedTemplate(templateId);
  };

  const handleDaySelect = (day: string): void => {
    setSelectedDay(day);
  };

  const handleCreateNewTemplate = (): void => {
    router.push({
      pathname: '/create-workout-template',
      params: {
        returnTo: 'assignment',
      },
    });
  };

  const handleAssignWorkout = (): void => {
    if (!selectedTemplate || !selectedDay) {
      Alert.alert('Missing Information', 'Please select both a workout template and a day.');
      return;
    }

    const template = mockWorkoutTemplates.find(t => t.id === selectedTemplate);
    
    Alert.alert(
      'Assign Workout',
      `Assign "${template?.name}" to ${partnerId} for ${selectedDay}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign',
          onPress: () => {
            // In real app, this would save to database
            Alert.alert(
              'Workout Assigned!',
              `"${template?.name}" has been assigned to ${partnerId} for ${selectedDay}.`,
              [
                { text: 'Assign Another', onPress: () => resetForm() },
                { text: 'Done', onPress: () => router.back() },
              ]
            );
          },
        },
      ]
    );
  };

  const resetForm = (): void => {
    setSelectedTemplate(null);
    setSelectedDay(null);
    setAssignmentNotes('');
  };

  const selectedTemplateData = mockWorkoutTemplates.find(t => t.id === selectedTemplate);

  return (
    <ScreenContainer>
      <PageHeader 
        title="Assign Workout"
        subtitle={`Create assignment for ${partnerId}`}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Select Workout Template */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Workout Template</Text>
          
          {mockWorkoutTemplates.map((template) => (
            <View 
              key={template.id} 
              style={[
                styles.templateCard,
                selectedTemplate === template.id && styles.selectedTemplateCard
              ]}
            >
              <SelectionButton
                title={template.name}
                isSelected={selectedTemplate === template.id}
                onPress={() => handleTemplateSelect(template.id)}
                variant="secondary"
              />
              
              <View style={styles.templateDetails}>
                <Text style={styles.templateDescription}>{template.description}</Text>
                <View style={styles.templateStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="fitness" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.statText}>{template.exercises.length} exercises</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.statText}>~{template.estimatedTime} min</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <SelectionButton
            title="+ Create New Template"
            onPress={handleCreateNewTemplate}
            variant="secondary"
          />
        </View>

        {/* Select Day */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assign to Day</Text>
          <View style={styles.daysGrid}>
            {daysOfWeek.map((day) => (
              <SelectionButton
                key={day}
                title={day}
                isSelected={selectedDay === day}
                onPress={() => handleDaySelect(day)}
                variant="secondary"
              />
            ))}
          </View>
        </View>

        {/* Workout Preview */}
        {selectedTemplateData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Preview</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>{selectedTemplateData.name}</Text>
              <Text style={styles.previewDescription}>{selectedTemplateData.description}</Text>
              
              <View style={styles.exercisesList}>
                {selectedTemplateData.exercises.map((exercise, index) => (
                  <View key={index} style={styles.exercisePreview}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDetails}>
                      {exercise.sets} sets × {exercise.reps} reps
                      {exercise.weight && ` @ ${exercise.weight}lbs`}
                      {exercise.duration && ` × ${exercise.duration}s`}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Assignment Summary */}
        {selectedTemplate && selectedDay && (
          <View style={styles.section}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Assignment Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Trainee:</Text>
                <Text style={styles.summaryValue}>{partnerId}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Workout:</Text>
                <Text style={styles.summaryValue}>{selectedTemplateData?.name}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Day:</Text>
                <Text style={styles.summaryValue}>{selectedDay}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.actionContainer}>
        <SelectionButton
          title="Assign Workout"
          variant="primary"
          onPress={handleAssignWorkout}
          disabled={!selectedTemplate || !selectedDay}
        />
        <SelectionButton
          title="Cancel"
          onPress={() => router.back()}
          variant="secondary"
        />
      </View>
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
  templateCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  selectedTemplateCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  templateDetails: {
    marginTop: theme.spacing.sm,
  },
  templateDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  templateStats: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  previewCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  previewTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  previewDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  exercisesList: {
    gap: theme.spacing.sm,
  },
  exercisePreview: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    paddingLeft: theme.spacing.sm,
  },
  exerciseName: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  exerciseDetails: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  summaryTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.medium,
  },
  summaryValue: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  actionContainer: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
});