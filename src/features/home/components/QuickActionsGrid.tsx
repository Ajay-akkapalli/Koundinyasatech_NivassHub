import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@theme/colors';
import spacing from '@theme/spacing';
import type { QuickAction } from '../types';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const ICON_MAP: Record<string, IoniconsName> = {
  preapprove: 'person-add-outline',
  payments: 'card-outline',
  posts: 'newspaper-outline',
  security: 'shield-outline',
  book: 'calendar-outline',
  directory: 'list-outline',
  gift: 'gift-outline',
  plus: 'add-circle-outline',
};

const COLOR_MAP: Record<string, string> = {
  preapprove: '#3949AB',
  payments: '#00897B',
  posts: '#E65100',
  security: '#C62828',
  book: '#6A1B9A',
  directory: '#00695C',
  gift: '#FF6F00',
  plus: '#FF9800',
};

const FALLBACK_ICON: IoniconsName = 'apps-outline';
const FALLBACK_COLOR = colors.primary;

interface QuickActionsGridProps {
  actions: QuickAction[];
  onActionPress?: (action: QuickAction) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  actions,
  onActionPress,
}) => (
  <View style={styles.wrapper}>
    <Text style={styles.sectionTitle}>Quick Actions</Text>
    <View style={styles.grid}>
      {actions.map((action) => {
        const iconName = ICON_MAP[action.icon] ?? FALLBACK_ICON;
        const iconColor = COLOR_MAP[action.icon] ?? FALLBACK_COLOR;
        return (
          <TouchableOpacity
            key={action.id}
            style={styles.item}
            onPress={() => onActionPress?.(action)}
            activeOpacity={0.8}
            accessibilityLabel={action.name}
            accessibilityRole="button"
          >
            <View style={[styles.iconBox, { backgroundColor: iconColor + '18' }]}>
              <Ionicons name={iconName} size={26} color={iconColor} />
            </View>
            <Text style={styles.label} numberOfLines={2}>{action.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.sm },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  item: {
    width: '25%',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 15,
  },
});
