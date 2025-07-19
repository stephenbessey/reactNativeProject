import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { PageHeader } from '../components/sections/PageHeader';
import { useTheme } from '../contexts/ThemeContext';

interface Contact {
  id: string;
  name: string;
  phoneNumbers?: { number: string }[];
  emails?: { email: string }[];
}

interface ContactPickerProps {
  userType: 'coach' | 'trainee';
  onContactSelected: (contact: Contact) => void;
  onSkip: () => void;
}

export const ContactPicker: React.FC<ContactPickerProps> = ({
  userType,
  onContactSelected,
  onSkip,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    requestContactsPermission();
  }, []);

  const requestContactsPermission = async (): Promise<void> => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status === 'granted') {
        setPermissionGranted(true);
        loadContacts();
      } else {
        setPermissionGranted(false);
        Alert.alert(
          'Contacts Permission Required',
          'To invite workout partners from your contacts, please enable contacts access in your device settings.',
          [
            { text: 'Skip', onPress: onSkip },
            { text: 'Try Again', onPress: requestContactsPermission },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      Alert.alert(
        'Error',
        'Unable to access contacts. You can skip this step and add partners manually later.',
        [{ text: 'Skip', onPress: onSkip }]
      );
    }
  };

  const loadContacts = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        sort: Contacts.SortTypes.FirstName,
      });

      // Filter and format contacts
      const formattedContacts: Contact[] = data
        .filter(contact => contact.name && (contact.phoneNumbers?.length || contact.emails?.length))
        .map(contact => ({
          id: contact.id || Math.random().toString(),
          name: contact.name || 'Unknown',
          phoneNumbers: contact.phoneNumbers,
          emails: contact.emails,
        }))
        .slice(0, 50); // Limit to first 50 contacts for performance

      setContacts(formattedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSelect = (contact: Contact): void => {
    const partnerType = userType === 'coach' ? 'trainee' : 'coach';
    
    Alert.alert(
      'Invite Contact',
      `Invite ${contact.name} to be your workout ${partnerType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Invite',
          onPress: () => {
            // In a real app, this would send an SMS or email invitation
            Alert.alert(
              'Invitation Sent!',
              `We've sent an invitation to ${contact.name}. They'll receive a link to download the app and connect with you.`,
              [{ text: 'OK', onPress: () => onContactSelected(contact) }]
            );
          },
        },
      ]
    );
  };

  const getContactInfo = (contact: Contact): string => {
    if (contact.phoneNumbers?.length) {
      return contact.phoneNumbers[0].number;
    }
    if (contact.emails?.length) {
      return contact.emails[0].email;
    }
    return 'No contact info';
  };

  const partnerType = userType === 'coach' ? 'trainee' : 'coach';

  if (!permissionGranted) {
    return (
      <ScreenContainer>
        <PageHeader 
          title="Invite a Partner"
          subtitle="Access your contacts to invite workout partners"
        />
        
        <View style={styles.permissionContainer}>
          <Ionicons name="people" size={64} color={theme.colors.textTertiary} />
          <Text style={styles.permissionTitle}>Contacts Access Required</Text>
          <Text style={styles.permissionText}>
            To invite friends from your contacts to be your workout {partnerType}, 
            we need access to your contacts.
          </Text>
          
          <View style={styles.permissionActions}>
            <SelectionButton
              title="Grant Permission"
              onPress={requestContactsPermission}
              variant="primary"
            />
            <SelectionButton
              title="Skip for Now"
              onPress={onSkip}
              variant="secondary"
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <PageHeader 
        title={`Invite a ${partnerType.charAt(0).toUpperCase() + partnerType.slice(1)}`}
        subtitle={`Choose someone from your contacts to invite as your workout ${partnerType}`}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.contactsList} showsVerticalScrollIndicator={false}>
            {contacts.map((contact) => (
              <Pressable
                key={contact.id}
                style={styles.contactItem}
                onPress={() => handleContactSelect(contact)}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="person" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactDetails}>{getContactInfo(contact)}</Text>
                </View>
                <Ionicons 
                  name="add-circle" 
                  size={24} 
                  color={theme.colors.primary} 
                />
              </Pressable>
            ))}

            {contacts.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No contacts found with phone numbers or email addresses.
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.actionContainer}>
            <SelectionButton
              title="Skip - Add Partner Later"
              onPress={onSkip}
              variant="secondary"
            />
          </View>
        </>
      )}
    </ScreenContainer>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  permissionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  permissionActions: {
    width: '100%',
    gap: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
  },
  contactsList: {
    flex: 1,
    marginBottom: theme.spacing.lg,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  contactDetails: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionContainer: {
    paddingBottom: theme.spacing.lg,
  },
});