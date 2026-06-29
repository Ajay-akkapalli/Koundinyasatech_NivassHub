import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import noticesData from '../data/notices.json';
import announcementsData from '../data/announcements.json';
import notificationsData from '../data/notifications.json';
import type { Notice, Announcement, AppNotification } from '../types';

interface NoticeState {
  notices: Notice[];
  announcements: Announcement[];
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
}

const initialState: NoticeState = {
  notices: noticesData as Notice[],
  announcements: announcementsData as Announcement[],
  notifications: notificationsData as AppNotification[],
  unreadCount: (notificationsData as AppNotification[]).filter((n) => !n.isRead).length,
  loading: false,
};

const noticeSlice = createSlice({
  name: 'notices',
  initialState,
  reducers: {
    markNotificationRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      }
    },
    markNoticeRead(state, action: PayloadAction<string>) {
      const notice = state.notices.find((n) => n.id === action.payload);
      if (notice) notice.isRead = true;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { markNotificationRead, markNoticeRead, setLoading } = noticeSlice.actions;
export default noticeSlice.reducer;
