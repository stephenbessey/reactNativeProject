import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface NumberInputProps {
  label: string;
  value: number;
  onChangeValue: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChangeValue,
  min = 0,
  max = 999,
  step = 1,
  icon,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleTextChange = (text: string): void => {
    const numValue = parseFloat(text) || 0;
    const clampedValue = Math.max(min, Math.min(max, numValue));
    onChangeValue(clampedValue);
  };

  const handleIncrement = (): void => {
    const newValue = Math.min(max, value + step);
    onChangeValue(newValue);
  };

  const handleDecrement = (): void => {
    const newValue = Math.max(min, value - step);
    onChangeValue(newValue);
  };

  const displayValue = step < 1 ? value.toFixed(1) : value.toString();

  return (
    <View style={styles.container}>
      {icon && (
        <Ionicons 
          name={icon} 
          size={16} 
          color={theme.colors.primary} 
          style={styles.icon} 
        />
      )}
      
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.inputContainer}>
        <Pressable
          style={[styles.button, value <= min && styles.disabledButton]}
          onPress={handleDecrement}
          disabled={value <= min}
        >
          <Ionicons 
            name="remove" 
            size={16} 
            color={value <= min ? theme.colors.textTertiary : theme.colors.primary} 
          />
        </Pressable>

        <TextInput
          style={styles.input}
          value={displayValue}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          selectTextOnFocus
          textAlign="center"
        />

        <Pressable
          style={[styles.button, value >= max && styles.disabledButton]}
          onPress={handleIncrement}
          disabled={value >= max}
        >
          <Ionicons 
            name="add" 
            size={16} 
            color={value >= max ? theme.colors.textTertiary : theme.colors.primary} 
          />
        </Pressable>
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm,
    textAlign: 'center',
    minWidth: 60,
  },
});
