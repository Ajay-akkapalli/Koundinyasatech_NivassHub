import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SPLASH } from '@constants/dimensions';

/**
 * Entry point of the splash flow.
 * A single brief blank screen before the animation — avoids the double
 * white-flash that occurred when index.tsx → loading.tsx both showed
 * identical empty screens before anything was drawn.
 */
export default function SplashEntryScreen(): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/splash/animation');
    }, SPLASH.SCREEN_1_DURATION);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
