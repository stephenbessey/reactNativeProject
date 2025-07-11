import React from 'react';
import { View, Text } from 'react-native';
import { User } from '../../types';
import { commonStyles } from '../../styles/commonStyles';

interface ProfileSectionProps {
  user: User;
}

const ProfileItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
    <Text style={{ fontSize: 16, fontWeight: '500', color: '#333333', minWidth: 60 }}>
      {label}:
    </Text>
    <Text style={{ fontSize: 16, color: '#666666', flex: 1 }}>
      {value}
    </Text>
  </View>
);

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  return (
    <View style={commonStyles.card}>
      <Text style={commonStyles.sectionTitle}>Your Profile</Text>
      <ProfileItem label="Name" value={user.username} />
      <ProfileItem label="Role" value={user.type} />
    </View>
  );
};