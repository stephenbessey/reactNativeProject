import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { PageHeader } from '../components/sections/PageHeader';
import { ContactPicker } from '../components/ContactPicker';
import { useWorkoutSetup } from '../hooks/useWorkoutSetup';
import { useWorkoutNavigation } from '../hooks/useWorkoutNavigation';
import { validateSelections } from "../lib/validation/userValidation";
import { getPartnerLabel } from "../factories";
import { UserType, WorkoutPartner } from '../types';
import { commonStyles } from '../styles/commonStyles';

export default function PartnerSelectScreen() {
  const { username, userType } = useLocalSearchParams<Record<string, string>>();
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [invitedContacts, setInvitedContacts] = useState<any[]>([]);
  
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

  const handleInviteFromContacts = (): void => {
    setShowContactPicker(true);
  };

  const handleContactSelected = (contact: any): void => {
    setInvitedContacts(prev => [...prev, contact]);
    setShowContactPicker(false);
  };

  const handleSkipContacts = (): void => {
    setShowContactPicker(false);
  };

  const handleNext = (): void => {
    const selectedPartners = getSelectedPartners();
    
    // Include invited contacts as selected partners with proper typing
    const invitedAsPartners: WorkoutPartner[] = invitedContacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      type: (userType === 'coach' ? 'trainee' : 'coach') as UserType,
      isSelected: true,
    }));
    
    const allSelectedPartners: WorkoutPartner[] = [
      ...selectedPartners,
      ...invitedAsPartners
    ];
    
    if (!validateSelections(allSelectedPartners)) {
      return;
    }

    navigateToDaySelect(username!, userType as UserType, allSelectedPartners);
  };

  const selectedPartners = getSelectedPartners();
  const partnerType = getPartnerLabel(userType as UserType);
  const totalSelections = selectedPartners.length + invitedContacts.length;

  const getSubtitle = (): string => {
    if (totalSelections === 0) {
      return `Choose existing ${partnerType} or invite someone new`;
    }
    return `${totalSelections} ${partnerType} selected`;
  };

  if (showContactPicker) {
    return (
      <ContactPicker
        userType={userType as 'coach' | 'trainee'}
        onContactSelected={handleContactSelected}
        onSkip={handleSkipContacts}
      />
    );
  }

  return (
    <ScreenContainer>
      <PageHeader 
        title={`Select your ${partnerType}`}
        subtitle={getSubtitle()}
      />

      <ScrollView style={commonStyles.listContainer} showsVerticalScrollIndicator={false}>
        {/* Existing Partners */}
        {partners.length > 0 && (
          <>
            <Text style={commonStyles.sectionTitle}>Existing {partnerType}</Text>
            {partners.map((partner) => (
              <View key={partner.id} style={commonStyles.listItem}>
                <SelectionButton
                  title={`${partner.name} (${partner.type})`}
                  isSelected={partner.isSelected}
                  onPress={() => handlePartnerToggle(partner.id)}
                />
              </View>
            ))}
          </>
        )}

        {/* Invited Contacts */}
        {invitedContacts.length > 0 && (
          <>
            <Text style={[commonStyles.sectionTitle, { marginTop: 24 }]}>Invited from Contacts</Text>
            {invitedContacts.map((contact) => (
              <View key={contact.id} style={commonStyles.listItem}>
                <SelectionButton
                  title={`${contact.name} (invited)`}
                  isSelected={true}
                  onPress={() => {}} // Already selected, can't toggle
                />
              </View>
            ))}
          </>
        )}

        {/* Invite from Contacts Option */}
        <View style={{ marginTop: 24 }}>
          <Text style={commonStyles.sectionTitle}>Invite New Partner</Text>
          <SelectionButton
            title={`Invite from Contacts`}
            onPress={handleInviteFromContacts}
            variant="secondary"
          />
        </View>

        {/* Empty state */}
        {partners.length === 0 && invitedContacts.length === 0 && (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ 
              fontSize: 16, 
              color: '#666666', 
              textAlign: 'center',
              lineHeight: 24 
            }}>
              No existing partners found. Invite someone from your contacts to get started!
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={commonStyles.actionContainer}>
        <SelectionButton
          title="Next"
          variant="primary"
          onPress={handleNext}
          disabled={totalSelections === 0}
        />
      </View>
    </ScreenContainer>
  );
}