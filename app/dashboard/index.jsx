import React from 'react';
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
import { useDashboard } from '../../src/hooks/useDashboard';
import { useSelector } from 'react-redux';
import ScreenWrapper from '../../src/components/common/ScreenWrapper';
import DashboardCard from '../../src/components/cards/DashboardCard';
import { formatCurrency } from '../../src/utils/helpers';
import colors from '../../src/theme/colors';
import { HomeIcon } from '../../assets/icons/HomeIcon';

const NAV_MODULES = [
  { label: 'Residents', icon: 'people', route: '/dashboard/residents', color: '#3949AB' },
  { label: 'Visitors', icon: 'person-add', route: '/dashboard/visitors', color: '#00897B' },
  { label: 'Maintenance', icon: 'build', route: '/dashboard/maintenance', color: '#E65100' },
  { label: 'Amenities', icon: 'home', route: '/dashboard/amenities', color: '#6A1B9A' },
  { label: 'Notices', icon: 'notifications', route: '/dashboard/notices', color: '#C62828' },
  { label: 'Societies', icon: 'business', route: '/society', color: '#FF9800' },
  { label: 'Profile', icon: 'person-circle', route: '/profile', color: '#00695C' },
  { label: 'Settings', icon: 'settings', route: '/dashboard/settings', color: '#4527A0' },
];

export default function Dashboard() {
  const router = useRouter();
  const { stats, recentActivities, loading, refresh } = useDashboard();
  const unreadCount = useSelector((state) => state.notices.unreadCount);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    refresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScreenWrapper>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>NivassHub</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/dashboard/notices')}>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Overview</Text>
        <DashboardCard
          title="Total Residents"
          value={stats.totalResidents}
          icon="people"
          color={colors.primary}
          onPress={() => router.push('/dashboard/residents')}
        />
        <DashboardCard
          title="Total Flats"
          value={stats.totalFlats}
          icon="business"
          color="#00897B"
          onPress={() => router.push('/dashboard/residents')}
        />
        <DashboardCard
          title="Active Visitors"
          value={stats.activeVisitors}
          icon="person-add"
          color="#E65100"
          onPress={() => router.push('/dashboard/visitors')}
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
          onPress={() => router.push('/dashboard/maintenance')}
        />

        <Text style={styles.sectionTitle}>Quick Access</Text>
        <HomeIcon width={24} height={24} />
        <View style={styles.grid}>
          {NAV_MODULES.map((mod) => (
            <TouchableOpacity
              key={mod.label}
              style={styles.gridItem}
              onPress={() => router.push(mod.route)}
              activeOpacity={0.85}
            >
              <View style={[styles.gridIcon, { backgroundColor: mod.color + '18' }]}>
                <Ionicons name={mod.icon} size={28} color={mod.color} />
              </View>
              <Text style={styles.gridLabel}>{mod.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivities.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name={activity.icon} size={18} color={colors.primary} />
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
}

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
  },
  appName: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  notifBtn: {
    position: 'relative',
    padding: 4,
  },
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
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 8,
  },
  gridItem: {
    width: '25%',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  gridIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
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
  activityMessage: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
  },
  activityTime: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 3,
  },
});
