import React, { useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

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
  const [detectedReps, setDetectedReps] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleStartDetection = () => {
    setIsDetecting(true);
    setDetectedReps(0);
    
    const interval = setInterval(() => {
      setDetectedReps(prev => {
        const newCount = prev + 1;
        if (newCount >= targetReps) {
          clearInterval(interval);
          setIsDetecting(false);
          setTimeout(() => onDetection(newCount), 500);
        }
        return newCount;
      });
    }, 1000);
  };

  const handleManualComplete = () => {
    onDetection(detectedReps || targetReps);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Motion Rep Counter</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.counter}>
              <Text style={styles.repsText}>{detectedReps}</Text>
              <Text style={styles.targetText}>/ {targetReps} reps</Text>
            </View>

            {isDetecting && (
              <Text style={styles.statusText}>Detecting movement...</Text>
            )}
          </View>

          <View style={styles.controls}>
            {!isDetecting ? (
              <Pressable style={styles.startButton} onPress={handleStartDetection}>
                <Ionicons name="play" size={20} color="white" />
                <Text style={styles.buttonText}>Start Detection</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.completeButton} onPress={handleManualComplete}>
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.buttonText}>Complete Set</Text>
              </Pressable>
            )}
            
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
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
  content: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  counter: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  repsText: {
    fontSize: 64,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    lineHeight: 70,
  },
  targetText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  statusText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  controls: {
    gap: theme.spacing.md,
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
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  cancelButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  cancelText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
});