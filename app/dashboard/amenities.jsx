import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import ScreenWrapper from '../../src/components/common/ScreenWrapper';
import Header from '../../src/components/common/Header';
import { getStatusColor } from '../../src/utils/helpers';
import colors from '../../src/theme/colors';
import amenitiesData from '../../src/data/amenities.json';

function AmenityCard({ amenity }) {
  const statusColor = getStatusColor(amenity.status);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name={amenity.icon} size={28} color={colors.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{amenity.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{amenity.status}</Text>
          </View>
        </View>
        <View style={styles.capacityBox}>
          <Text style={styles.capacityNum}>{amenity.capacity}</Text>
          <Text style={styles.capacityLabel}>capacity</Text>
        </View>
      </View>

      <Text style={styles.description}>{amenity.description}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
        <Text style={styles.infoText}>{amenity.timings}</Text>
      </View>

      {amenity.bookingRequired && (
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            Booking required · ₹{amenity.bookingFee.toLocaleString('en-IN')} per booking
          </Text>
        </View>
      )}

      <Text style={styles.facilitiesTitle}>Facilities</Text>
      <View style={styles.facilities}>
        {amenity.facilities.map((f, i) => (
          <View key={i} style={styles.facilityChip}>
            <Text style={styles.facilityText}>{f}</Text>
          </View>
        ))}
      </View>

      {amenity.currentBookings && amenity.currentBookings.length > 0 && (
        <>
          <Text style={styles.facilitiesTitle}>Upcoming Bookings</Text>
          {amenity.currentBookings.map((b, i) => (
            <View key={i} style={styles.bookingItem}>
              <Ionicons name="calendar-outline" size={12} color={colors.primary} />
              <Text style={styles.bookingText}>{b.date} · {b.flat} · {b.purpose} · {b.time}</Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
}

export default function Amenities() {
  return (
    <ScreenWrapper>
      <Header title="Amenities" showBack />
      <FlatList
        data={amenitiesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AmenityCard amenity={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: { flex: 1 },
  name: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, marginTop: 4 },
  statusText: { fontSize: 11, fontWeight: '600' },
  capacityBox: { alignItems: 'center' },
  capacityNum: { fontSize: 20, fontWeight: '700', color: colors.primary },
  capacityLabel: { fontSize: 10, color: colors.textLight },
  description: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { fontSize: 13, color: colors.textSecondary, marginLeft: 6 },
  facilitiesTitle: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginTop: 8, marginBottom: 6 },
  facilities: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  facilityChip: {
    backgroundColor: colors.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  facilityText: { fontSize: 11, color: colors.primary, fontWeight: '500' },
  bookingItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  bookingText: { fontSize: 12, color: colors.textSecondary, marginLeft: 6 },
});
