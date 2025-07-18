import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { FormInput } from '../../components/FormInput';

describe('FormInput Component', () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    mockOnChangeText.mockClear();
  });

  it('renders label and input correctly', () => {
    render(
      <FormInput
        label="Username"
        value=""
        onChangeText={mockOnChangeText}
        placeholder="Enter username"
      />
    );

    expect(screen.getByText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter username')).toBeTruthy();
  });

  it('handles user input correctly', () => {
    render(
      <FormInput
        label="Username"
        value=""
        onChangeText={mockOnChangeText}
        placeholder="Enter username"
      />
    );

    const input = screen.getByPlaceholderText('Enter username');
    fireEvent.changeText(input, 'john_doe');

    expect(mockOnChangeText).toHaveBeenCalledWith('john_doe');
  });

  it('displays required indicator when required prop is true', () => {
    render(
      <FormInput
        label="Username"
        value=""
        onChangeText={mockOnChangeText}
        required={true}
      />
    );

    expect(screen.getByText('*')).toBeTruthy();
  });

  it('sets accessibility properties correctly', () => {
    render(
      <FormInput
        label="Username"
        value=""
        onChangeText={mockOnChangeText}
        required={true}
      />
    );

    const input = screen.getByLabelText('Username');
    expect(input).toBeTruthy();
    expect(input.props.accessibilityLabel).toBe('Username');
  });
});