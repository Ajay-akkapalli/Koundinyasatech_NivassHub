import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusColor } from '../../utils/helpers';
import colors from '../../theme/colors';

export default function ResidentCard({ resident, onPress }) {
  const statusColor = getStatusColor(resident.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Text style={styles.avatarText}>{resident.avatar}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{resident.name}</Text>
        <Text style={styles.flat}>{resident.flat} · Block {resident.block}</Text>
        <View style={styles.row}>
          <Ionicons name="people-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.meta}>{resident.members} members</Text>
          <Ionicons name="call-outline" size={13} color={colors.textSecondary} style={{ marginLeft: 10 }} />
          <Text style={styles.meta}>{resident.phone}</Text>
        </View>
      </View>
      <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
        <Text style={[styles.badgeText, { color: statusColor }]}>{resident.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  flat: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 3,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
