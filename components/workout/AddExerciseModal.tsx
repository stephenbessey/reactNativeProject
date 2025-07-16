import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  Pressable,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Exercise } from '../../contexts/WorkoutContext';
import { NumberInput } from './NumberInput';
import { SelectionButton } from '../SelectionButton';

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onAddExercise: (exercise: Omit<Exercise, 'id' | 'isCompleted' | 'completedSets'>) => void;
}

interface ExerciseType {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  hasWeight: boolean;
  hasDuration: boolean;
  defaultReps: number;
  defaultSets: number;
}

const EXERCISE_TYPES: ExerciseType[] = [
  {
    id: 'strength',
    name: 'Strength Training',
    icon: 'barbell',
    hasWeight: true,
    hasDuration: false,
    defaultReps: 10,
    defaultSets: 3,
  },
  {
    id: 'cardio',
    name: 'Cardio',
    icon: 'heart',
    hasWeight: false,
    hasDuration: true,
    defaultReps: 1,
    defaultSets: 1,
  },
  {
    id: 'bodyweight',
    name: 'Bodyweight',
    icon: 'fitness',
    hasWeight: false,
    hasDuration: false,
    defaultReps: 15,
    defaultSets: 3,
  },
  {
    id: 'flexibility',
    name: 'Flexibility',
    icon: 'body',
    hasWeight: false,
    hasDuration: true,
    defaultReps: 1,
    defaultSets: 3,
  },
];

const COMMON_EXERCISES = {
  strength: [
    'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row',
    'Pull-ups', 'Dips', 'Bicep Curls', 'Tricep Extensions', 'Lat Pulldowns'
  ],
  cardio: [
    'Running', 'Cycling', 'Rowing', 'Elliptical', 'Treadmill',
    'Jump Rope', 'Burpees', 'Mountain Climbers', 'High Knees', 'Jumping Jacks'
  ],
  bodyweight: [
    'Push-ups', 'Sit-ups', 'Planks', 'Lunges', 'Air Squats',
    'Crunches', 'Leg Raises', 'Wall Sits', 'Glute Bridges', 'Calf Raises'
  ],
  flexibility: [
    'Hamstring Stretch', 'Quad Stretch', 'Shoulder Stretch', 'Chest Stretch',
    'Hip Flexor Stretch', 'Calf Stretch', 'Spinal Twist', 'Child\'s Pose'
  ],
};

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  visible,
  onClose,
  onAddExercise,
}) => {
  const [selectedType, setSelectedType] = useState<ExerciseType | null>(null);
  const [exerciseName, setExerciseName] = useState('');
  const [description, setDescription] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);
  const [duration, setDuration] = useState(30); // in seconds
  const [restTime, setRestTime] = useState(60); // in seconds
  const [notes, setNotes] = useState('');

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const resetForm = (): void => {
    setSelectedType(null);
    setExerciseName('');
    setDescription('');
    setSets(3);
    setReps(10);
    setWeight(0);
    setDuration(30);
    setRestTime(60);
    setNotes('');
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  const handleTypeSelection = (type: ExerciseType): void => {
    setSelectedType(type);
    setSets(type.defaultSets);
    setReps(type.defaultReps);
    setWeight(type.hasWeight ? 135 : 0);
    setDuration(type.hasDuration ? 300 : 0); // 5 minutes default
  };

  const handleCommonExerciseSelect = (name: string): void => {
    setExerciseName(name);
  };

  const handleAddExercise = (): void => {
    if (!exerciseName.trim()) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }

    if (!selectedType) {
      Alert.alert('Error', 'Please select an exercise type');
      return;
    }

    const newExercise: Omit<Exercise, 'id' | 'isCompleted' | 'completedSets'> = {
      name: exerciseName.trim(),
      description: description.trim() || undefined,
      sets,
      reps,
      weight: selectedType.hasWeight && weight > 0 ? weight : undefined,
      duration: selectedType.hasDuration && duration > 0 ? duration : undefined,
      restTime: restTime > 0 ? restTime : undefined,
      notes: notes.trim() || undefined,
    };

    onAddExercise(newExercise);
    resetForm();
  };

  const isFormValid = exerciseName.trim().length > 0 && selectedType !== null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </Pressable>
          <Text style={styles.title}>Add Exercise</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Exercise Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exercise Type</Text>
            <View style={styles.typeGrid}>
              {EXERCISE_TYPES.map((type) => (
                <Pressable
                  key={type.id}
                  style={[
                    styles.typeCard,
                    selectedType?.id === type.id && styles.selectedTypeCard
                  ]}
                  onPress={() => handleTypeSelection(type)}
                >
                  <Ionicons
                    name={type.icon}
                    size={32}
                    color={selectedType?.id === type.id ? theme.colors.primary : theme.colors.textSecondary}
                  />
                  <Text style={[
                    styles.typeText,
                    selectedType?.id === type.id && styles.selectedTypeText
                  ]}>
                    {type.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Common Exercises */}
          {selectedType && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Common {selectedType.name} Exercises</Text>
              <View style={styles.commonExercises}>
                {COMMON_EXERCISES[selectedType.id as keyof typeof COMMON_EXERCISES].map((exercise) => (
                  <Pressable
                    key={exercise}
                    style={[
                      styles.commonExerciseChip,
                      exerciseName === exercise && styles.selectedChip
                    ]}
                    onPress={() => handleCommonExerciseSelect(exercise)}
                  >
                    <Text style={[
                      styles.commonExerciseText,
                      exerciseName === exercise && styles.selectedChipText
                    ]}>
                      {exercise}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Exercise Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exercise Name *</Text>
            <TextInput
              style={styles.textInput}
              value={exerciseName}
              onChangeText={setExerciseName}
              placeholder="Enter exercise name"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>

          {/* Exercise Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe how to perform this exercise..."
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Exercise Parameters */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exercise Parameters</Text>
            <View style={styles.parameterGrid}>
              <NumberInput
                label="Sets"
                value={sets}
                onChangeValue={setSets}
                min={1}
                max={20}
                icon="layers"
              />
              
              <NumberInput
                label="Reps"
                value={reps}
                onChangeValue={setReps}
                min={1}
                max={999}
                icon="refresh"
              />

              {selectedType?.hasWeight && (
                <NumberInput
                  label="Weight (lbs)"
                  value={weight}
                  onChangeValue={setWeight}
                  min={0}
                  max={9999}
                  step={2.5}
                  icon="barbell"
                />
              )}

              {selectedType?.hasDuration && (
                <NumberInput
                  label="Duration (sec)"
                  value={duration}
                  onChangeValue={setDuration}
                  min={0}
                  max={3600}
                  step={15}
                  icon="time"
                />
              )}
            </View>
          </View>

          {/* Rest Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rest Between Sets</Text>
            <View style={styles.restTimeContainer}>
              <NumberInput
                label="Rest Time (sec)"
                value={restTime}
                onChangeValue={setRestTime}
                min={0}
                max={600}
                step={15}
                icon="pause"
              />
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional notes or modifications..."
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              numberOfLines={2}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <SelectionButton
            title="Cancel"
            onPress={handleClose}
            variant="secondary"
          />
          <SelectionButton
            title="Add Exercise"
            onPress={handleAddExercise}
            variant="primary"
            disabled={!isFormValid}
          />
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTypeCard: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  typeText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  selectedTypeText: {
    color: theme.colors.primary,
  },
  commonExercises: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  commonExerciseChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  commonExerciseText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.medium,
  },
  selectedChipText: {
    color: 'white',
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  parameterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  restTimeContainer: {
    alignItems: 'flex-start',
    width: 120,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
