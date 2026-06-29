import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { SplashBackgroundProps } from '@/types/splash';
import colors from '@theme/colors';

const DEFAULT_COLORS: [string, string] = [
  colors.splashGradientStart,
  colors.splashGradientEnd,
];

const SplashBackground: React.FC<SplashBackgroundProps> = ({
  children,
  gradientColors = DEFAULT_COLORS,
}) => {
  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default SplashBackground;
