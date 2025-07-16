import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

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

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setTimeRemaining(duration);
      setIsRunning(true);
      progressAnim.setValue(0);
    } else {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [visible, duration]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Update progress animation
          const progress = 1 - (newTime / duration);
          Animated.timing(progressAnim, {
            toValue: progress,
            duration: 100,
            useNativeDriver: false,
          }).start();

          // Pulse animation for last 10 seconds
          if (newTime <= 10 && newTime > 0) {
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start();
          }

          if (newTime <= 0) {
            setIsRunning(false);
            onComplete();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, duration, onComplete]);

  const handlePauseResume = (): void => {
    setIsRunning(!isRunning);
  };

  const handleAddTime = (seconds: number): void => {
    setTimeRemaining(prev => prev + seconds);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (timeRemaining <= 10) return theme.colors.error;
    if (timeRemaining <= 30) return theme.colors.warning;
    return theme.colors.primary;
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Rest Timer</Text>
            <Pressable onPress={onSkip} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={styles.timerContainer}>
            <View style={styles.progressRing}>
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
            
            <Animated.View 
              style={[
                styles.timerDisplay,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <Text style={[styles.timerText, { color: getTimerColor() }]}>
                {formatTime(timeRemaining)}
              </Text>
              <Text style={styles.timerSubtext}>
                {timeRemaining <= 10 ? 'Almost done!' : 'Rest time'}
              </Text>
            </Animated.View>
          </View>

          <View style={styles.quickActions}>
            <Pressable 
              style={styles.quickButton}
              onPress={() => handleAddTime(15)}
            >
              <Text style={styles.quickButtonText}>+15s</Text>
            </Pressable>
            <Pressable 
              style={styles.quickButton}
              onPress={() => handleAddTime(30)}
            >
              <Text style={styles.quickButtonText}>+30s</Text>
            </Pressable>
            <Pressable 
              style={styles.quickButton}
              onPress={() => handleAddTime(60)}
            >
              <Text style={styles.quickButtonText}>+1m</Text>
            </Pressable>
          </View>

          <View style={styles.controls}>
            <Pressable 
              style={[styles.controlButton, styles.pauseButton]}
              onPress={handlePauseResume}
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

          <View style={styles.statusContainer}>
            {timeRemaining <= 0 && (
              <Text style={styles.statusText}>Rest complete! Ready for next set</Text>
            )}
            {timeRemaining > 0 && !isRunning && (
              <Text style={styles.statusText}>Timer paused</Text>
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
  timerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    position: 'relative',
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
  controls: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
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
  statusContainer: {
    alignItems: 'center',
    minHeight: 24,
  },
  statusText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
