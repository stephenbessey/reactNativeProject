import { useState, useCallback } from 'react';
import { WorkoutPartner, UserType } from '../../types';
import { MOCK_COACHES, MOCK_TRAINEES } from '../../constants/workoutData';

export const usePartnerSelection = () => {
  const [partners, setPartners] = useState<WorkoutPartner[]>([]);

  const initializePartners = useCallback((userType: UserType): void => {
    const availablePartners = userType === 'coach' 
      ? MOCK_TRAINEES.map(p => ({ ...p, isSelected: false }))
      : MOCK_COACHES.map(p => ({ ...p, isSelected: false }));
    setPartners(availablePartners);
  }, []);

  const toggleSelection = useCallback((partnerId: string): void => {
    setPartners(currentPartners =>
      currentPartners.map(partner =>
        partner.id === partnerId
          ? { ...partner, isSelected: !partner.isSelected }
          : partner
      )
    );
  }, []);

  const getSelected = useCallback((): WorkoutPartner[] => {
    return partners.filter(partner => partner.isSelected);
  }, [partners]);

  const resetSelections = useCallback((): void => {
    setPartners(currentPartners =>
      currentPartners.map(partner => ({ ...partner, isSelected: false }))
    );
  }, []);

  const selectAll = useCallback((): void => {
    setPartners(currentPartners =>
      currentPartners.map(partner => ({ ...partner, isSelected: true }))
    );
  }, []);

  const selectNone = useCallback((): void => {
    resetSelections();
  }, [resetSelections]);

  return {
    partners,
    initializePartners,
    toggleSelection,
    getSelected,
    resetSelections,
    selectAll,
    selectNone,
  };
};
