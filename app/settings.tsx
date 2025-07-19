import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectionButton } from '../components/SelectionButton';
import { PageHeader } from '../components/sections/PageHeader';
import { useTheme } from '../contexts/ThemeContext';
import { useWorkout } from '../contexts/WorkoutContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  rightElement: React.ReactNode;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  rightElement,
  onPress,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
      </View>
    </View>
  );
};

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { saveWorkoutData, loadWorkoutData, state } = useWorkout();
  const [autoSave, setAutoSave] = useState(true);
  const [restTimerSound, setRestTimerSound] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const styles = createStyles(theme);

  const handleExportData = async (): Promise<void> => {
    try {
      const exportData = {
        workoutHistory: state.workoutHistory,
        workoutTemplates: state.workoutTemplates,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      Alert.alert(
        'Export Data',
        `Ready to export ${state.workoutHistory.length} workouts and ${state.workoutTemplates.length} templates. In a full implementation, this would save to files or cloud storage.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Export', onPress: () => console.log('Export data:', exportData) },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to prepare data for export');
    }
  };

  const handleClearData = (): void => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your workouts, templates, and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              await loadWorkoutData();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const handleResetSettings = (): void => {
    Alert.alert(
      'Reset Settings',
      'This will reset all app settings to their default values.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setAutoSave(true);
            setRestTimerSound(true);
            setNotificationsEnabled(true);
            Alert.alert('Success', 'Settings have been reset to defaults');
          },
        },
      ]
    );
  };

  const getDataSizeInfo = (): string => {
    const workoutCount = state.workoutHistory.length;
    const templateCount = state.workoutTemplates.length;
    return `${workoutCount} workouts, ${templateCount} templates`;
  };

  return (
    <ScreenContainer>
      <PageHeader 
        title="Settings"
        subtitle="Customize your workout experience"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Workout Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Settings</Text>
          
          <SettingItem
            icon="save"
            title="Auto-save Workouts"
            subtitle="Automatically save workout progress"
            rightElement={
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary + '50',
                }}
                thumbColor={autoSave ? theme.colors.primary : theme.colors.surface}
              />
            }
          />

          <SettingItem
            icon="notifications"
            title="Rest Timer Sound"
            subtitle="Play sound when rest timer completes"
            rightElement={
              <Switch
                value={restTimerSound}
                onValueChange={setRestTimerSound}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary + '50',
                }}
                thumbColor={restTimerSound ? theme.colors.primary : theme.colors.surface}
              />
            }
          />

          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Receive workout reminders and updates"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary + '50',
                }}
                thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.surface}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <SettingItem
            icon="cloud-upload"
            title="Export Data"
            subtitle="Backup your workouts and templates"
            rightElement={
              <SelectionButton
                title="Export"
                onPress={handleExportData}
                variant="secondary"
              />
            }
          />

          <SettingItem
            icon="information-circle"
            title="Storage Info"
            subtitle={getDataSizeInfo()}
            rightElement={
              <Text style={styles.storageSize}>
                {(JSON.stringify(state).length / 1024).toFixed(1)} KB
              </Text>
            }
          />

          <SettingItem
            icon="refresh"
            title="Sync Data"
            subtitle="Refresh workout data from storage"
            rightElement={
              <SelectionButton
                title="Sync"
                onPress={loadWorkoutData}
                variant="secondary"
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <SettingItem
            icon="information"
            title="App Version"
            subtitle="Current version information"
            rightElement={
              <Text style={styles.versionText}>1.0.0</Text>
            }
          />

          <SettingItem
            icon="help-circle"
            title="Help & Support"
            subtitle="Get help with using the app"
            rightElement={
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.textTertiary} 
              />
            }
            onPress={() => {
              Alert.alert(
                'Help & Support',
                'For support, please contact us at support@workoutpartner.app or visit our help center.',
                [{ text: 'OK' }]
              );
            }}
          />

          <SettingItem
            icon="shield-checkmark"
            title="Privacy Policy"
            subtitle="How we handle your data"
            rightElement={
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.textTertiary} 
              />
            }
            onPress={() => {
              Alert.alert(
                'Privacy Policy',
                'All your workout data is stored locally on your device. We do not collect or share any personal information.',
                [{ text: 'OK' }]
              );
            }}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
          
          <View style={styles.dangerContainer}>
            <SelectionButton
              title="Reset Settings"
              onPress={handleResetSettings}
              variant="secondary"
            />
            
            <SelectionButton
              title="Clear All Data"
              onPress={handleClearData}
              variant="secondary"
            />
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  content: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  dangerTitle: {
    color: theme.colors.error,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  settingRight: {
    alignItems: 'flex-end',
  },
  storageSize: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
  },
  versionText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
  },
  dangerContainer: {
    gap: theme.spacing.sm,
  },
  footer: {
    height: theme.spacing.xxl,
  },
});