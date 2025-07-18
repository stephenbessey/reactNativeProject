import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import { Alert } from 'react-native';

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access in your device settings to capture exercise photos.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => {/* Could open app settings */} },
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('Error requesting camera permission:', error);
    return false;
  }
};

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Media Library Permission Required',
        'Please enable photo library access to save your exercise photos.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => {/* Could open app settings */} },
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('Error requesting media library permission:', error);
    return false;
  }
};
