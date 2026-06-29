import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ScreenWrapper } from '@/components/layout';
import { Header, EmptyState } from '@/components/common';
import { SearchInput } from '@/components/ui';
import { MaintenanceCard } from '../components/MaintenanceCard';
import { useMaintenance } from '../hooks/useMaintenance';
import colors from '@/theme/colors';

const FILTERS = ['All', 'Open', 'In Progress', 'Resolved'] as const;

export const MaintenanceScreen: React.FC = () => {
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
              <Text style={[styles.filterText, filterStatus === f && styles.filterTextActive]}>
                {f}
              </Text>
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
};

export default MaintenanceScreen;

const styles = StyleSheet.create({
  content: { flex: 1, padding: 16 },
  filterRow: { flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap', gap: 6 },
  filterBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white,
  },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 12, color: colors.textSecondary },
  filterTextActive: { color: colors.white, fontWeight: '600' },
  count: { fontSize: 12, color: colors.textLight, marginBottom: 8 },
  list: { paddingBottom: 24 },
});
