import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout';
import { Header, EmptyState } from '@/components/common';
import { SearchInput } from '@/components/ui';
import { Loader } from '@/components/feedback';
import { SocietyCard } from '../components/SocietyCard';
import { useSocieties } from '../hooks/useSocieties';
import colors from '@/theme/colors';

export const SocietyListScreen: React.FC = () => {
  const router = useRouter();
  const { societies, loading, fetchSocieties } = useSocieties();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchSocieties(); }, []);

  const filtered = societies.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSocieties();
    setRefreshing(false);
  }, [fetchSocieties]);

  const goToDetails = (id: string) =>
    router.push({ pathname: '/society/details', params: { id } });

  if (loading && !refreshing && societies.length === 0) {
    return (
      <ScreenWrapper>
        <Header title="Societies" showBack />
        <Loader message="Loading societies..." />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="Societies" showBack />
      <View style={styles.content}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or city..."
          onClear={() => setSearch('')}
        />
        <Text style={styles.count}>
          {filtered.length} {filtered.length === 1 ? 'society' : 'societies'} found
        </Text>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SocietyCard society={item} onPress={() => goToDetails(item.id)} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="business-outline"
              title="No Societies"
              subtitle={search ? 'No societies match your search.' : 'Tap + to add your first society.'}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.warning]}
              tintColor={colors.warning}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/society/add')}
        activeOpacity={0.85}
        accessibilityLabel="Add society"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default SocietyListScreen;

const styles = StyleSheet.create({
  content: { flex: 1, padding: 16 },
  count: { fontSize: 12, color: colors.textLight, marginBottom: 8 },
  list: { paddingBottom: 90 },
  fab: {
    position: 'absolute', right: 20, bottom: 28,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.warning,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6,
  },
});
