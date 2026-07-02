import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@theme/colors';
import spacing from '@theme/spacing';

interface SOSBannerProps {
  onPress?: () => void;
}

export const SOSBanner = React.memo<SOSBannerProps>(({ onPress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.18,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel="SOS Emergency"
      accessibilityRole="button"
    >
      {/* Pulsing icon */}
      <View style={styles.iconContainer}>
        <Animated.View
          style={[styles.iconPulse, { transform: [{ scale: pulseAnim }] }]}
        />
        <View style={styles.iconInner}>
          <Ionicons name="alert-circle" size={26} color={colors.white} />
        </View>
      </View>

      {/* Text */}
      <View style={styles.content}>
        <Text style={styles.title}>SOS Emergency</Text>
        <Text style={styles.subtitle}>Tap to instantly alert security guard</Text>
      </View>

      {/* Arrow */}
      <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />

      {/* Decorative bg circle */}
      <View style={styles.decorCircle} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.danger,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconPulse: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  iconInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.1,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  decorCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)',
    right: -25,
    bottom: -30,
  },
});
