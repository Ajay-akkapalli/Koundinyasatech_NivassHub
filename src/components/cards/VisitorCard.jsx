import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusColor, getInitials } from '../../utils/helpers';
import { formatTime } from '../../utils/dateUtils';
import colors from '../../theme/colors';

export default function VisitorCard({ visitor, onPress }) {
  const statusColor = getStatusColor(visitor.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.avatar, { backgroundColor: visitor.status === 'In' ? colors.success : colors.textLight }]}>
        <Text style={styles.avatarText}>{getInitials(visitor.name)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{visitor.name}</Text>
        <Text style={styles.sub}>{visitor.purpose} · {visitor.hostFlat}</Text>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.meta}> In: {formatTime(visitor.checkIn)}</Text>
          {visitor.checkOut && (
            <Text style={styles.meta}> · Out: {formatTime(visitor.checkOut)}</Text>
          )}
        </View>
        <Text style={styles.gate}>{visitor.gate}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
        <Text style={[styles.badgeText, { color: statusColor }]}>{visitor.status}</Text>
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
    fontSize: 15,
    fontWeight: '700',
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  sub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  meta: { fontSize: 12, color: colors.textSecondary },
  gate: { fontSize: 11, color: colors.primary, marginTop: 2, fontWeight: '500' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
});
