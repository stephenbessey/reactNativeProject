import React, { useState } from 'react';
import { Modal, StyleSheet, ScrollView, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Exercise } from '../../contexts/WorkoutContext';
import { validateCompleteExercise } from '../lib/validation';
import { handleWorkoutError, WorkoutErrorCode } from '../services/error';
import { ExerciseModalHeader } from './exercise-form/ExerciseModalHeader';
import { ExerciseTypeSelector } from './exercise-form/ExerciseTypeSelector';
import { CommonExerciseList } from './exercise-form/CommonExerciseList';
import { ExerciseBasicForm } from './exercise-form/ExerciseBasicForm';
import { ExerciseParameterForm } from './exercise-form/ExerciseParameterForm';
import { ExerciseModalFooter } from './exercise-form/ExerciseModalFooter';
import { useExerciseForm } from '../../hooks/useExerciseForm';

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onAddExercise: (exercise: Omit<Exercise, 'id' | 'isCompleted' | 'completedSets'>) => void;
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  visible,
  onClose,
  onAddExercise,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const {
    formData,
    selectedType,
    updateFormField,
    setSelectedType,
    resetForm,
    isFormValid
  } = useExerciseForm();

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  const handleAddExercise = (): void => {
    try {
      const validationResult = validateCompleteExercise(formData);
      
      if (!validationResult.isValid) {
        handleWorkoutError(
          new Error(validationResult.errors.join('\n')),
          { title: 'Invalid Exercise Data' }
        );
        return;
      }

      if (!selectedType) {
        handleWorkoutError(
          new Error('Please select an exercise type'),
          { title: 'Missing Exercise Type' }
        );
        return;
      }

      const newExercise: Omit<Exercise, 'id' | 'isCompleted' | 'completedSets'> = {
        name: formData.name!.trim(),
        description: formData.description?.trim(),
        sets: formData.sets!,
        reps: formData.reps!,
        weight: selectedType.hasWeight && formData.weight! > 0 ? formData.weight : undefined,
        duration: selectedType.hasDuration && formData.duration! > 0 ? formData.duration : undefined,
        restTime: formData.restTime! > 0 ? formData.restTime : undefined,
        notes: formData.notes?.trim(),
      };

      onAddExercise(newExercise);
      resetForm();
    } catch (error) {
      handleWorkoutError(
        error instanceof Error ? error : new Error('Failed to add exercise'),
        { title: 'Add Exercise Error' }
      );
    }
  };

  const handleCommonExerciseSelect = (exerciseName: string): void => {
    updateFormField('name', exerciseName);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <ExerciseModalHeader onClose={handleClose} />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <ExerciseTypeSelector
            selectedType={selectedType}
            onTypeSelection={setSelectedType}
            onFormUpdate={updateFormField}
          />

          {selectedType && (
            <CommonExerciseList
              exerciseType={selectedType}
              selectedExerciseName={formData.name || ''}
              onExerciseSelect={handleCommonExerciseSelect}
            />
          )}

          <ExerciseBasicForm
            exerciseName={formData.name || ''}
            description={formData.description || ''}
            onNameChange={(name) => updateFormField('name', name)}
            onDescriptionChange={(description) => updateFormField('description', description)}
          />

          <ExerciseParameterForm
            formData={formData}
            selectedType={selectedType}
            onFieldUpdate={updateFormField}
          />
        </ScrollView>

        <ExerciseModalFooter
          isFormValid={isFormValid}
          onCancel={handleClose}
          onAddExercise={handleAddExercise}
        />
      </View>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
});