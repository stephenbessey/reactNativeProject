import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { commonStyles } from '../styles/commonStyles';

interface ScreenContainerProps {
  children: React.ReactNode;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children }) => {
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {children}
      </View>
    </SafeAreaView>
  );
};