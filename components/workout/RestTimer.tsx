import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { REST_TIMER } from '../../constants/workoutConstants';
import { formatDuration } from "../../formatters";

interface RestTimerProps {
  visible: boolean;
  duration: number; // in seconds
  onComplete: () => void;
  onSkip: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  visible,
  duration,
  onComplete,
  onSkip,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      initializeTimer();
    } else {
      stopTimer();
    }
  }, [visible, duration]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      startCountdownTimer();
    } else {
      clearTimerInterval();
    }

    return clearTimerInterval;
  }, [isRunning, timeRemaining, duration, onComplete]);

  const initializeTimer = (): void => {
    setTimeRemaining(duration);
    setIsRunning(true);
    progressAnimation.setValue(0);
  };

  const stopTimer = (): void => {
    setIsRunning(false);
    clearTimerInterval();
  };

  const startCountdownTimer = (): void => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining(previousTime => {
        const newTime = previousTime - 1;
        
        updateProgressAnimation(newTime);
        handleTimeThresholds(newTime);

        if (newTime <= 0) {
          setIsRunning(false);
          onComplete();
          return 0;
        }

        return newTime;
      });
    }, 1000);
  };

  const clearTimerInterval = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const updateProgressAnimation = (remainingTime: number): void => {
    const progress = 1 - (remainingTime / duration);
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const handleTimeThresholds = (remainingTime: number): void => {
    if (remainingTime <= REST_TIMER.CRITICAL_THRESHOLD_SECONDS && remainingTime > 0) {
      triggerPulseAnimation();
    }
  };

  const triggerPulseAnimation = (): void => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 1.1,
        duration: REST_TIMER.PULSE_ANIMATION_DURATION_MS,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: REST_TIMER.PULSE_ANIMATION_DURATION_MS,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePauseResume = (): void => {
    setIsRunning(!isRunning);
  };

  const handleAddTime = (additionalSeconds: number): void => {
    setTimeRemaining(currentTime => currentTime + additionalSeconds);
  };

  const getTimerDisplayColor = (): string => {
    if (timeRemaining <= REST_TIMER.CRITICAL_THRESHOLD_SECONDS) return theme.colors.error;
    if (timeRemaining <= REST_TIMER.WARNING_THRESHOLD_SECONDS) return theme.colors.warning;
    return theme.colors.primary;
  };

  const getStatusMessage = (): string => {
    if (timeRemaining <= 0) return 'Rest complete! Ready for next set';
    if (!isRunning) return 'Timer paused';
    if (timeRemaining <= REST_TIMER.CRITICAL_THRESHOLD_SECONDS) return 'Almost done!';
    return 'Rest time';
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <RestTimerHeader onClose={onSkip} />

          <RestTimerDisplay
            timeRemaining={timeRemaining}
            scaleAnimation={scaleAnimation}
            progressAnimation={progressAnimation}
            timerColor={getTimerDisplayColor()}
            statusMessage={getStatusMessage()}
          />

          <QuickTimeControls onAddTime={handleAddTime} />

          <RestTimerControls
            isRunning={isRunning}
            onPauseResume={handlePauseResume}
            onSkip={onSkip}
          />
        </View>
      </View>
    </Modal>
  );
};

// Sub-components for better organization
interface RestTimerHeaderProps {
  onClose: () => void;
}

const RestTimerHeader: React.FC<RestTimerHeaderProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const styles = createHeaderStyles(theme);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Rest Timer</Text>
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={24} color={theme.colors.text} />
      </Pressable>
    </View>
  );
};

interface RestTimerDisplayProps {
  timeRemaining: number;
  scaleAnimation: Animated.Value;
  progressAnimation: Animated.Value;
  timerColor: string;
  statusMessage: string;
}

const RestTimerDisplay: React.FC<RestTimerDisplayProps> = ({
  timeRemaining,
  scaleAnimation,
  progressAnimation,
  timerColor,
  statusMessage
}) => {
  const { theme } = useTheme();
  const styles = createDisplayStyles(theme);

  return (
    <View style={styles.timerContainer}>
      <View style={styles.progressRing}>
        <Animated.View 
          style={[
            styles.progressFill,
            {
              width: progressAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]} 
        />
      </View>
      
      <Animated.View 
        style={[
          styles.timerDisplay,
          { transform: [{ scale: scaleAnimation }] }
        ]}
      >
        <Text style={[styles.timerText, { color: timerColor }]}>
          {formatDuration(timeRemaining)}
        </Text>
        <Text style={styles.timerSubtext}>
          {statusMessage}
        </Text>
      </Animated.View>
    </View>
  );
};

interface QuickTimeControlsProps {
  onAddTime: (seconds: number) => void;
}

const QuickTimeControls: React.FC<QuickTimeControlsProps> = ({ onAddTime }) => {
  const { theme } = useTheme();
  const styles = createQuickControlsStyles(theme);

  return (
    <View style={styles.quickActions}>
      {REST_TIMER.QUICK_ADD_OPTIONS_SECONDS.map((seconds) => (
        <Pressable 
          key={seconds}
          style={styles.quickButton}
          onPress={() => onAddTime(seconds)}
        >
          <Text style={styles.quickButtonText}>+{seconds}s</Text>
        </Pressable>
      ))}
    </View>
  );
};

interface RestTimerControlsProps {
  isRunning: boolean;
  onPauseResume: () => void;
  onSkip: () => void;
}

const RestTimerControls: React.FC<RestTimerControlsProps> = ({
  isRunning,
  onPauseResume,
  onSkip
}) => {
  const { theme } = useTheme();
  const styles = createControlsStyles(theme);

  return (
    <View style={styles.controls}>
      <Pressable 
        style={[styles.controlButton, styles.pauseButton]}
        onPress={onPauseResume}
      >
        <Ionicons 
          name={isRunning ? "pause" : "play"} 
          size={24} 
          color="white" 
        />
        <Text style={styles.controlButtonText}>
          {isRunning ? 'Pause' : 'Resume'}
        </Text>
      </Pressable>

      <Pressable 
        style={[styles.controlButton, styles.skipButton]}
        onPress={onSkip}
      >
        <Ionicons name="play-forward" size={24} color="white" />
        <Text style={styles.controlButtonText}>Skip Rest</Text>
      </Pressable>
    </View>
  );
};

// Styles
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
    marginHorizontal: theme.spacing.lg,
    width: '85%',
    maxWidth: 350,
    ...theme.shadows.large,
  },
});

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

const createDisplayStyles = (theme: any) => StyleSheet.create({
  timerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  progressRing: {
    width: 200,
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  timerDisplay: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.sm,
  },
  timerSubtext: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

const createQuickControlsStyles = (theme: any) => StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.xl,
  },
  quickButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

const createControlsStyles = (theme: any) => StyleSheet.create({
  controls: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  pauseButton: {
    backgroundColor: theme.colors.secondary,
  },
  skipButton: {
    backgroundColor: theme.colors.primary,
  },
  controlButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
  },
});