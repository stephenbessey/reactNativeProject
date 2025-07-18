import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Animated } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { MOTION_DETECTION } from '../../constants/workoutConstants';
import { handleWorkoutError, WorkoutErrorCode } from '../../utils/errorHandling';
import { useMotionDetection } from '../../hooks/useMotionDetection';
import { MotionDetectorHeader } from './motion/MotionDetectorHeader';
import { CalibrationDisplay } from './motion/CalibrationDisplay';
import { DetectionDisplay } from './motion/DetectionDisplay';
import { MotionControls } from './motion/MotionControls';
import { MotionInstructions } from './motion/MotionInstructions';

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
  const [countdown, setCountdown] = useState(MOTION_DETECTION.CALIBRATION_COUNTDOWN_SECONDS);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const {
    isDetecting,
    detectedReps,
    isCalibrating,
    detectionThreshold,
    startCalibration,
    stopDetection,
    adjustSensitivity,
    resetDetection
  } = useMotionDetection({
    targetReps,
    onDetection,
    onError: (error) => handleWorkoutError(error)
  });

  useEffect(() => {
    if (visible) {
      resetDetection();
    } else {
      stopDetection();
    }
  }, [visible, resetDetection, stopDetection]);

  const handleStartCalibration = (): void => {
    try {
      setCountdown(MOTION_DETECTION.CALIBRATION_COUNTDOWN_SECONDS);
      startCalibration();
      startCountdownTimer();
    } catch (error) {
      handleWorkoutError(
        error instanceof Error 
          ? error 
          : new Error('Failed to start motion detection'),
        { title: 'Motion Detection Error' }
      );
    }
  };

  const startCountdownTimer = (): void => {
    const timer = setInterval(() => {
      setCountdown(previousCountdown => {
        if (previousCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return previousCountdown - 1;
      });
    }, 1000);
  };

  const handleManualComplete = (): void => {
    const finalRepCount = detectedReps > 0 ? detectedReps : targetReps;
    onDetection(finalRepCount);
  };

  const handleSensitivityIncrease = (): void => {
    adjustSensitivity(0.2);
  };

  const handleSensitivityDecrease = (): void => {
    adjustSensitivity(-0.2);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <MotionDetectorHeader onClose={onClose} />

          <View style={styles.statusContainer}>
            {isCalibrating ? (
              <CalibrationDisplay countdown={countdown} />
            ) : (
              <DetectionDisplay
                detectedReps={detectedReps}
                targetReps={targetReps}
                isDetecting={isDetecting}
              />
            )}
          </View>

          <MotionControls
            isDetecting={isDetecting}
            isCalibrating={isCalibrating}
            onStartCalibration={handleStartCalibration}
            onStopDetection={stopDetection}
            onCompleteManually={handleManualComplete}
            onSensitivityIncrease={handleSensitivityIncrease}
            onSensitivityDecrease={handleSensitivityDecrease}
          />

          <MotionInstructions />
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
  statusContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
});