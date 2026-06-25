import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../src/components/common/ScreenWrapper';
import Header from '../../src/components/common/Header';
import SearchInput from '../../src/components/inputs/SearchInput';
import EmptyState from '../../src/components/common/EmptyState';
import { useMaintenance } from '../../src/hooks/useMaintenance';
import { getStatusColor } from '../../src/utils/helpers';
import { formatDate } from '../../src/utils/dateUtils';
import colors from '../../src/theme/colors';

const FILTERS = ['All', 'Open', 'In Progress', 'Resolved'];

const priorityColor = (p) => {
  if (p === 'Critical') return '#B71C1C';
  if (p === 'High') return colors.danger;
  if (p === 'Medium') return colors.warning;
  return colors.success;
};

function MaintenanceCard({ item }) {
  const statusColor = getStatusColor(item.status);
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.priorityBadge, { backgroundColor: priorityColor(item.priority) + '20' }]}>
          <Text style={[styles.priorityText, { color: priorityColor(item.priority) }]}>{item.priority}</Text>
        </View>
        <Text style={styles.cardId}>{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSub}>{item.category} · {item.flat}</Text>
      {item.description ? <Text style={styles.cardDesc}>{item.description}</Text> : null}
      <View style={styles.cardFooter}>
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={12} color={colors.textLight} />
          <Text style={styles.footerText}> {formatDate(item.reportedDate)}</Text>
        </View>
        {item.assignedTo && (
          <View style={styles.row}>
            <Ionicons name="person-outline" size={12} color={colors.textLight} />
            <Text style={styles.footerText}> {item.assignedTo}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function Maintenance() {
  const { filtered, searchQuery, filterStatus, search, filter } = useMaintenance();

  return (
    <ScreenWrapper>
      <Header title="Maintenance" showBack />
      <View style={styles.content}>
        <SearchInput
          value={searchQuery}
          onChangeText={search}
          placeholder="Search by title or category..."
          onClear={() => search('')}
        />
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filterStatus === f && styles.filterActive]}
              onPress={() => filter(f)}
            >
              <Text style={[styles.filterText, filterStatus === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.count}>{filtered.length} requests</Text>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MaintenanceCard item={item} />}
          ListEmptyComponent={
            <EmptyState icon="build-outline" title="No Requests" subtitle="No maintenance requests found." />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 16 },
  filterRow: { flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap', gap: 6 },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 12, color: colors.textSecondary },
  filterTextActive: { color: colors.white, fontWeight: '600' },
  count: { fontSize: 12, color: colors.textLight, marginBottom: 8 },
  list: { paddingBottom: 24 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  priorityText: { fontSize: 10, fontWeight: '700' },
  cardId: { fontSize: 11, color: colors.textLight, flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '600' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  cardSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cardDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', marginTop: 8, gap: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 11, color: colors.textLight },
});
