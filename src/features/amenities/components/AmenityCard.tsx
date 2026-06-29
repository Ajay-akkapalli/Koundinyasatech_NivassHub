import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusColor } from '@utils/formatters';
import colors from '@theme/colors';
import type { Amenity } from '../types';

interface AmenityCardProps {
  amenity: Amenity;
  onPress?: () => void;
}

export const AmenityCard: React.FC<AmenityCardProps> = ({ amenity, onPress }) => {
  const statusColor = getStatusColor(amenity.status);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name={amenity.icon as React.ComponentProps<typeof Ionicons>['name']} size={28} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{amenity.name}</Text>
          <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{amenity.status}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>{amenity.description}</Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>Capacity: {amenity.capacity}</Text>
        <Text style={styles.metaText}>{amenity.timings}</Text>
      </View>
      {amenity.bookingFee > 0 && (
        <Text style={styles.fee}>Booking Fee: ₹{amenity.bookingFee}</Text>
      )}
    </TouchableOpacity>
  );
};

export default AmenityCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white, borderRadius: 12, padding: 16, marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  description: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { fontSize: 12, color: colors.textSecondary },
  fee: { fontSize: 13, color: colors.primary, fontWeight: '600', marginTop: 6 },
});
