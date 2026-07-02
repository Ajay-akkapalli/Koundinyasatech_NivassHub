import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardCard } from '../components/DashboardCard';
import { ScreenWrapper } from '@/components/layout';
import { useAppSelector } from '@/store/hooks';
import { formatCurrency } from '@/utils/formatters';
import colors from '@/theme/colors';
import spacing from '@/theme/spacing';

const NAV_MODULES = [
  { label: 'Residents',   icon: 'people',          route: '/(tabs)/residents',   color: '#3949AB' },
  { label: 'Visitors',    icon: 'person-add',      route: '/(tabs)/visitors',    color: '#00897B' },
  { label: 'Maintenance', icon: 'build',           route: '/(tabs)/maintenance', color: '#E65100' },
  { label: 'Amenities',   icon: 'home',            route: '/(tabs)/amenities',   color: '#6A1B9A' },
  { label: 'Notices',     icon: 'notifications',   route: '/(tabs)/notices',     color: '#C62828' },
  { label: 'Societies',   icon: 'business',        route: '/(tabs)/society',     color: '#FF9800' },
  { label: 'Profile',     icon: 'person-circle',   route: '/(tabs)/profile',     color: '#00695C' },
  { label: 'Settings',    icon: 'settings',        route: '/(tabs)/settings',    color: '#4527A0' },
] as const;

export const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const { stats, recentActivities, refresh } = useDashboard();
  const unreadCount = useAppSelector((state) => state.notices.unreadCount);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const goToNotices = useCallback(() => router.push('/(tabs)/notices'), [router]);
  const goToResidents = useCallback(() => router.push('/(tabs)/residents'), [router]);
  const goToVisitors = useCallback(() => router.push('/(tabs)/visitors'), [router]);
  const goToMaintenance = useCallback(() => router.push('/(tabs)/maintenance'), [router]);

  return (
    <ScreenWrapper>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>NivassHub</Text>
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={goToNotices}
          accessibilityLabel="Notifications"
          accessibilityRole="button"
        >
          <Ionicons name="notifications-outline" size={24} color={colors.white} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Overview</Text>
        <DashboardCard
          title="Total Residents"
          value={stats.totalResidents}
          icon="people"
          color={colors.primary}
          onPress={goToResidents}
        />
        <DashboardCard
          title="Total Flats"
          value={stats.totalFlats}
          icon="business"
          color="#00897B"
          onPress={goToResidents}
        />
        <DashboardCard
          title="Active Visitors"
          value={stats.activeVisitors}
          icon="person-add"
          color="#E65100"
          onPress={goToVisitors}
        />
        <DashboardCard
          title="Monthly Collection"
          value={formatCurrency(stats.monthlyMaintenanceCollection)}
          icon="cash"
          color="#6A1B9A"
        />
        <DashboardCard
          title="Pending Complaints"
          value={stats.pendingComplaints}
          icon="warning"
          color="#C62828"
          onPress={goToMaintenance}
        />

        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.grid}>
          {NAV_MODULES.map((mod) => (
            <NavModule key={mod.label} {...mod} router={router} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivities.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name={activity.icon as any} size={18} color={colors.primary} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityMessage}>{activity.message}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

/**
 * Isolated grid item — memo prevents 8 items from re-rendering
 * when the parent re-renders due to unrelated state changes.
 */
interface NavModuleProps {
  label: string;
  icon: string;
  route: string;
  color: string;
  router: ReturnType<typeof useRouter>;
}

const NavModule = React.memo<NavModuleProps>(({ label, icon, route, color, router }) => (
  <TouchableOpacity
    style={styles.gridItem}
    onPress={() => router.push(route as any)}
    activeOpacity={0.85}
    accessibilityLabel={label}
    accessibilityRole="button"
  >
    <View style={[styles.gridIcon, { backgroundColor: color + '18' }]}>
      <Ionicons name={icon as any} size={28} color={color} />
    </View>
    <Text style={styles.gridLabel}>{label}</Text>
  </TouchableOpacity>
));

NavModule.displayName = 'NavModule';

export default DashboardScreen;

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  welcomeText: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  appName: { color: colors.white, fontSize: 24, fontWeight: '800', letterSpacing: 0.5 },
  notifBtn: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.secondary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  scroll: { padding: spacing.md, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6, marginBottom: 8 },
  gridItem: { width: '25%', alignItems: 'center', paddingHorizontal: 6, marginBottom: 16 },
  gridIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '500', textAlign: 'center' },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activityContent: { flex: 1 },
  activityMessage: { fontSize: 13, color: colors.textPrimary, lineHeight: 19 },
  activityTime: { fontSize: 11, color: colors.textLight, marginTop: 3 },
});
