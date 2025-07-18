import { useState, useEffect, useRef, useCallback } from 'react';
import { Accelerometer } from 'expo-sensors';
import { MOTION_DETECTION } from '../constants/workoutConstants';
import { WorkoutError, WorkoutErrorCode } from '../services/error';

interface AccelerometerReading {
  x: number;
  y: number;
  z: number;
}

interface AccelerometerBaseline {
  x: number;
  y: number;
  z: number;
}

interface UseMotionDetectionOptions {
  targetReps: number;
  onDetection: (reps: number) => void;
  onError: (error: Error) => void;
}

interface UseMotionDetectionReturn {
  isDetecting: boolean;
  detectedReps: number;
  isCalibrating: boolean;
  detectionThreshold: number;
  startCalibration: () => void;
  stopDetection: () => void;
  adjustSensitivity: (delta: number) => void;
  resetDetection: () => void;
}

export const useMotionDetection = ({
  targetReps,
  onDetection,
  onError
}: UseMotionDetectionOptions): UseMotionDetectionReturn => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedReps, setDetectedReps] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const accelerometerData = useRef<AccelerometerReading[]>([]);
  const lastRepDetectionTime = useRef(0);
  const calibrationBaseline = useRef<AccelerometerBaseline>({ x: 0, y: 0, z: 0 });
  const detectionThreshold = useRef(MOTION_DETECTION.DEFAULT_THRESHOLD);

  const resetDetection = useCallback((): void => {
    setDetectedReps(0);
    setIsDetecting(false);
    setIsCalibrating(false);
    accelerometerData.current = [];
    lastRepDetectionTime.current = 0;
  }, []);

  const startAccelerometerMonitoring = useCallback((): void => {
    try {
      Accelerometer.setUpdateInterval(MOTION_DETECTION.UPDATE_INTERVAL_MS);
      Accelerometer.addListener(handleAccelerometerUpdate);
    } catch (error) {
      onError(new WorkoutError(
        'Failed to start accelerometer',
        WorkoutErrorCode.MOTION_DETECTION_FAILED,
        { error }
      ));
    }
  }, []);

  const stopAccelerometerMonitoring = useCallback((): void => {
    Accelerometer.removeAllListeners();
  }, []);

  const handleAccelerometerUpdate = useCallback((reading: AccelerometerReading): void => {
    accelerometerData.current.push(reading);

    // Keep only recent readings to prevent memory issues
    if (accelerometerData.current.length > MOTION_DETECTION.SAMPLE_BUFFER_SIZE) {
      accelerometerData.current = accelerometerData.current.slice(-MOTION_DETECTION.SAMPLE_BUFFER_SIZE);
    }

    if (isDetecting && calibrationBaseline.current) {
      detectRepetition(reading);
    }
  }, [isDetecting]);

  const calculateMovementMagnitude = (
    reading: AccelerometerReading,
    baseline: AccelerometerBaseline
  ): number => {
    const deltaX = Math.abs(reading.x - baseline.x);
    const deltaY = Math.abs(reading.y - baseline.y);
    const deltaZ = Math.abs(reading.z - baseline.z);

    return Math.sqrt(deltaX ** 2 + deltaY ** 2 + deltaZ ** 2);
  };

  const detectRepetition = useCallback((reading: AccelerometerReading): void => {
    const movementMagnitude = calculateMovementMagnitude(reading, calibrationBaseline.current);
    const currentTime = Date.now();
    const timeSinceLastDetection = currentTime - lastRepDetectionTime.current;

    const isSignificantMovement = movementMagnitude > detectionThreshold.current;
    const isAfterMinimumInterval = timeSinceLastDetection > MOTION_DETECTION.MINIMUM_REP_INTERVAL_MS;

    if (isSignificantMovement && isAfterMinimumInterval) {
      lastRepDetectionTime.current = currentTime;
      
      setDetectedReps(previousCount => {
        const newCount = previousCount + 1;
        
        if (newCount >= targetReps) {
          setTimeout(() => {
            onDetection(newCount);
          }, 500);
        }
        
        return newCount;
      });
    }
  }, [targetReps, onDetection]);

  const calibrateBaseline = useCallback((): void => {
    const recentReadings = accelerometerData.current.slice(-MOTION_DETECTION.CALIBRATION_SAMPLE_COUNT);
    
    if (recentReadings.length === 0) {
      onError(new WorkoutError(
        'Insufficient data for calibration',
        WorkoutErrorCode.MOTION_DETECTION_FAILED
      ));
      return;
    }

    const averageReading = recentReadings.reduce(
      (accumulator, reading) => ({
        x: accumulator.x + reading.x,
        y: accumulator.y + reading.y,
        z: accumulator.z + reading.z,
      }),
      { x: 0, y: 0, z: 0 }
    );

    calibrationBaseline.current = {
      x: averageReading.x / recentReadings.length,
      y: averageReading.y / recentReadings.length,
      z: averageReading.z / recentReadings.length,
    };
  }, [onError]);

  const startCalibration = useCallback((): void => {
    setIsCalibrating(true);
    
    // Calibrate after a short delay to allow data collection
    setTimeout(() => {
      calibrateBaseline();
      setIsCalibrating(false);
      setIsDetecting(true);
    }, MOTION_DETECTION.CALIBRATION_COUNTDOWN_SECONDS * 1000);
  }, [calibrateBaseline]);

  const stopDetection = useCallback((): void => {
    setIsDetecting(false);
    stopAccelerometerMonitoring();
  }, [stopAccelerometerMonitoring]);

  const adjustSensitivity = useCallback((delta: number): void => {
    const newThreshold = detectionThreshold.current + delta;
    const clampedThreshold = Math.max(
      MOTION_DETECTION.THRESHOLD_RANGE.MINIMUM,
      Math.min(MOTION_DETECTION.THRESHOLD_RANGE.MAXIMUM, newThreshold)
    );
    detectionThreshold.current = clampedThreshold;
  }, []);

  // Setup accelerometer when calibrating or detecting
  useEffect(() => {
    if (isCalibrating || isDetecting) {
      startAccelerometerMonitoring();
    } else {
      stopAccelerometerMonitoring();
    }

    return stopAccelerometerMonitoring;
  }, [isCalibrating, isDetecting, startAccelerometerMonitoring, stopAccelerometerMonitoring]);

  return {
    isDetecting,
    detectedReps,
    isCalibrating,
    detectionThreshold: detectionThreshold.current,
    startCalibration,
    stopDetection,
    adjustSensitivity,
    resetDetection,
  };
};