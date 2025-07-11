import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { userEvent } from '@testing-library/react-native';
import { SelectionButton } from '../../components/SelectionButton';

describe('SelectionButton Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders button with correct title', () => {
    render(
      <SelectionButton
        title="Coach"
        onPress={mockOnPress}
      />
    );

    expect(screen.getByText('Coach')).toBeTruthy();
  });

  it('handles press events correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <SelectionButton
        title="Coach"
        onPress={mockOnPress}
      />
    );

    const button = screen.getByRole('button');
    await user.press(button);

    await waitFor(() => {
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  it('applies correct styling when selected', () => {
    render(
      <SelectionButton
        title="Coach"
        onPress={mockOnPress}
        isSelected={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button.props.accessibilityState.selected).toBe(true);
  });

  it('disables button when disabled prop is true', async () => {
    const user = userEvent.setup();
    
    render(
      <SelectionButton
        title="Coach"
        onPress={mockOnPress}
        disabled={true}
      />
    );

    const button = screen.getByRole('button');
    await user.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('applies primary variant styling correctly', () => {
    render(
      <SelectionButton
        title="Continue"
        onPress={mockOnPress}
        variant="primary"
      />
    );

    const button = screen.getByText('Continue');
    expect(button).toBeTruthy();
  });
});