import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import InitialScreen from '../../app/index';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('../../hooks/useWorkoutSetup', () => ({
  useWorkoutSetup: () => ({
    createUser: jest.fn((username, type) => ({
      id: '1',
      name: username,
      type,
      username,
    })),
    setUser: jest.fn(),
    initializePartners: jest.fn(),
  }),
}));

describe('InitialScreen', () => {
  it('renders all initial elements correctly', () => {
    render(<InitialScreen />);

    expect(screen.getByText('Workout Partner')).toBeTruthy();
    expect(screen.getByText('Connect coaches with trainees for better fitness results')).toBeTruthy();
    expect(screen.getByText('Select your role')).toBeTruthy();
    expect(screen.getByText('Coach')).toBeTruthy();
    expect(screen.getByText('Trainee')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your username')).toBeTruthy();
  });

  it('allows user to select coach role and see description', async () => {
    render(<InitialScreen />);

    const coachButton = screen.getByText('Coach');
    fireEvent.press(coachButton);

    await waitFor(() => {
      expect(screen.getByText('Create workouts and track trainee progress')).toBeTruthy();
    });
  });

  it('allows user to select trainee role and see description', async () => {
    render(<InitialScreen />);

    const traineeButton = screen.getByText('Trainee');
    fireEvent.press(traineeButton);

    await waitFor(() => {
      expect(screen.getByText('Follow workout plans and provide feedback')).toBeTruthy();
    });
  });

  it('shows continue button initially', () => {
    render(<InitialScreen />);
    
    const continueButton = screen.getByText('Continue');
    expect(continueButton).toBeTruthy();
  });

  it('allows user interaction with form elements', async () => {
    render(<InitialScreen />);

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    fireEvent.changeText(usernameInput, 'john_doe');

    const coachButton = screen.getByText('Coach');
    fireEvent.press(coachButton);

    expect(usernameInput.props.value).toBe('john_doe');
    
    await waitFor(() => {
      expect(screen.getByText('Create workouts and track trainee progress')).toBeTruthy();
    });
  });

  it('completes user setup flow correctly', async () => {
    const { router } = require('expo-router');
    
    render(<InitialScreen />);

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    fireEvent.changeText(usernameInput, 'john_doe');

    const coachButton = screen.getByText('Coach');
    fireEvent.press(coachButton);

    const continueButton = screen.getByText('Continue');
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/partner-select',
        params: {
          username: 'john_doe',
          userType: 'coach'
        }
      });
    });
  });
});