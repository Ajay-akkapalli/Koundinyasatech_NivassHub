import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@theme/colors';
import spacing from '@theme/spacing';

interface QRCodeBannerProps {
  onPress?: () => void;
}

export const QRCodeBanner = React.memo<QRCodeBannerProps>(({ onPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={onPress}
    activeOpacity={0.85}
    accessibilityLabel="My QR Entry"
    accessibilityRole="button"
  >
    {/* Left icon */}
    <View style={styles.iconWrap}>
      <Ionicons name="qr-code-outline" size={32} color={colors.white} />
    </View>

    {/* Text content */}
    <View style={styles.content}>
      <Text style={styles.title}>My QR Entry</Text>
      <Text style={styles.subtitle}>Show QR code for contactless entry</Text>
    </View>

    {/* Chevron */}
    <View style={styles.chevronWrap}>
      <Ionicons name="chevron-forward" size={20} color={colors.white} />
    </View>

    {/* Decorative circles */}
    <View style={styles.decorCircleLg} />
    <View style={styles.decorCircleSm} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
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
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  chevronWrap: {
    opacity: 0.8,
  },
  decorCircleLg: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.06)',
    right: -20,
    bottom: -25,
  },
  decorCircleSm: {
    position: 'absolute',
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.06)',
    right: 40,
    bottom: 10,
  },
});
