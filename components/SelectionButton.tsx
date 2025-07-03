import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface SelectionButtonProps {
  title: string;
  isSelected?: boolean;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const SelectionButton: React.FC<SelectionButtonProps> = ({
  title,
  isSelected = false,
  onPress,
  variant = 'secondary',
  disabled = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles.button;

    if (disabled) {
      return { ...baseStyle, ...styles.buttonDisabled };
    }

    if (variant === 'primary') {
      return { ...baseStyle, ...styles.buttonPrimary };
    }

    return isSelected
      ? { ...baseStyle, ...styles.buttonSelected }
      : { ...baseStyle, ...styles.buttonDefault };
  };

  const getTextStyle = (): TextStyle => {
    if (disabled) {
      return { ...styles.buttonText, ...styles.textDisabled };
    }

    return variant === 'primary' || isSelected
      ? { ...styles.buttonText, ...styles.textSelected }
      : { ...styles.buttonText, ...styles.textDefault };
  };

  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyle(),
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled }}
      accessibilityLabel={title}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginVertical: 8,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDefault: {
    backgroundColor: '#000000',
  },
  buttonSelected: {
    backgroundColor: '#333333',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  textDefault: {
    color: '#FFFFFF',
  },
  textSelected: {
    color: '#FFFFFF',
  },
  textDisabled: {
    color: '#888888',
  },
});
