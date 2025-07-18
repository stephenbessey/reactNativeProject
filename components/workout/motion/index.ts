// Motion detector sub-components
import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';

// Header Component
interface MotionDetectorHeaderProps {
  onClose: () => void;
}

export const MotionDetectorHeader: React.FC<MotionDetectorHeaderProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const styles = createHeaderStyles(theme);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Motion Rep Counter</Text>
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={24} color={theme.colors.text} />
      </Pressable>
    </View>
  );
};

// Calibration Display Component
interface CalibrationDisplayProps {
  countdown: number;
}

export const CalibrationDisplay: React.FC<CalibrationDisplayProps> = ({ countdown }) => {
  const { theme } = useTheme();
  const styles = createCalibrationStyles(theme);

  return (
    <View style={styles.calibrationContainer}>
      <Text style={styles.calibrationTitle}>Get Ready</Text>
      <Text style={styles.countdownText}>{countdown}</Text>
      <Text style={styles.calibrationSubtext}>
        Hold your device steady and prepare to start your exercise
      </Text>
    </View>
  );
};

// Detection Display Component
interface DetectionDisplayProps {
  detectedReps: number;
  targetReps: number;
  isDetecting: boolean;
}

export const DetectionDisplay: React.FC<DetectionDisplayProps> = ({
  detectedReps,
  targetReps,
  isDetecting
}) => {
  const { theme } = useTheme();
  const styles = createDetectionStyles(theme);
  const progressPercentage = (detectedReps / targetReps) * 100;

  return (
    <View style={styles.detectionContainer}>
      <View style={styles.repCounter}>
        <Text style={styles.repCountText}>{detectedReps}</Text>
        <Text style={styles.repTargetText}>/ {targetReps} reps</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
          />
        </View>
      </View>

      {isDetecting && (
        <Text style={styles.instructionText}>
          Perform your exercise - movement will be detected automatically
        </Text>
      )}
    </View>
  );
};

// Controls Component
interface MotionControlsProps {
  isDetecting: boolean;
  isCalibrating: boolean;
  onStartCalibration: () => void;
  onStopDetection: () => void;
  onCompleteManually: () => void;
  onSensitivityIncrease: () => void;
  onSensitivityDecrease: () => void;
}

export const MotionControls: React.FC<MotionControlsProps> = ({
  isDetecting,
  isCalibrating,
  onStartCalibration,
  onStopDetection,
  onCompleteManually,
  onSensitivityIncrease,
  onSensitivityDecrease
}) => {
  const { theme } = useTheme();
  const styles = createControlsStyles(theme);

  return (
    <View style={styles.controls}>
      {!isDetecting && !isCalibrating && (
        <Pressable style={styles.startButton} onPress={onStartCalibration}>
          <Ionicons name="play" size={24} color="white" />
          <Text style={styles.startButtonText}>Start Detection</Text>
        </Pressable>
      )}

      {isDetecting && (
        <>
          <View style={styles.sensitivityControls}>
            <Text style={styles.sensitivityLabel}>Sensitivity</Text>
            <View style={styles.sensitivityButtons}>
              <Pressable style={styles.sensitivityButton} onPress={onSensitivityDecrease}>
                <Text style={styles.sensitivityButtonText}>Less</Text>
              </Pressable>
              <Pressable style={styles.sensitivityButton} onPress={onSensitivityIncrease}>
                <Text style={styles.sensitivityButtonText}>More</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Pressable style={styles.completeButton} onPress={onCompleteManually}>
              <Text style={styles.completeButtonText}>Complete Set</Text>
            </Pressable>
            
            <Pressable style={styles.stopButton} onPress={onStopDetection}>
              <Text style={styles.stopButtonText}>Stop</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

// Instructions Component
export const MotionInstructions: React.FC = () => {
  const { theme } = useTheme();
  const styles = createInstructionsStyles(theme);

  return (
    <View style={styles.instructionsContainer}>
      <Text style={styles.instructionsTitle}>How it works:</Text>
      <Text style={styles.instructionsText}>
        • Hold your device firmly during exercise{'\n'}
        • Consistent movement patterns work best{'\n'}
        • Adjust sensitivity if reps aren't detected{'\n'}
        • Manual completion available anytime
      </Text>
    </View>
  );
};

// Styles
const createHeaderStyles = (theme: any) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const createCalibrationStyles = (theme: any) => StyleSheet.create({
  calibrationContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  calibrationTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  countdownText: {
    fontSize: 64,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  calibrationSubtext: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

const createDetectionStyles = (theme: any) => StyleSheet.create({
  detectionContainer: {
    alignItems: 'center',
    width: '100%',
  },
  repCounter: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  repCountText: {
    fontSize: 72,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    lineHeight: 80,
  },
  repTargetText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  progressContainer: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.sm,
  },
  instructionText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

const createControlsStyles = (theme: any) => StyleSheet.create({
  controls: {
    marginBottom: theme.spacing.lg,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  startButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  sensitivityControls: {
    marginBottom: theme.spacing.md,
  },
  sensitivityLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  sensitivityButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  sensitivityButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sensitivityButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  completeButton: {
    flex: 1,
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  stopButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stopButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

const createInstructionsStyles = (theme: any) => StyleSheet.create({
  instructionsContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  instructionsTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  instructionsText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
});