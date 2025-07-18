import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { WorkoutProvider } from '../contexts/WorkoutContext';

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
    <ThemeProvider>
      <WorkoutProvider>
        <StatusBar style="auto" />
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
          <Stack.Screen 
            name="workout-detail" 
            options={{
              title: "Workout",
              headerBackTitle: "Back"
            }} 
          />
          <Stack.Screen 
            name="progress" 
            options={{
              title: "Progress",
              headerBackTitle: "Back"
            }} 
          />
          <Stack.Screen 
            name="settings" 
            options={{
              title: "Settings",
              headerBackTitle: "Back"
            }} 
          />
        </Stack>
      </WorkoutProvider>
    </ThemeProvider>
  );
}
