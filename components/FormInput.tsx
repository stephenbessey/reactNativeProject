import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, DIMENSIONS } from '../constants';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.TEXT_TERTIARY}
        accessibilityLabel={label}
        accessibilityHint={required ? 'Required field' : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: DIMENSIONS.SPACING_MEDIUM,
  },
  label: {
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    fontWeight: '600',
    marginBottom: DIMENSIONS.SPACING_SMALL,
    color: COLORS.TEXT_PRIMARY,
  },
  required: {
    color: COLORS.ERROR,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: DIMENSIONS.SPACING_SMALL,
    paddingHorizontal: DIMENSIONS.SPACING_MEDIUM,
    paddingVertical: DIMENSIONS.SPACING_MEDIUM,
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    backgroundColor: COLORS.BACKGROUND_WHITE,
  },
});