import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusColor, truncateText } from '../../utils/helpers';
import { formatDate } from '../../utils/dateUtils';
import colors from '../../theme/colors';

const priorityColor = (p) => {
  if (p === 'High') return colors.danger;
  if (p === 'Medium') return colors.warning;
  return colors.success;
};

export default function NoticeCard({ notice, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, !notice.isRead && styles.unread]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={[styles.priorityDot, { backgroundColor: priorityColor(notice.priority) }]} />
        <Text style={styles.category}>{notice.category}</Text>
        <Text style={styles.date}>{formatDate(notice.date)}</Text>
      </View>
      <Text style={styles.title}>{notice.title}</Text>
      <Text style={styles.content}>{truncateText(notice.content, 100)}</Text>
      <View style={styles.footer}>
        <Text style={styles.postedBy}>By: {notice.postedBy}</Text>
        {!notice.isRead && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  unread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  category: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 11,
    color: colors.textLight,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  content: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  postedBy: {
    fontSize: 11,
    color: colors.textLight,
  },
  newBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  newBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
