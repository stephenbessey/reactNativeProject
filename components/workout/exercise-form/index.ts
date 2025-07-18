// Exercise form sub-components
import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { ExerciseType, ExerciseFormData } from '../../../hooks/useExerciseForm';
import { NumberInput } from '../NumberInput';
import { SelectionButton } from '../../SelectionButton';
import { WORKOUT_LIMITS } from '../../../constants/workoutConstants';

// Exercise Modal Header
interface ExerciseModalHeaderProps {
  onClose: () => void;
}

export const ExerciseModalHeader: React.FC<ExerciseModalHeaderProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const styles = createHeaderStyles(theme);

  return (
    <View style={styles.header}>
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={24} color={theme.colors.text} />
      </Pressable>
      <Text style={styles.title}>Add Exercise</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
};

// Exercise Type Selector
interface ExerciseTypeSelectorProps {
  selectedType: ExerciseType | null;
  onTypeSelection: (type: ExerciseType) => void;
  onFormUpdate: (field: keyof ExerciseFormData, value: any) => void;
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

export const ExerciseTypeSelector: React.FC<ExerciseTypeSelectorProps> = ({
  selectedType,
  onTypeSelection,
}) => {
  const { theme } = useTheme();
  const styles = createTypeSelectorStyles(theme);

  return (
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
            onPress={() => onTypeSelection(type)}
          >
            <Ionicons
              name={type.icon as any}
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
  );
};

// Common Exercise List
interface CommonExerciseListProps {
  exerciseType: ExerciseType;
  selectedExerciseName: string;
  onExerciseSelect: (name: string) => void;
}

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

export const CommonExerciseList: React.FC<CommonExerciseListProps> = ({
  exerciseType,
  selectedExerciseName,
  onExerciseSelect
}) => {
  const { theme } = useTheme();
  const styles = createCommonExerciseStyles(theme);

  const exercises = COMMON_EXERCISES[exerciseType.id as keyof typeof COMMON_EXERCISES] || [];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Common {exerciseType.name} Exercises</Text>
      <View style={styles.commonExercises}>
        {exercises.map((exercise) => (
          <Pressable
            key={exercise}
            style={[
              styles.commonExerciseChip,
              selectedExerciseName === exercise && styles.selectedChip
            ]}
            onPress={() => onExerciseSelect(exercise)}
          >
            <Text style={[
              styles.commonExerciseText,
              selectedExerciseName === exercise && styles.selectedChipText
            ]}>
              {exercise}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

// Exercise Basic Form
interface ExerciseBasicFormProps {
  exerciseName: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

export const ExerciseBasicForm: React.FC<ExerciseBasicFormProps> = ({
  exerciseName,
  description,
  onNameChange,
  onDescriptionChange
}) => {
  const { theme } = useTheme();
  const styles = createBasicFormStyles(theme);

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exercise Name *</Text>
        <TextInput
          style={styles.textInput}
          value={exerciseName}
          onChangeText={onNameChange}
          placeholder="Enter exercise name"
          placeholderTextColor={theme.colors.textTertiary}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions (Optional)</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={description}
          onChangeText={onDescriptionChange}
          placeholder="Describe how to perform this exercise..."
          placeholderTextColor={theme.colors.textTertiary}
          multiline
          numberOfLines={3}
        />
      </View>
    </>
  );
};

// Exercise Parameter Form
interface ExerciseParameterFormProps {
  formData: ExerciseFormData;
  selectedType: ExerciseType | null;
  onFieldUpdate: (field: keyof ExerciseFormData, value: number) => void;
}

export const ExerciseParameterForm: React.FC<ExerciseParameterFormProps> = ({
  formData,
  selectedType,
  onFieldUpdate
}) => {
  const { theme } = useTheme();
  const styles = createParameterFormStyles(theme);

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exercise Parameters</Text>
        <View style={styles.parameterGrid}>
          <NumberInput
            label="Sets"
            value={formData.sets || 0}
            onChangeValue={(value) => onFieldUpdate('sets', value)}
            min={WORKOUT_LIMITS.SETS.MINIMUM}
            max={WORKOUT_LIMITS.SETS.MAXIMUM}
            icon="layers"
          />
          
          <NumberInput
            label="Reps"
            value={formData.reps || 0}
            onChangeValue={(value) => onFieldUpdate('reps', value)}
            min={WORKOUT_LIMITS.REPS.MINIMUM}
            max={WORKOUT_LIMITS.REPS.MAXIMUM}
            icon="refresh"
          />

          {selectedType?.hasWeight && (
            <NumberInput
              label="Weight (lbs)"
              value={formData.weight || 0}
              onChangeValue={(value) => onFieldUpdate('weight', value)}
              min={WORKOUT_LIMITS.WEIGHT.MINIMUM}
              max={WORKOUT_LIMITS.WEIGHT.MAXIMUM}
              step={WORKOUT_LIMITS.WEIGHT.DEFAULT_INCREMENT}
              icon="barbell"
            />
          )}

          {selectedType?.hasDuration && (
            <NumberInput
              label="Duration (sec)"
              value={formData.duration || 0}
              onChangeValue={(value) => onFieldUpdate('duration', value)}
              min={WORKOUT_LIMITS.DURATION.MINIMUM_SECONDS}
              max={WORKOUT_LIMITS.DURATION.MAXIMUM_SECONDS}
              step={WORKOUT_LIMITS.DURATION.DEFAULT_INCREMENT_SECONDS}
              icon="time"
            />
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rest Between Sets</Text>
        <View style={styles.restTimeContainer}>
          <NumberInput
            label="Rest Time (sec)"
            value={formData.restTime || 0}
            onChangeValue={(value) => onFieldUpdate('restTime', value)}
            min={WORKOUT_LIMITS.REST_TIME.MINIMUM_SECONDS}
            max={WORKOUT_LIMITS.REST_TIME.MAXIMUM_SECONDS}
            step={WORKOUT_LIMITS.REST_TIME.INCREMENT_SECONDS}
            icon="pause"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes (Optional)</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={formData.notes || ''}
          onChangeText={(value) => onFieldUpdate('notes', value)}
          placeholder="Any additional notes or modifications..."
          placeholderTextColor={theme.colors.textTertiary}
          multiline
          numberOfLines={2}
        />
      </View>
    </>
  );
};

// Exercise Modal Footer
interface ExerciseModalFooterProps {
  isFormValid: boolean;
  onCancel: () => void;
  onAddExercise: () => void;
}

export const ExerciseModalFooter: React.FC<ExerciseModalFooterProps> = ({
  isFormValid,
  onCancel,
  onAddExercise
}) => {
  const { theme } = useTheme();
  const styles = createFooterStyles(theme);

  return (
    <View style={styles.footer}>
      <SelectionButton
        title="Cancel"
        onPress={onCancel}
        variant="secondary"
      />
      <SelectionButton
        title="Add Exercise"
        onPress={onAddExercise}
        variant="primary"
        disabled={!isFormValid}
      />
    </View>
  );
};

// Styles
const createHeaderStyles = (theme: any) => StyleSheet.create({
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
});

const createTypeSelectorStyles = (theme: any) => StyleSheet.create({
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
});

const createCommonExerciseStyles = (theme: any) => StyleSheet.create({
  section: {
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
});

const createBasicFormStyles = (theme: any) => StyleSheet.create({
  section: {
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
});

const createParameterFormStyles = (theme: any) => StyleSheet.create({
  section: {
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
});

const createFooterStyles = (theme: any) => StyleSheet.create({
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});