import { renderHook, act } from '@testing-library/react-native';
import { useWorkoutSetup } from '../../hooks/useWorkoutSetup';

describe('useWorkoutSetup Hook', () => {
  it('creates user correctly', () => {
    const { result } = renderHook(() => useWorkoutSetup());

    act(() => {
      const user = result.current.createUser('john_doe', 'coach');
      result.current.setUser(user);
    });

    expect(result.current.user).toEqual({
      id: expect.any(String),
      type: 'coach',
      username: 'john_doe',
    });
  });

  it('toggles partner selection correctly', () => {
    const { result } = renderHook(() => useWorkoutSetup());

    act(() => {
      result.current.initializePartners('coach');
    });

    const initialPartners = result.current.partners;
    const firstPartnerId = initialPartners[0]?.id;

    if (firstPartnerId) {
      act(() => {
        result.current.togglePartnerSelection(firstPartnerId);
      });

      const updatedPartners = result.current.partners;
      const updatedFirstPartner = updatedPartners.find(p => p.id === firstPartnerId);

      expect(updatedFirstPartner?.isSelected).toBe(true);
    }
  });

  it('toggles day selection correctly', () => {
    const { result } = renderHook(() => useWorkoutSetup());

    const initialDays = result.current.workoutDays;
    const firstDayId = initialDays[0]?.id;

    if (firstDayId) {
      act(() => {
        result.current.toggleDaySelection(firstDayId);
      });

      const updatedDays = result.current.workoutDays;
      const updatedFirstDay = updatedDays.find(d => d.id === firstDayId);

      expect(updatedFirstDay?.isSelected).toBe(true);
    }
  });

  it('returns selected partners correctly', () => {
    const { result } = renderHook(() => useWorkoutSetup());

    act(() => {
      result.current.initializePartners('coach');
    });

    const firstPartnerId = result.current.partners[0]?.id;

    if (firstPartnerId) {
      act(() => {
        result.current.togglePartnerSelection(firstPartnerId);
      });

      const selectedPartners = result.current.getSelectedPartners();
      expect(selectedPartners).toHaveLength(1);
      expect(selectedPartners[0]?.isSelected).toBe(true);
    }
  });

  it('returns selected days correctly', () => {
    const { result } = renderHook(() => useWorkoutSetup());

    const firstDayId = result.current.workoutDays[0]?.id;

    if (firstDayId) {
      act(() => {
        result.current.toggleDaySelection(firstDayId);
      });

      const selectedDays = result.current.getSelectedDays();
      expect(selectedDays).toHaveLength(1);
      expect(selectedDays[0]?.isSelected).toBe(true);
    }
  });
});