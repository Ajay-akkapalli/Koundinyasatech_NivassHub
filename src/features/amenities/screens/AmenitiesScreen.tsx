import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ScreenWrapper } from '@/components/layout';
import { Header } from '@/components/common';
import { AmenityCard } from '../components/AmenityCard';
import type { Amenity } from '../types';
import amenitiesData from '../data/amenities.json';

export const AmenitiesScreen: React.FC = () => (
  <ScreenWrapper>
    <Header title="Amenities" showBack />
    <FlatList
      data={amenitiesData as Amenity[]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AmenityCard amenity={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  </ScreenWrapper>
);

export default AmenitiesScreen;

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 32 },
});
