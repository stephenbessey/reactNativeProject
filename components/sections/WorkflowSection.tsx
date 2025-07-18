import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserType } from '../../types';
import { getWorkflowDescription, getNextStepsText } from "../../factories";
import { commonStyles } from '../../styles/commonStyles';
import { COLORS, DIMENSIONS } from '../../constants';

interface WorkflowSectionProps {
  userType: UserType;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ userType }) => {
  const workflowDescription = getWorkflowDescription(userType);
  const nextStepsText = getNextStepsText(userType);

  return (
    <View style={[commonStyles.highlightCard, styles.workflowContainer]}>
      <Text style={commonStyles.sectionTitle}>Your Workflow</Text>
      <Text style={styles.workflowText}>{workflowDescription}</Text>
      <Text style={styles.nextStepsText}>{nextStepsText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  workflowContainer: {
    backgroundColor: COLORS.BACKGROUND_BLUE,
  },
  workflowText: {
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    fontWeight: '500',
    color: '#1976D2',
    marginBottom: DIMENSIONS.SPACING_SMALL,
  },
  nextStepsText: {
    fontSize: DIMENSIONS.FONT_SIZE_SMALL,
    color: COLORS.TEXT_TERTIARY,
    lineHeight: 20,
  },
});