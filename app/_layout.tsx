import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    lockScreenOrientation();
  }, []);

  const lockScreenOrientation = async (): Promise<void> => {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    } catch (error) {
      console.warn('Failed to lock screen orientation:', error);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
          name="partner-select" 
          options={{
            title: "Select Partner",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="day-select" 
          options={{
            title: "Select Days",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="summary" 
          options={{
            title: "Summary",
            headerBackTitle: "Back"
          }} 
        />
      </Stack>
    </>
  );
}