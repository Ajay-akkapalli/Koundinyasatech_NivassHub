import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getStatusColor } from '@utils/formatters';
import colors from '@theme/colors';
import type { MaintenanceRequest } from '../types';

interface MaintenanceCardProps {
  item: MaintenanceRequest;
  onPress?: () => void;
}

const PRIORITY_COLOR: Record<string, string> = {
  Critical: '#B71C1C',
  High: colors.danger,
  Medium: colors.warning,
  Low: colors.success,
};

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ item, onPress }) => {
  const statusColor = getStatusColor(item.status);
  const priorityColor = PRIORITY_COLOR[item.priority] ?? colors.textSecondary;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.category}>{item.category}</Text>
      <View style={styles.footer}>
        <View style={[styles.priorityTag, { backgroundColor: priorityColor + '20' }]}>
          <Text style={[styles.priorityText, { color: priorityColor }]}>{item.priority}</Text>
        </View>
        <Text style={styles.flat}>Flat: {item.flat}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MaintenanceCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 10,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  category: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priorityTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  priorityText: { fontSize: 12, fontWeight: '600' },
  flat: { fontSize: 12, color: colors.textSecondary },
});
