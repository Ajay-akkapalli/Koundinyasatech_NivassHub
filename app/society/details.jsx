import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../src/components/common/ScreenWrapper';
import Header from '../../src/components/common/Header';
import Loader from '../../src/components/common/Loader';
import { useSocieties } from '../../src/hooks/useSocieties';
import { formatDate } from '../../src/utils/dateUtils';
import colors from '../../src/theme/colors';

const ORANGE = colors.warning;

// Reusable info row used inside detail cards
function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={18} color={ORANGE} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function SocietyDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { societies, remove, loading } = useSocieties();
  const [society, setSociety] = useState(null);

  // Derive society from Redux store using the URL param id
  useEffect(() => {
    const found = societies.find((s) => s.id === id);
    setSociety(found || null);
  }, [id, societies]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Society',
      `Are you sure you want to delete "${society?.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await remove(id);
            if (result.success) {
              router.back();
            } else {
              Alert.alert('Error', 'Failed to delete society. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push({ pathname: '/society/edit', params: { id } });
  };

  if (!society) {
    return (
      <ScreenWrapper>
        <Header title="Society Details" showBack />
        <Loader message="Loading..." />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="Society Details" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="business" size={36} color={ORANGE} />
          </View>
          <Text style={styles.heroName}>{society.name}</Text>
          <Text style={styles.heroLocation}>
            {society.city}, {society.state}
          </Text>
        </View>

        {/* Location details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Society Information</Text>
          <InfoRow icon="location-outline" label="Address" value={society.address} />
          <InfoRow icon="map-outline" label="City" value={society.city} />
          <InfoRow icon="flag-outline" label="State" value={society.state} />
        </View>

        {/* Stats */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{society.totalBlocks}</Text>
              <Ionicons name="layers-outline" size={16} color={ORANGE} />
              <Text style={styles.statLabel}>Total Blocks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{society.totalUnits}</Text>
              <Ionicons name="home-outline" size={16} color={ORANGE} />
              <Text style={styles.statLabel}>Total Units</Text>
            </View>
          </View>
        </View>

        {/* Created date */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <InfoRow
            icon="calendar-outline"
            label="Created On"
            value={formatDate(society.createdAt)}
          />
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={handleEdit}
            activeOpacity={0.85}
          >
            <Ionicons name="create-outline" size={20} color={colors.white} />
            <Text style={styles.editBtnText}>Edit Society</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteBtn, loading && styles.btnDisabled]}
            onPress={handleDelete}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Ionicons name="trash-outline" size={20} color={colors.white} />
            <Text style={styles.deleteBtnText}>Delete Society</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderTopWidth: 4,
    borderTopColor: ORANGE,
  },
  heroIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: ORANGE + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  heroLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  infoIconWrap: {
    width: 30,
    alignItems: 'center',
    paddingTop: 2,
  },
  infoContent: {
    flex: 1,
    marginLeft: 10,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 3,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 60,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  actions: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 10,
  },
  editBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingVertical: 14,
  },
  deleteBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  bottomPad: {
    height: 32,
  },
});
