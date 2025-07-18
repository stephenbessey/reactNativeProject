import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, DIMENSIONS } from '../constants';

interface SelectionButtonProps {
  title: string;
  isSelected?: boolean;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

type ButtonState = 'disabled' | 'primary' | 'selected' | 'default';

export const SelectionButton: React.FC<SelectionButtonProps> = ({
  title,
  isSelected = false,
  onPress,
  variant = 'secondary',
  disabled = false,
}) => {
  const getButtonState = (): ButtonState => {
    if (disabled) return 'disabled';
    if (variant === 'primary') return 'primary';
    if (isSelected) return 'selected';
    return 'default';
  };

  const getButtonStyle = (): ViewStyle => {
    const buttonState = getButtonState();
    const stateStyles = {
      disabled: styles.buttonDisabled,
      primary: styles.buttonPrimary,
      selected: styles.buttonSelected,
      default: styles.buttonDefault,
    };

    return { ...styles.button, ...stateStyles[buttonState] };
  };

  const getTextStyle = (): TextStyle => {
    const buttonState = getButtonState();
    const isLight = buttonState === 'primary' || buttonState === 'selected';
    
    return {
      ...styles.buttonText,
      color: disabled ? COLORS.TEXT_DISABLED : 
             isLight ? COLORS.TEXT_WHITE : COLORS.TEXT_WHITE,
    };
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
    paddingVertical: DIMENSIONS.BUTTON_PADDING_VERTICAL,
    paddingHorizontal: DIMENSIONS.BUTTON_PADDING_HORIZONTAL,
    borderRadius: DIMENSIONS.BUTTON_BORDER_RADIUS,
    marginVertical: DIMENSIONS.SPACING_SMALL,
    minHeight: DIMENSIONS.BUTTON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDefault: {
    backgroundColor: COLORS.SECONDARY,
  },
  buttonSelected: {
    backgroundColor: COLORS.TEXT_SECONDARY,
  },
  buttonPrimary: {
    backgroundColor: COLORS.PRIMARY,
  },
  buttonDisabled: {
    backgroundColor: COLORS.BACKGROUND_DISABLED,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    fontWeight: '600',
  },
});