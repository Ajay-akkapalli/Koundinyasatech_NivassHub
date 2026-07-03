import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@theme/colors';
import spacing from '@theme/spacing';
import type { AdvertisementItem } from '../types';

interface AdvertisementCardProps {
  ad: AdvertisementItem;
  onDismiss?: (adId: string) => void;
}

export const AdvertisementCard = React.memo<AdvertisementCardProps>(
  ({ ad, onDismiss }) => (
    <View style={styles.card}>
      {/* Ad header */}
      <View style={styles.header}>
        {/* Brand logo placeholder */}
        <View style={styles.brandLogo}>
          {ad.brandLogo ? (
            <Image
              source={{ uri: ad.brandLogo }}
              style={styles.brandLogoImg}
              resizeMode="contain"
            />
          ) : (
            <Ionicons name="business-outline" size={16} color={colors.primary} />
          )}
        </View>

        <View style={styles.brandInfo}>
          <View style={styles.adLabelRow}>
            <View style={styles.adPill}>
              <Text style={styles.adPillText}>Ad</Text>
            </View>
            <Text style={styles.brandName} numberOfLines={1}>
              {ad.brandName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onDismiss?.(ad.adId)}
          style={styles.dismissBtn}
          activeOpacity={0.7}
          accessibilityLabel="Dismiss ad"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="help-circle-outline"
            size={20}
            color={colors.textLight}
          />
        </TouchableOpacity>
      </View>

      {/* Ad title */}
      <Text style={styles.title} numberOfLines={2}>
        {ad.title}
      </Text>

      {/* Optional description */}
      {!!ad.description && (
        <Text style={styles.description} numberOfLines={2}>
          {ad.description}
        </Text>
      )}

      {/* Optional image */}
      {!!ad.image && (
        <Image
          source={{ uri: ad.image }}
          style={styles.adImage}
          resizeMode="cover"
        />
      )}
    </View>
  ),
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: 10,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  brandLogo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  brandLogoImg: {
    width: 32,
    height: 32,
  },
  brandInfo: {
    flex: 1,
  },
  adLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  adPill: {
    backgroundColor: colors.info + '20',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  adPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.info,
  },
  brandName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dismissBtn: {
    padding: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  adImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: colors.background,
  },
});
