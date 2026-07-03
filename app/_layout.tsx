import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '../src/providers/StoreProvider';
import { GestureProvider } from '../src/providers/GestureProvider';

export default function RootLayout() {
  return (
    <GestureProvider>
      <SafeAreaProvider>
        <StoreProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="splash" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="society" />
            <Stack.Screen
              name="search"
              options={{
                animation: 'fade_from_bottom',
                gestureEnabled: true,
                gestureDirection: 'vertical',
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureProvider>
  );
}
