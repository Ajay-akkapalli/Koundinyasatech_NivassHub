import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { APP_CONFIG } from '@config/appConfig';

export const SplashScreen: React.FC = () => {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const lineHeight = useRef(new Animated.Value(0)).current;
  const dotFade = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(lineHeight, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(dotFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, APP_CONFIG.splashDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.topGlow} />
      <View style={styles.middleGlow} />

      <Animated.View
        style={[
          styles.pulseRing,
          {
            transform: [{ scale: pulseAnim }],
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.25],
              outputRange: [0.4, 0],
            }),
          },
        ]}
      />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: floatAnim },
            ],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Image
            source={require('../../../../assets/images/image.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <View style={styles.lineWrapper}>
        <Animated.View
          style={[
            styles.line,
            {
              height: lineHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 130],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.lineDot,
            { opacity: dotFade },
          ]}
        />
      </View>

      <Animated.View
        style={[
          styles.loadingContainer,
          { opacity: dotFade },
        ]}
      >
        <Text style={styles.loadingDot}>•</Text>
        <Text style={styles.loadingDot}>•</Text>
        <Text style={styles.loadingDot}>•</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e6f7',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  topGlow: {
    position: 'absolute',
    top: -280,
    width: 850,
    height: 850,
    borderRadius: 425,
    backgroundColor: '#9891e5',
    opacity: 0.95,
  },
  middleGlow: {
    position: 'absolute',
    top: 120,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: '#b2a1ff',
    opacity: 0.4,
  },
  pulseRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  logoContainer: {
    zIndex: 10,
  },
  logoCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#F3B05B',
    shadowColor: '#E5B391',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 15,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  lineWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  line: {
    width: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  lineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0a0dd9',
    marginTop: 5,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 70,
    flexDirection: 'row',
  },
  loadingDot: {
    fontSize: 35,
    color: '#300eef',
    marginHorizontal: 6,
  },
});
