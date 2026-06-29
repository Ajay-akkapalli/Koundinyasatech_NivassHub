import { Stack } from 'expo-router';

export default function SplashLayout(): React.JSX.Element {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="loading" />
      <Stack.Screen name="animation" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
}
