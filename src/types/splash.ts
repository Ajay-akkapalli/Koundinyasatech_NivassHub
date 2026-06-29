import type { StyleProp, ViewStyle, ImageStyle } from 'react-native';

export type SplashLogoVariant = 'icon' | 'full';

export interface SplashLogoProps {
  variant?: SplashLogoVariant;
  size?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export interface SplashBackgroundProps {
  children: React.ReactNode;
  gradientColors?: [string, string, ...string[]];
}
