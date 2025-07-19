import { useState, useCallback } from 'react';

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
  const [detectionThreshold, setDetectionThreshold] = useState(1.5);

  const resetDetection = useCallback((): void => {
    setDetectedReps(0);
    setIsDetecting(false);
    setIsCalibrating(false);
  }, []);

  const startCalibration = useCallback((): void => {
    setIsCalibrating(true);
    setDetectedReps(0);
    
    // Simple calibration simulation
    setTimeout(() => {
      setIsCalibrating(false);
      setIsDetecting(true);
    }, 3000);
  }, []);

  const stopDetection = useCallback((): void => {
    setIsDetecting(false);
    setIsCalibrating(false);
  }, []);

  const adjustSensitivity = useCallback((delta: number): void => {
    setDetectionThreshold(prev => Math.max(0.5, Math.min(3.0, prev + delta)));
  }, []);

  return {
    isDetecting,
    detectedReps,
    isCalibrating,
    detectionThreshold,
    startCalibration,
    stopDetection,
    adjustSensitivity,
    resetDetection,
  };
};