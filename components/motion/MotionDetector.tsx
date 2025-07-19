import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useMotionDetection } from '../../hooks/useMotionDetection';

interface MotionDetectorProps {
  visible: boolean;
  targetReps: number;
  onDetection: (reps: number) => void;
  onClose: () => void;
}

export const MotionDetector: React.FC<MotionDetectorProps> = ({
  visible,
  targetReps,
  onDetection,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(3);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const {
    isDetecting,
    detectedReps,
    isCalibrating,
    startCalibration,
    stopDetection,
    resetDetection
  } = useMotionDetection({
    targetReps,
    onDetection,
    onError: (error) => console.error('Motion detection error:', error)
  });

  useEffect(() => {
    if (visible) {
      resetDetection();
    } else {
      stopDetection();
    }
  }, [visible, resetDetection, stopDetection]);

  const handleStartCalibration = (): void => {
    setCountdown(3);
    startCalibration();
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleManualComplete = (): void => {
    const finalRepCount = detectedReps > 0 ? detectedReps : targetReps;
    onDetection(finalRepCount);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Motion Rep Counter</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={styles.statusContainer}>
            {isCalibrating ? (
              <View style={styles.calibrationContainer}>
                <Text style={styles.calibrationTitle}>Get Ready</Text>
                <Text style={styles.countdownText}>{countdown}</Text>
                <Text style={styles.calibrationSubtext}>
                  Hold your device steady and prepare to start your exercise
                </Text>
              </View>
            ) : (
              <View style={styles.detectionContainer}>
                <View style={styles.repCounter}>
                  <Text style={styles.repCountText}>{detectedReps}</Text>
                  <Text style={styles.repTargetText}>/ {targetReps} reps</Text>
                </View>

                {isDetecting && (
                  <Text style={styles.instructionText}>
                    Perform your exercise - movement will be detected automatically
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.controls}>
            {!isDetecting && !isCalibrating && (
              <Pressable style={styles.startButton} onPress={handleStartCalibration}>
                <Ionicons name="play" size={24} color="white" />
                <Text style={styles.startButtonText}>Start Detection</Text>
              </Pressable>
            )}

            {isDetecting && (
              <View style={styles.actionButtons}>
                <Pressable style={styles.completeButton} onPress={handleManualComplete}>
                  <Text style={styles.completeButtonText}>Complete Set</Text>
                </Pressable>
                
                <Pressable style={styles.stopButton} onPress={stopDetection}>
                  <Text style={styles.stopButtonText}>Stop</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
    width: '90%',
    maxWidth: 400,
    ...theme.shadows.large,
  },
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
  statusContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
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
  instructionText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
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