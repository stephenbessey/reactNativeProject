import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { PageHeader } from '../components/sections/PageHeader';
import { useWorkoutSetup } from '../hooks/useWorkoutSetup';
import { useWorkoutNavigation } from '../hooks/useWorkoutNavigation';
import { validateSelections } from '../utils/validation';
import { getPartnerLabel } from '../utils/userHelpers';
import { UserType } from '../types';
import { commonStyles } from '../styles/commonStyles';

export default function PartnerSelectScreen() {
  const { username, userType } = useLocalSearchParams<Record<string, string>>();
  
  const { 
    partners, 
    togglePartnerSelection, 
    getSelectedPartners, 
    initializePartners 
  } = useWorkoutSetup();
  
  const { navigateToDaySelect } = useWorkoutNavigation();

  useEffect(() => {
    if (userType) {
      initializePartners(userType as UserType);
    }
  }, [userType]);

  const handlePartnerToggle = (partnerId: string): void => {
    togglePartnerSelection(partnerId);
  };

  const handleNext = (): void => {
    const selectedPartners = getSelectedPartners();
    
    if (!validateSelections(selectedPartners)) {
      return;
    }

    navigateToDaySelect(username!, userType as UserType, selectedPartners);
  };

  const selectedPartners = getSelectedPartners();
  const partnerType = getPartnerLabel(userType as UserType);
  const selectionCount = selectedPartners.length;

  const getSubtitle = (): string => {
    const baseText = `Welcome, ${username}! Choose your workout ${partnerType.slice(0, -1)}`;
    return selectionCount > 0 ? `${baseText} (${selectionCount} selected)` : baseText;
  };

  return (
    <ScreenContainer>
      <PageHeader 
        title={`Select your ${partnerType}`}
        subtitle={getSubtitle()}
      />

      <ScrollView style={commonStyles.listContainer} showsVerticalScrollIndicator={false}>
        {partners.map((partner) => (
          <View key={partner.id} style={commonStyles.listItem}>
            <SelectionButton
              title={`${partner.name} (${partner.type})`}
              isSelected={partner.isSelected}
              onPress={() => handlePartnerToggle(partner.id)}
            />
          </View>
        ))}
      </ScrollView>

      <View style={commonStyles.actionContainer}>
        <SelectionButton
          title="Next"
          variant="primary"
          onPress={handleNext}
          disabled={selectionCount === 0}
        />
      </View>
    </ScreenContainer>
  );
}