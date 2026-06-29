import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@theme/colors';
import type { Society } from '../types';

interface SocietyCardProps {
  society: Society;
  onPress?: () => void;
}

const ORANGE = colors.warning;

export const SocietyCard: React.FC<SocietyCardProps> = ({ society, onPress }) => {
  const { name, address, city, state, totalBlocks, totalUnits } = society;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.accentBar} />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.iconWrap}>
            <Ionicons name="business-outline" size={22} color={ORANGE} />
          </View>
          <View style={styles.nameWrap}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            <Text style={styles.location} numberOfLines={1}>{city}, {state}</Text>
          </View>
        </View>
        <Text style={styles.address} numberOfLines={2}>{address}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="layers-outline" size={14} color={ORANGE} />
            <Text style={styles.statText}>{totalBlocks} Blocks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Ionicons name="home-outline" size={14} color={ORANGE} />
            <Text style={styles.statText}>{totalUnits} Units</Text>
          </View>
        </View>
        <View style={styles.detailsLink}>
          <Text style={styles.detailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={14} color={ORANGE} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SocietyCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white, borderRadius: 12, marginBottom: 12,
    flexDirection: 'row', elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, overflow: 'hidden',
  },
  accentBar: { width: 4, backgroundColor: colors.warning },
  body: { flex: 1, padding: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.warning + '15', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  nameWrap: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  location: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  address: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  stat: { flexDirection: 'row', alignItems: 'center' },
  statText: { fontSize: 12, color: colors.textSecondary, marginLeft: 4 },
  statDivider: { width: 1, height: 14, backgroundColor: colors.border, marginHorizontal: 12 },
  detailsLink: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  detailsText: { fontSize: 13, fontWeight: '600', color: colors.warning, marginRight: 2 },
});
