import { useState, useCallback } from 'react';
import { WorkoutDay } from '../../types';
import { WORKOUT_DAYS } from '../../constants/workoutData';

export const useDaySelection = () => {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(WORKOUT_DAYS);

  const toggleSelection = useCallback((dayId: string): void => {
    setWorkoutDays(currentDays =>
      currentDays.map(day =>
        day.id === dayId
          ? { ...day, isSelected: !day.isSelected }
          : day
      )
    );
  }, []);

  const getSelected = useCallback((): WorkoutDay[] => {
    return workoutDays.filter(day => day.isSelected);
  }, [workoutDays]);

  const resetSelections = useCallback((): void => {
    setWorkoutDays(WORKOUT_DAYS.map(day => ({ ...day, isSelected: false })));
  }, []);

  const selectWeekdays = useCallback((): void => {
    const weekdayIds = ['1', '2', '3', '4', '5'];
    setWorkoutDays(currentDays =>
      currentDays.map(day => ({
        ...day,
        isSelected: weekdayIds.includes(day.id)
      }))
    );
  }, []);

  const selectWeekends = useCallback((): void => {
    const weekendIds = ['6', '7'];
    setWorkoutDays(currentDays =>
      currentDays.map(day => ({
        ...day,
        isSelected: weekendIds.includes(day.id)
      }))
    );
  }, []);

  const selectAll = useCallback((): void => {
    setWorkoutDays(currentDays =>
      currentDays.map(day => ({ ...day, isSelected: true }))
    );
  }, []);

  const getSelectedCount = useCallback((): number => {
    return workoutDays.filter(day => day.isSelected).length;
  }, [workoutDays]);

  return {
    workoutDays,
    toggleSelection,
    getSelected,
    resetSelections,
    selectWeekdays,
    selectWeekends,
    selectAll,
    getSelectedCount,
  };
};