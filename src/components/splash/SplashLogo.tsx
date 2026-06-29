import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import type { SplashLogoProps } from '@/types/splash';
import colors from '@theme/colors';
import { SPLASH } from '@constants/dimensions';

const SplashLogo: React.FC<SplashLogoProps> = ({
  variant = 'icon',
  size,
  style,
  imageStyle,
}) => {
  if (variant === 'icon') {
    const circleSize = size ?? SPLASH.LOGO_CIRCLE_SIZE;
    const iconSize = circleSize * 0.69;

    return (
      <View
        style={[
          styles.circle,
          { width: circleSize, height: circleSize, borderRadius: circleSize / 2 },
          style,
        ]}
      >
        <Image
          source={require('../../../assets/images/image.png')}
          style={[{ width: iconSize, height: iconSize }, imageStyle]}
          resizeMode="contain"
        />
      </View>
    );
  }

  const logoSize = size ?? SPLASH.LOGO_FULL_SIZE;

  return (
    <Image
      source={require('../../../assets/images/LOGO no BG.png')}
      style={[{ width: logoSize, height: logoSize }, imageStyle]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: SPLASH.LOGO_CIRCLE_BORDER_WIDTH,
    borderColor: colors.splashAccent,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
});

export default SplashLogo;
