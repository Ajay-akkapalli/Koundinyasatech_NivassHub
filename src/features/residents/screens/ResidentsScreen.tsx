import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ScreenWrapper } from '@/components/layout';
import { Header, EmptyState } from '@/components/common';
import { SearchInput } from '@/components/ui';
import { ResidentCard } from '../components/ResidentCard';
import { useResidents } from '../hooks/useResidents';
import colors from '@/theme/colors';

const FILTERS = ['All', 'Active', 'Inactive'] as const;

export const ResidentsScreen: React.FC = () => {
  const { filtered, searchQuery, filterStatus, search, filter } = useResidents();

  return (
    <ScreenWrapper>
      <Header title="Residents" showBack />
      <View style={styles.content}>
        <SearchInput
          value={searchQuery}
          onChangeText={search}
          placeholder="Search by name or flat..."
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
        <Text style={styles.count}>{filtered.length} residents found</Text>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ResidentCard resident={item} />}
          ListEmptyComponent={
            <EmptyState icon="people-outline" title="No Residents" subtitle="No residents match your search." />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </ScreenWrapper>
  );
};

export default ResidentsScreen;

const styles = StyleSheet.create({
  content: { flex: 1, padding: 16 },
  filterRow: { flexDirection: 'row', marginBottom: 10, gap: 8 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white,
  },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 13, color: colors.textSecondary },
  filterTextActive: { color: colors.white, fontWeight: '600' },
  count: { fontSize: 12, color: colors.textLight, marginBottom: 8 },
  list: { paddingBottom: 24 },
});
