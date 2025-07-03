import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { FormInput } from '../components/FormInput';
import { useWorkoutSetup } from '../hooks/useWorkoutSetup';

export default function InitialScreen() {
  const [username, setUsername] = useState('');
  const [selectedType, setSelectedType] = useState<'coach' | 'trainee' | null>(null);
  const { createUser, setUser, initializePartners } = useWorkoutSetup();

  const handleTypeSelection = (type: 'coach' | 'trainee'): void => {
    setSelectedType(type);
  };

  const handleLogin = (): void => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }

    if (!selectedType) {
      Alert.alert('Error', 'Please select your type');
      return;
    }

    const newUser = createUser(username.trim(), selectedType);
    setUser(newUser);
    initializePartners(selectedType);

    router.push({
      pathname: '/partner-select',
      params: {
        username: newUser.username,
        userType: newUser.type
      }
    });
  };

  const getUserTypeDescription = (): string => {
    if (!selectedType) return '';

    return selectedType === 'coach'
      ? 'Create workouts and track trainee progress'
      : 'Follow workout plans and provide feedback';
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Workout Partner</Text>
        <Text style={styles.subtitle}>Connect coaches with trainees for better fitness results</Text>
      </View>

      <View style={styles.typeSelection}>
        <Text style={styles.sectionTitle}>Select your role</Text>
        <View style={styles.typeButtons}>
          <SelectionButton
            title="Coach"
            isSelected={selectedType === 'coach'}
            onPress={() => handleTypeSelection('coach')}
          />
          <SelectionButton
            title="Trainee"
            isSelected={selectedType === 'trainee'}
            onPress={() => handleTypeSelection('trainee')}
          />
        </View>
        {selectedType && (
          <Text style={styles.typeDescription}>{getUserTypeDescription()}</Text>
        )}
      </View>

      <View style={styles.form}>
        <FormInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          required
        />
      </View>

      <View style={styles.loginSection}>
        <SelectionButton
          title="Continue"
          variant="primary"
          onPress={handleLogin}
          disabled={!username.trim() || !selectedType}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  typeSelection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  typeDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  form: {
    marginBottom: 30,
  },
  loginSection: {
    marginTop: 'auto',
    marginBottom: 40,
  },
});
