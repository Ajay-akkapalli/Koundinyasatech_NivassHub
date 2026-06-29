import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import SplashBackground from '@components/splash/SplashBackground';
import SplashLogo from '@components/splash/SplashLogo';
import colors from '@theme/colors';
import { SPLASH } from '@constants/dimensions';

export default function SplashAnimationScreen(): React.JSX.Element {
  const router = useRouter();

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const lineHeight = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, {
      duration: SPLASH.LOGO_FADE_DURATION,
      easing: Easing.out(Easing.ease),
    });

    logoScale.value = withSpring(1, { damping: 12, stiffness: 80 });

    lineHeight.value = withDelay(
      SPLASH.LINE_DELAY,
      withTiming(SPLASH.LINE_MAX_HEIGHT, {
        duration: SPLASH.LINE_GROW_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );

    const timer = setTimeout(() => {
      router.replace('/splash/welcome');
    }, SPLASH.NAVIGATION_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const lineAnimatedStyle = useAnimatedStyle(() => ({
    height: lineHeight.value,
  }));

  return (
    <SplashBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View style={logoAnimatedStyle}>
            <SplashLogo variant="icon" size={SPLASH.LOGO_CIRCLE_SIZE} />
          </Animated.View>

          <View style={styles.lineContainer}>
            <Animated.View style={[styles.line, lineAnimatedStyle]} />
          </View>
        </View>
      </SafeAreaView>
    </SplashBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineContainer: {
    height: SPLASH.LINE_MAX_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  line: {
    width: SPLASH.LINE_WIDTH,
    backgroundColor: colors.white,
    borderRadius: SPLASH.LINE_WIDTH / 2,
  },
});
