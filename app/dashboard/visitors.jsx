import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ScreenWrapper from '../../src/components/common/ScreenWrapper';
import Header from '../../src/components/common/Header';
import SearchInput from '../../src/components/inputs/SearchInput';
import VisitorCard from '../../src/components/cards/VisitorCard';
import EmptyState from '../../src/components/common/EmptyState';
import { useVisitors } from '../../src/hooks/useVisitors';
import colors from '../../src/theme/colors';

const FILTERS = ['All', 'In', 'Out'];

export default function Visitors() {
  const { filtered, searchQuery, filterStatus, search, filter } = useVisitors();

  return (
    <ScreenWrapper>
      <Header title="Visitors" showBack />
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
        <Text style={styles.count}>{filtered.length} visitors found</Text>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <VisitorCard visitor={item} />}
          ListEmptyComponent={
            <EmptyState icon="person-outline" title="No Visitors" subtitle="No visitors match your search." />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  filterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  count: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 8,
  },
  list: {
    paddingBottom: 24,
  },
});
