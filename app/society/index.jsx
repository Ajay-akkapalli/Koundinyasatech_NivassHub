import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../src/components/common/ScreenWrapper';
import Header from '../../src/components/common/Header';
import SearchInput from '../../src/components/inputs/SearchInput';
import SocietyCard from '../../src/components/cards/SocietyCard';
import EmptyState from '../../src/components/common/EmptyState';
import Loader from '../../src/components/common/Loader';
import { useSocieties } from '../../src/hooks/useSocieties';
import colors from '../../src/theme/colors';

export default function SocietiesScreen() {
  const router = useRouter();
  const { societies, loading, fetchSocieties } = useSocieties();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load societies on mount
  useEffect(() => {
    fetchSocieties();
  }, []);

  // Client-side search filter across name and city
  const filtered = societies.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSocieties();
    setRefreshing(false);
  }, []);

  const goToDetails = (id) =>
    router.push({ pathname: '/society/details', params: { id } });

  const goToAdd = () => router.push('/society/add');

  // Full-screen loader on first load only
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
              subtitle={
                search
                  ? 'No societies match your search.'
                  : 'Tap + to add your first society.'
              }
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

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={goToAdd} activeOpacity={0.85}>
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  count: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 8,
  },
  list: {
    paddingBottom: 90,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
});
