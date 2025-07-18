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
      <View style={styles.labelContainer}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={16} 
            color={theme.colors?.primary || '#007AFF'} 
            style={styles.icon} 
          />
        )}
        <Text style={styles.label}>{label}</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Pressable
          style={[
            styles.button, 
            value <= min && styles.disabledButton
          ]}
          onPress={handleDecrement}
          disabled={value <= min}
        >
          <Ionicons 
            name="remove" 
            size={16} 
            color={value <= min ? (theme.colors?.textTertiary || '#999') : (theme.colors?.primary || '#007AFF')} 
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
          style={[
            styles.button, 
            value >= max && styles.disabledButton
          ]}
          onPress={handleIncrement}
          disabled={value >= max}
        >
          <Ionicons 
            name="add" 
            size={16} 
            color={value >= max ? (theme.colors?.textTertiary || '#999') : (theme.colors?.primary || '#007AFF')} 
          />
        </Pressable>
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors?.text || '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors?.surface || '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors?.text || '#333',
    backgroundColor: 'white',
    borderRadius: 4,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: theme.colors?.border || '#e0e0e0',
  },
});
