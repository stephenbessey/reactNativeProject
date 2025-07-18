import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { FormInput } from '../components/FormInput';
import { PageHeader } from '../components/sections/PageHeader';
import { useWorkoutSetup } from '../hooks/useWorkoutSetup';
import { useWorkoutNavigation } from '../hooks/useWorkoutNavigation';
import { validateUsername, validateUserType } from "../lib/validation";
import { getUserDescription } from "../factories";
import { UserType, USER_TYPES } from '../constants/userTypes';
import { commonStyles } from '../styles/commonStyles';

export default function InitialScreen() {
  const [username, setUsername] = useState('');
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  
  const { createUser, setUser, initializePartners } = useWorkoutSetup();
  const { navigateToPartnerSelect } = useWorkoutNavigation();

  const handleTypeSelection = (type: UserType): void => {
    setSelectedType(type);
  };

  const handleContinue = (): void => {
    if (!validateUsername(username)) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }

    if (!validateUserType(selectedType)) {
      Alert.alert('Error', 'Please select your type');
      return;
    }

    const newUser = createUser(username.trim(), selectedType);
    setUser(newUser);
    initializePartners(selectedType);
    navigateToPartnerSelect(newUser.username, newUser.type);
  };

  const isFormValid = validateUsername(username) && validateUserType(selectedType);

  return (
    <ScreenContainer>
      <PageHeader 
        title="Workout Partner"
        subtitle="Connect coaches with trainees for better fitness results"
      />

      <RoleSelection 
        selectedType={selectedType}
        onTypeSelection={handleTypeSelection}
      />

      <View style={commonStyles.section}>
        <FormInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          required
        />
      </View>

      <View style={commonStyles.actionContainer}>
        <SelectionButton
          title="Continue"
          variant="primary"
          onPress={handleContinue}
          disabled={!isFormValid}
        />
      </View>
    </ScreenContainer>
  );
}

// Role Selection Component
interface RoleSelectionProps {
  selectedType: UserType | null;
  onTypeSelection: (type: UserType) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ selectedType, onTypeSelection }) => {
  return (
    <View style={commonStyles.section}>
      <Text style={commonStyles.sectionTitle}>Select your role</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <SelectionButton
          title="Coach"
          isSelected={selectedType === USER_TYPES.COACH}
          onPress={() => onTypeSelection(USER_TYPES.COACH)}
        />
        <SelectionButton
          title="Trainee"
          isSelected={selectedType === USER_TYPES.TRAINEE}
          onPress={() => onTypeSelection(USER_TYPES.TRAINEE)}
        />
      </View>
      {selectedType && (
        <Text style={{ 
          fontSize: 14, 
          color: '#666666', 
          textAlign: 'center', 
          marginTop: 12, 
          fontStyle: 'italic' 
        }}>
          {getUserDescription(selectedType)}
        </Text>
      )}
    </View>
  );
};