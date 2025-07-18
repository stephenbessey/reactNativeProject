import React from 'react';
import { View, Text } from 'react-native';
import { commonStyles } from '../../styles/commonStyles';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={commonStyles.pageHeader}>
      <Text style={commonStyles.pageTitle}>{title}</Text>
      {subtitle && <Text style={commonStyles.pageSubtitle}>{subtitle}</Text>}
    </View>
  );
};