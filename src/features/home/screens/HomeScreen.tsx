import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@components/layout';
import colors from '@theme/colors';
import spacing from '@theme/spacing';
import { useHome } from '../hooks/useHome';
import {
  ApprovalQueue,
  BannerCarousel,
  HomeHeader,
  HomeSkeleton,
  MaintenanceNoticeCard,
  QuickActionsGrid,
} from '../components';

// ─── Error State ─────────────────────────────────────────────────────────────

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => (
  <View style={styles.errorContainer}>
    <Ionicons name="cloud-offline-outline" size={64} color={colors.textLight} />
    <Text style={styles.errorTitle}>Couldn't load data</Text>
    <Text style={styles.errorMessage}>{message}</Text>
    <TouchableOpacity
      style={styles.retryBtn}
      onPress={onRetry}
      activeOpacity={0.8}
      accessibilityLabel="Retry"
      accessibilityRole="button"
    >
      <Ionicons name="refresh-outline" size={16} color={colors.white} style={styles.retryIcon} />
      <Text style={styles.retryText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

// ─── Home Screen ─────────────────────────────────────────────────────────────

export const HomeScreen: React.FC = () => {
  const {
    data,
    loading,
    refreshing,
    error,
    processingVisitors,
    refresh,
    handleApprove,
    handleReject,
    handleCallGuard,
  } = useHome();

  return (
    <ScreenWrapper>
      <HomeHeader user={data?.user ?? null} />

      {/* Initial loading — show skeleton */}
      {loading && !data && <HomeSkeleton />}

      {/* Error with no data to show */}
      {!loading && error && !data && (
        <ErrorState message={error} onRetry={refresh} />
      )}

      {/* Content */}
      {data && (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <BannerCarousel banners={[data.banner]} />

          <QuickActionsGrid actions={data.quickActions} />

          <MaintenanceNoticeCard message={data.maintenanceMessage} />

          <ApprovalQueue
            items={data.approvalQueue}
            count={data.approvalQueueCount}
            processingIds={processingVisitors}
            onApprove={handleApprove}
            onReject={handleReject}
            onCallGuard={handleCallGuard}
          />

          {/* Non-blocking error banner (data is stale but visible) */}
          {error && (
            <View style={styles.staleErrorBanner}>
              <Ionicons name="warning-outline" size={14} color={colors.warning} />
              <Text style={styles.staleErrorText}>{error}</Text>
            </View>
          )}
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.md,
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 24,
  },
  retryIcon: { marginRight: 6 },
  retryText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  staleErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '18',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    marginBottom: spacing.sm,
    gap: 6,
  },
  staleErrorText: { fontSize: 12, color: colors.textSecondary, flex: 1 },
});
