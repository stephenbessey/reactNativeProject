import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Animated } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface MotionDetectorProps {
  visible: boolean;
  targetReps: number;
  onDetection: (reps: number) => void;
  onClose: () => void;
}

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

export const MotionDetector: React.FC<MotionDetectorProps> = ({
  visible,
  targetReps,
  onDetection,
  onClose,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedReps, setDetectedReps] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const accelerometerData = useRef<AccelerometerData[]>([]);
  const lastPeakTime = useRef(0);
  const calibrationBaseline = useRef({ x: 0, y: 0, z: 0 });
  const detectionThreshold = useRef(1.5); // Adjustable sensitivity

  useEffect(() => {
    if (visible) {
      resetDetection();
    } else {
      stopDetection();
    }

    return () => {
      stopDetection();
    };
  }, [visible]);

  useEffect(() => {
    if (isDetecting) {
      startAccelerometer();
    } else {
      stopAccelerometer();
    }

    return () => {
      stopAccelerometer();
    };
  }, [isDetecting]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: detectedReps / targetReps,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [detectedReps, targetReps]);

  const resetDetection = (): void => {
    setDetectedReps(0);
    setIsDetecting(false);
    setIsCalibrating(false);
    setCountdown(3);
    accelerometerData.current = [];
    lastPeakTime.current = 0;
    progressAnim.setValue(0);
  };

  const startCalibration = (): void => {
    setIsCalibrating(true);
    setCountdown(3);

    const calibrationTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(calibrationTimer);
          calibrateBaseline();
          startDetection();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const calibrateBaseline = (): void => {
    if (accelerometerData.current.length > 0) {
      const recent = accelerometerData.current.slice(-30); // Last 30 readings
      const avg = recent.reduce(
        (acc, data) => ({
          x: acc.x + data.x,
          y: acc.y + data.y,
          z: acc.z + data.z,
        }),
        { x: 0, y: 0, z: 0 }
      );

      calibrationBaseline.current = {
        x: avg.x / recent.length,
        y: avg.y / recent.length,
        z: avg.z / recent.length,
      };
    }
  };

  const startDetection = (): void => {
    setIsCalibrating(false);
    setIsDetecting(true);
    startPulseAnimation();
  };

  const stopDetection = (): void => {
    setIsDetecting(false);
    stopAccelerometer();
    pulseAnim.stopAnimation();
  };

  const startAccelerometer = (): void => {
    Accelerometer.setUpdateInterval(100); // 10 Hz
    Accelerometer.addListener(handleAccelerometerUpdate);
  };

  const stopAccelerometer = (): void => {
    Accelerometer.removeAllListeners();
  };

  const handleAccelerometerUpdate = (data: AccelerometerData): void => {
    accelerometerData.current.push(data);

    if (accelerometerData.current.length > 50) {
      accelerometerData.current = accelerometerData.current.slice(-50);
    }

    if (isDetecting && calibrationBaseline.current) {
      detectRep(data);
    }
  };

  const detectRep = (data: AccelerometerData): void => {
    const baseline = calibrationBaseline.current;

    const diff = {
      x: Math.abs(data.x - baseline.x),
      y: Math.abs(data.y - baseline.y),
      z: Math.abs(data.z - baseline.z),
    };

    const magnitude = Math.sqrt(diff.x ** 2 + diff.y ** 2 + diff.z ** 2);

    const currentTime = Date.now();
    const timeSinceLastPeak = currentTime - lastPeakTime.current;

    if (magnitude > detectionThreshold.current && timeSinceLastPeak > 500) {
      lastPeakTime.current = currentTime;
      setDetectedReps(prev => {
        const newCount = prev + 1;
        if (newCount >= targetReps) {
          setTimeout(() => {
            onDetection(newCount);
          }, 500);
        }
        
        return newCount;
      });

      triggerRepDetectedAnimation();
    }
  };

  const startPulseAnimation = (): void => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isDetecting) {
          pulse();
        }
      });
    };
    pulse();
  };

  const triggerRepDetectedAnimation = (): void => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleManualComplete = (): void => {
    onDetection(detectedReps > 0 ? detectedReps : targetReps);
  };

  const adjustSensitivity = (delta: number): void => {
    detectionThreshold.current = Math.max(0.5, Math.min(3.0, detectionThreshold.current + delta));
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Motion Rep Counter</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          {/* Status Display */}
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
                <Animated.View 
                  style={[
                    styles.repCounter,
                    { transform: [{ scale: pulseAnim }] }
                  ]}
                >
                  <Text style={styles.repCountText}>{detectedReps}</Text>
                  <Text style={styles.repTargetText}>/ {targetReps} reps</Text>
                </Animated.View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <Animated.View 
                      style={[
                        styles.progressFill,
                        {
                          width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          }),
                        },
                      ]} 
                    />
                  </View>
                </View>

                {isDetecting && (
                  <Text style={styles.instructionText}>
                    Perform your exercise - movement will be detected automatically
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            {!isDetecting && !isCalibrating && (
              <Pressable 
                style={styles.startButton}
                onPress={startCalibration}
              >
                <Ionicons name="play" size={24} color="white" />
                <Text style={styles.startButtonText}>Start Detection</Text>
              </Pressable>
            )}

            {isDetecting && (
              <>
                <View style={styles.sensitivityControls}>
                  <Text style={styles.sensitivityLabel}>Sensitivity</Text>
                  <View style={styles.sensitivityButtons}>
                    <Pressable 
                      style={styles.sensitivityButton}
                      onPress={() => adjustSensitivity(-0.2)}
                    >
                      <Text style={styles.sensitivityButtonText}>Less</Text>
                    </Pressable>
                    <Pressable 
                      style={styles.sensitivityButton}
                      onPress={() => adjustSensitivity(0.2)}
                    >
                      <Text style={styles.sensitivityButtonText}>More</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <Pressable 
                    style={styles.completeButton}
                    onPress={handleManualComplete}
                  >
                    <Text style={styles.completeButtonText}>Complete Set</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.stopButton}
                    onPress={stopDetection}
                  >
                    <Text style={styles.stopButtonText}>Stop</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>How it works:</Text>
            <Text style={styles.instructionsText}>
              • Hold your device firmly during exercise{'\n'}
              • Consistent movement patterns work best{'\n'}
              • Adjust sensitivity if reps aren't detected{'\n'}
              • Manual completion available anytime
            </Text>
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
