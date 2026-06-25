import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ScreenWrapper from '../../src/components/common/ScreenWrapper';
import Header from '../../src/components/common/Header';
import NoticeCard from '../../src/components/cards/NoticeCard';
import EmptyState from '../../src/components/common/EmptyState';
import { markNoticeRead } from '../../src/store/slices/noticeSlice';
import colors from '../../src/theme/colors';

const TABS = ['Notices', 'Announcements', 'Notifications'];

export default function Notices() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Notices');
  const { notices, announcements, notifications } = useSelector((s) => s.notices);

  const renderNotices = () => (
    <FlatList
      data={notices}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NoticeCard notice={item} onPress={() => dispatch(markNoticeRead(item.id))} />
      )}
      ListEmptyComponent={<EmptyState title="No Notices" />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderAnnouncements = () => (
    <FlatList
      data={announcements}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={[styles.annCard, item.pinned && styles.pinnedCard]}>
          {item.pinned && (
            <View style={styles.pinnedBadge}>
              <Text style={styles.pinnedText}>📌 Pinned</Text>
            </View>
          )}
          <Text style={styles.annTitle}>{item.title}</Text>
          <Text style={styles.annDate}>{item.date} · {item.postedBy}</Text>
          <Text style={styles.annContent}>{item.content}</Text>
        </View>
      )}
      ListEmptyComponent={<EmptyState title="No Announcements" />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );

  const typeIcon = (type) => {
    const map = {
      payment: '💰', visitor: '🚶', maintenance: '🔧', notice: '📢',
      event: '🎉', amenity: '🏊', announcement: '📣', security: '🔒', general: 'ℹ️',
    };
    return map[type] || '🔔';
  };

  const renderNotifications = () => (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={[styles.notifItem, !item.isRead && styles.notifUnread]}>
          <Text style={styles.notifIcon}>{typeIcon(item.type)}</Text>
          <View style={styles.notifContent}>
            <Text style={styles.notifTitle}>{item.title}</Text>
            <Text style={styles.notifMsg}>{item.message}</Text>
          </View>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
      )}
      ListEmptyComponent={<EmptyState title="No Notifications" />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <ScreenWrapper>
      <Header title="Notices & Alerts" showBack />
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 1 }}>
        {activeTab === 'Notices' && renderNotices()}
        {activeTab === 'Announcements' && renderAnnouncements()}
        {activeTab === 'Notifications' && renderNotifications()}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: 13, color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '700' },
  list: { padding: 16, paddingBottom: 32 },
  annCard: {
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
  pinnedCard: { borderLeftWidth: 3, borderLeftColor: colors.secondary },
  pinnedBadge: { marginBottom: 4 },
  pinnedText: { fontSize: 11, color: colors.secondary, fontWeight: '600' },
  annTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  annDate: { fontSize: 11, color: colors.textLight, marginVertical: 4 },
  annContent: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
  },
  notifUnread: { backgroundColor: colors.primary + '08' },
  notifIcon: { fontSize: 22, marginRight: 10 },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  notifMsg: { fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 17 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
});
