import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutPartner, UserType } from '../../types';
import { getPartnerLabel } from '../factories';
import { commonStyles } from '../../styles/commonStyles';
import { COLORS, DIMENSIONS } from '../../constants';

interface PartnersSectionProps {
  partners: Array<{ name: string; type: string }>;
  userType: UserType;
}

const PartnerItem: React.FC<{ partner: { name: string; type: string } }> = ({ partner }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
    <Ionicons name="person" size={DIMENSIONS.ICON_SIZE_SMALL} color={COLORS.PRIMARY} />
    <Text style={{ fontSize: 16, color: '#666666' }}>{partner.name}</Text>
  </View>
);

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partners, userType }) => {
  const partnerLabel = getPartnerLabel(userType);
  const sectionTitle = `Your ${partnerLabel.charAt(0).toUpperCase() + partnerLabel.slice(1)}`;

  return (
    <View style={commonStyles.card}>
      <Text style={commonStyles.sectionTitle}>{sectionTitle}</Text>
      {partners.map((partner, index) => (
        <PartnerItem key={index} partner={partner} />
      ))}
    </View>
  );
};