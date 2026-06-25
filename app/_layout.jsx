import React from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from '../src/store';

/////////////////  Routs  //////////////////
//////////////// Routs ////////////////
/////////////// routs ////////////////

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="splash" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="profile/index" />
            <Stack.Screen name="society" />
          </Stack>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
