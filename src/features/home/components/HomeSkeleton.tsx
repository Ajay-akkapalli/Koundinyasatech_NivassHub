import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import colors from '@theme/colors';
import spacing from '@theme/spacing';

const SkeletonBox: React.FC<{ width?: number | string; height: number; borderRadius?: number; style?: object }> = ({
  width = '100%',
  height,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.border, opacity },
        style,
      ]}
    />
  );
};

export const HomeSkeleton: React.FC = () => (
  <View style={styles.container}>
    {/* Header skeleton */}
    <View style={styles.header}>
      <View>
        <SkeletonBox width={140} height={14} borderRadius={6} />
        <SkeletonBox width={100} height={20} borderRadius={6} style={styles.mt8} />
      </View>
      <SkeletonBox width={40} height={40} borderRadius={20} />
    </View>

    <View style={styles.body}>
      {/* Banner skeleton */}
      <SkeletonBox height={160} borderRadius={12} />

      {/* Quick Actions skeleton */}
      <SkeletonBox width={120} height={16} borderRadius={6} style={styles.sectionGap} />
      <View style={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={styles.gridItem}>
            <SkeletonBox width={58} height={58} borderRadius={16} />
            <SkeletonBox width={48} height={10} borderRadius={4} style={styles.mt8} />
          </View>
        ))}
      </View>

      {/* Notice skeleton */}
      <SkeletonBox height={48} borderRadius={10} style={styles.sectionGap} />

      {/* Approval queue skeleton */}
      <SkeletonBox width={120} height={16} borderRadius={6} style={styles.sectionGap} />
      {[0, 1].map((i) => (
        <View key={i} style={[styles.card, styles.mt8]}>
          <SkeletonBox width={48} height={48} borderRadius={24} />
          <View style={styles.cardBody}>
            <SkeletonBox width={140} height={14} borderRadius={4} />
            <SkeletonBox width={80} height={12} borderRadius={4} style={styles.mt8} />
          </View>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  body: { padding: spacing.md },
  sectionGap: { marginTop: spacing.lg },
  mt8: { marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6, marginTop: spacing.sm },
  gridItem: { width: '25%', alignItems: 'center', paddingHorizontal: 6, marginBottom: 16 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  cardBody: { flex: 1, marginLeft: 12 },
});
