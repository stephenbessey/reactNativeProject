import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import PartnerSelectScreen from '../../app/partner-select';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: () => ({
    username: 'john_doe',
    userType: 'coach',
  }),
}));

const mockTogglePartnerSelection = jest.fn();
const mockGetSelectedPartners = jest.fn();
const mockInitializePartners = jest.fn();

jest.mock('../../hooks/useWorkoutSetup', () => ({
  useWorkoutSetup: () => ({
    partners: [
      { id: '1', name: 'Alice', type: 'trainee', isSelected: false },
      { id: '2', name: 'Bob', type: 'trainee', isSelected: false },
    ],
    togglePartnerSelection: mockTogglePartnerSelection,
    getSelectedPartners: mockGetSelectedPartners,
    initializePartners: mockInitializePartners,
  }),
}));

describe('PartnerSelectScreen', () => {
  beforeEach(() => {
    mockTogglePartnerSelection.mockClear();
    mockGetSelectedPartners.mockClear();
    mockInitializePartners.mockClear();
  });

  it('renders partner selection screen correctly', () => {
    mockGetSelectedPartners.mockReturnValue([]);
    
    render(<PartnerSelectScreen />);

    expect(screen.getByText('Select your trainees')).toBeTruthy();
    expect(screen.getByText('Welcome, john_doe! Choose your workout trainee')).toBeTruthy();
    expect(screen.getByText('Alice (trainee)')).toBeTruthy();
    expect(screen.getByText('Bob (trainee)')).toBeTruthy();
  });

  it('handles partner selection correctly', async () => {
    mockGetSelectedPartners.mockReturnValue([]);
    
    render(<PartnerSelectScreen />);

    const aliceButton = screen.getByText('Alice (trainee)');
    fireEvent.press(aliceButton);

    await waitFor(() => {
      expect(mockTogglePartnerSelection).toHaveBeenCalledWith('1');
    });
  });

  it('navigates to day selection when partners are selected', async () => {
    const { router } = require('expo-router');
    
    mockGetSelectedPartners.mockReturnValue([
      { id: '1', name: 'Alice', type: 'trainee', isSelected: true }
    ]);
    
    render(<PartnerSelectScreen />);

    const nextButton = screen.getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/day-select',
        params: {
          username: 'john_doe',
          userType: 'coach',
          selectedPartners: JSON.stringify([{ name: 'Alice', type: 'trainee' }]),
        }
      });
    });
  });
});