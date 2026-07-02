import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SplashLogo from '@components/splash/SplashLogo';
import colors from '@theme/colors';

export default function WelcomeScreen(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 750, useNativeDriver: true }),
      ]),
      Animated.timing(btnAnim, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = useCallback(() => {
    router.replace('/splash/onboarding' as any);
  }, [router]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.brandBlue]}
      style={styles.container}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
    >
      <StatusBar style="light" />

      {/* Decorative circles */}
      <View style={[styles.circle, { width: 260, height: 260, top: -75, right: -75 }]} />
      <View style={[styles.circle, { width: 320, height: 320, bottom: -110, left: -110 }]} />
      <View style={[styles.circle, { width: 160, height: 160, top: '38%', right: -55, backgroundColor: 'rgba(255,255,255,0.04)' }]} />

      {/* Logo + text */}
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <SplashLogo variant="full" size={200} />

        <View style={styles.textBlock}>
          <Text style={styles.eyebrow}>WELCOME TO</Text>
          <Text style={styles.appName}>NivaasHub</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Modern Society Management</Text>
        </View>

        {/* Feature pills */}
        <View style={styles.pillRow}>
          {['Payments', 'Visitors', 'Community'].map((label) => (
            <View key={label} style={styles.pill}>
              <Text style={styles.pillText}>{label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* CTA button */}
      <Animated.View style={[styles.btnWrap, { opacity: btnAnim, paddingBottom: insets.bottom + 32 }]}>
        <TouchableOpacity style={styles.ctaBtn} onPress={handleContinue} activeOpacity={0.82}>
          <Text style={styles.ctaBtnText}>Get Started  →</Text>
        </TouchableOpacity>
        <Text style={styles.hintText}>Swipe through to explore features</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 999,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  textBlock: {
    alignItems: 'center',
    marginTop: 34,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 3,
    marginBottom: 8,
  },
  appName: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  divider: {
    width: 44,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: colors.splashAccent,
    marginBottom: 14,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.60)',
    letterSpacing: 0.6,
  },
  pillRow: {
    flexDirection: 'row',
    marginTop: 28,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  pillText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '500',
  },
  btnWrap: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  ctaBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ctaBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  hintText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '400',
  },
});
