import { useUserSetup } from './useUserSetup';
import { usePartnerSelection } from './usePartnerSelection';
import { useDaySelection } from './useDaySelection';

export const useWorkoutSetup = () => {
  const userSetup = useUserSetup();
  const partnerSelection = usePartnerSelection();
  const daySelection = useDaySelection();

  const resetAllSelections = (): void => {
    userSetup.resetUser();
    partnerSelection.resetSelections();
    daySelection.resetSelections();
  };

  const isSetupComplete = (): boolean => {
    return Boolean(
      userSetup.user &&
      partnerSelection.getSelected().length > 0 &&
      daySelection.getSelected().length > 0
    );
  };

  return {
    ...userSetup,
    ...partnerSelection,
    ...daySelection,
    resetAllSelections,
    isSetupComplete,
  };
};