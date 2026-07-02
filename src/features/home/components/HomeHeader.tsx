import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getInitials } from '@utils/formatters';
import colors from '@theme/colors';
import spacing from '@theme/spacing';
import type { HomeUser } from '../types';

interface HomeHeaderProps {
  user?: HomeUser | null;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ user }) => {
  const router = useRouter();
  const initials = user ? getInitials(user.name) : '?';

  return (
    <View style={styles.container}>
      {/* Left: greeting + flat selector */}
      <View style={styles.left}>
        <Text style={styles.greeting}>
          Hello {user?.name ?? 'User'} 👋
        </Text>
        <TouchableOpacity style={styles.flatRow} activeOpacity={0.7}>
          <Text style={styles.flatText}>{user?.flatNumber ?? '—'}</Text>
          <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.85)" style={styles.chevron} />
        </TouchableOpacity>
      </View>

      {/* Right: icons + avatar */}
      <View style={styles.right}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push('/search' as any)}
          accessibilityLabel="Search"
          accessibilityRole="button"
        >
          <Ionicons name="search-outline" size={22} color={colors.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push('/(tabs)/notices' as any)}
          accessibilityLabel="Notifications"
          accessibilityRole="button"
        >
          <Ionicons name="notifications-outline" size={22} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  left: { flex: 1 },
  greeting: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  flatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  flatText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '500',
  },
  chevron: { marginLeft: 4 },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: { padding: 6 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  avatarText: { color: colors.white, fontSize: 13, fontWeight: '700' },
});
