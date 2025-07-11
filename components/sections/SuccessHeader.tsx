import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, DIMENSIONS } from '../../constants';

export const SuccessHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Ionicons name="checkmark-circle" size={DIMENSIONS.ICON_SIZE_LARGE} color={COLORS.SUCCESS} />
      <Text style={styles.title}>Setup Complete!</Text>
      <Text style={styles.subtitle}>Your workout partnership is ready</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: DIMENSIONS.SPACING_EXTRA_LARGE,
  },
  title: {
    fontSize: DIMENSIONS.FONT_SIZE_TITLE,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginTop: DIMENSIONS.SPACING_MEDIUM,
    marginBottom: DIMENSIONS.SPACING_SMALL,
  },
  subtitle: {
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    color: COLORS.TEXT_TERTIARY,
  },
});