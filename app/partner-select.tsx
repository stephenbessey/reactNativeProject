import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { useWorkoutSetup } from '../hooks/useWorkoutSetup';

export default function PartnerSelectScreen() {
  const { username, userType } = useLocalSearchParams<{
    username: string;
    userType: string;
  }>();
  
  const { partners, togglePartnerSelection, getSelectedPartners, initializePartners } = useWorkoutSetup();

  useEffect(() => {
    if (userType) {
      initializePartners(userType as 'coach' | 'trainee');
    }
  }, [userType]);

  const handlePartnerToggle = (partnerId: string): void => {
    togglePartnerSelection(partnerId);
  };

  const handleNext = (): void => {
    const selectedPartners = getSelectedPartners();
    
    if (selectedPartners.length === 0) {
      return;
    }

    router.push({
      pathname: '/day-select',
      params: {
        username,
        userType,
        selectedPartners: JSON.stringify(selectedPartners.map(p => ({ name: p.name, type: p.type }))),
      }
    });
  };

  const selectedCount = getSelectedPartners().length;
  const partnerType = userType === 'coach' ? 'trainees' : 'coaches';

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Select your {partnerType}</Text>
        <Text style={styles.subtitle}>
          Welcome, {username}! Choose your workout {partnerType.slice(0, -1)}
          {selectedCount > 0 && ` (${selectedCount} selected)`}
        </Text>
      </View>

      <ScrollView style={styles.partnerList} showsVerticalScrollIndicator={false}>
        {partners.map((partner) => (
          <View key={partner.id} style={styles.partnerItem}>
            <SelectionButton
              title={`${partner.name} (${partner.type})`}
              isSelected={partner.isSelected}
              onPress={() => handlePartnerToggle(partner.id)}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.nextSection}>
        <SelectionButton
          title="Next"
          variant="primary"
          onPress={handleNext}
          disabled={selectedCount === 0}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  partnerList: {
    flex: 1,
  },
  partnerItem: {
    marginBottom: 4,
  },
  nextSection: {
    marginTop: 20,
    marginBottom: 20,
  },
});