import React, { useCallback, useState } from 'react';
import {
  Alert,
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
  AdvertisementCard,
  ApprovalQueueBottomSheet,
  ApprovalQueueTrigger,
  BannerCarousel,
  CommunityPostCard,
  HomeHeader,
  HomeSkeleton,
  MaintenanceNoticeCard,
  QRCodeBanner,
  QuickActionsGrid,
  SectionHeader,
  SOSBanner,
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

  const [queueSheetVisible, setQueueSheetVisible] = useState(false);

  const openQueueSheet = useCallback(() => setQueueSheetVisible(true), []);
  const closeQueueSheet = useCallback(() => setQueueSheetVisible(false), []);

  const handleNewPost = useCallback(() => {
    Alert.alert('New Post', 'Community post creation coming soon.');
  }, []);

  const handleQREntry = useCallback(() => {
    Alert.alert('QR Entry', 'Your QR code will be shown here for contactless entry.');
  }, []);

  const handleSOS = useCallback(() => {
    Alert.alert(
      'SOS Emergency',
      'This will immediately alert the security guard. Confirm?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Alert Guard', style: 'destructive', onPress: handleCallGuard },
      ],
    );
  }, [handleCallGuard]);

  return (
    <ScreenWrapper>
      <HomeHeader user={data?.user ?? null} />

      {/* Initial loading skeleton */}
      {loading && !data && <HomeSkeleton />}

      {/* Full-page error when no data available */}
      {!loading && error && !data && (
        <ErrorState message={error} onRetry={refresh} />
      )}

      {/* Main content */}
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

          {/* Approval queue trigger — opens bottom sheet on press */}
          <ApprovalQueueTrigger
            count={data.approvalQueueCount}
            items={data.approvalQueue}
            onPress={openQueueSheet}
          />

          {/* QR Code Entry Banner */}
          <QRCodeBanner onPress={handleQREntry} />

          {/* First advertisement */}
          {data.advertisements && data.advertisements[0] && (
            <AdvertisementCard ad={data.advertisements[0]} />
          )}

          {/* Community Posts */}
          {data.communityPosts && data.communityPosts.length > 0 && (
            <>
              <SectionHeader
                title="Community Posts"
                actionLabel="New Post"
                actionIcon="create-outline"
                onAction={handleNewPost}
              />
              {data.communityPosts.map((post, index) => (
                <React.Fragment key={post.postId}>
                  <CommunityPostCard post={post} />
                  {/* Inject second ad after every 2nd post */}
                  {index === 1 && data.advertisements && data.advertisements[1] && (
                    <AdvertisementCard ad={data.advertisements[1]} />
                  )}
                </React.Fragment>
              ))}
            </>
          )}

          {/* SOS Emergency Banner */}
          <SOSBanner onPress={handleSOS} />

          {/* Non-blocking stale error banner */}
          {error && (
            <View style={styles.staleErrorBanner}>
              <Ionicons name="warning-outline" size={14} color={colors.warning} />
              <Text style={styles.staleErrorText}>{error}</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Approval Queue Bottom Sheet (rendered outside ScrollView so it overlays everything) */}
      {data && (
        <ApprovalQueueBottomSheet
          visible={queueSheetVisible}
          items={data.approvalQueue}
          count={data.approvalQueueCount}
          processingIds={processingVisitors}
          onApprove={handleApprove}
          onReject={handleReject}
          onCallGuard={handleCallGuard}
          onClose={closeQueueSheet}
        />
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
