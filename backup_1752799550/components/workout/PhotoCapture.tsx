import React, { useState, useRef } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import * as MediaLibrary from 'expo-media-library';

interface PhotoCaptureProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (photoUri: string) => void;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  visible,
  onClose,
  onCapture,
}) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.permissionContainer}>
          <Ionicons name="camera" size={64} color={theme.colors.textTertiary} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to take exercise form photos and track your progress.
          </Text>
          <View style={styles.permissionButtons}>
            <Pressable style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  const handleCapture = async (): Promise<void> => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        onCapture(photo.uri);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleCameraFacing = (): void => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={styles.container}>
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={facing}
        >
          {/* Header Controls */}
          <View style={styles.header}>
            <Pressable style={styles.headerButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </Pressable>
            <Text style={styles.headerTitle}>Capture Exercise Form</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.controls}>
            <View style={styles.controlsContainer}>
              {/* Flip Camera Button */}
              <Pressable 
                style={styles.controlButton}
                onPress={toggleCameraFacing}
              >
                <Ionicons name="camera-reverse" size={32} color="white" />
              </Pressable>

              <Pressable 
                style={[styles.captureButton, isCapturing && styles.capturingButton]}
                onPress={handleCapture}
                disabled={isCapturing}
              >
                <View style={styles.captureButtonInner} />
              </Pressable>

              <Pressable 
                style={styles.controlButton}
                onPress={() => {
                  // Could implement gallery selection here
                  Alert.alert('Gallery', 'Gallery selection not implemented yet');
                }}
              >
                <Ionicons name="images" size={32} color="white" />
              </Pressable>
            </View>
          </View>

          <View style={styles.instructions}>
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Position yourself in the frame and capture your exercise form
              </Text>
              <Text style={styles.instructionSubtext}>
                This will help track your progress and form improvements
              </Text>
            </View>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  permissionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  permissionButtons: {
    width: '100%',
    gap: theme.spacing.md,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  headerSpacer: {
    width: 44,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  capturingButton: {
    backgroundColor: theme.colors.primary,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  instructions: {
    position: 'absolute',
    bottom: 160,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
  },
  instructionText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  instructionSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: theme.typography.fontSizes.sm,
    textAlign: 'center',
  },
});
