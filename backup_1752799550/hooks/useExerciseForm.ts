import { useState, useCallback } from 'react';
import { WORKOUT_LIMITS } from '../constants/workoutConstants';
import { validateCompleteExercise } from '../utils/workoutValidation';

export interface ExerciseType {
  id: string;
  name: string;
  icon: string;
  hasWeight: boolean;
  hasDuration: boolean;
  defaultReps: number;
  defaultSets: number;
}

export interface ExerciseFormData {
  name?: string;
  description?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  notes?: string;
}

interface UseExerciseFormReturn {
  formData: ExerciseFormData;
  selectedType: ExerciseType | null;
  updateFormField: (field: keyof ExerciseFormData, value: string | number) => void;
  setSelectedType: (type: ExerciseType) => void;
  resetForm: () => void;
  isFormValid: boolean;
}

const INITIAL_FORM_DATA: ExerciseFormData = {
  name: '',
  description: '',
  sets: 3,
  reps: 10,
  weight: 0,
  duration: 30,
  restTime: WORKOUT_LIMITS.REST_TIME.DEFAULT_SECONDS,
  notes: '',
};

export const useExerciseForm = (): UseExerciseFormReturn => {
  const [formData, setFormData] = useState<ExerciseFormData>(INITIAL_FORM_DATA);
  const [selectedType, setSelectedTypeState] = useState<ExerciseType | null>(null);

  const updateFormField = useCallback((field: keyof ExerciseFormData, value: string | number): void => {
    setFormData(previousData => ({
      ...previousData,
      [field]: value,
    }));
  }, []);

  const setSelectedType = useCallback((type: ExerciseType): void => {
    setSelectedTypeState(type);
    
    // Update form defaults based on exercise type
    setFormData(previousData => ({
      ...previousData,
      sets: type.defaultSets,
      reps: type.defaultReps,
      weight: type.hasWeight ? 135 : 0,
      duration: type.hasDuration ? 300 : 0, // 5 minutes default
    }));
  }, []);

  const resetForm = useCallback((): void => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedTypeState(null);
  }, []);

  const isFormValid = (): boolean => {
    const hasRequiredFields = Boolean(formData.name?.trim()) && selectedType !== null;
    
    if (!hasRequiredFields) {
      return false;
    }

    const validationResult = validateCompleteExercise(formData);
    return validationResult.isValid;
  };

  return {
    formData,
    selectedType,
    updateFormField,
    setSelectedType,
    resetForm,
    isFormValid: isFormValid(),
  };
};