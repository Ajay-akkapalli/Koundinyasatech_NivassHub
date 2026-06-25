import { createSlice } from '@reduxjs/toolkit';
import noticesData from '../../data/notices.json';
import announcementsData from '../../data/announcements.json';
import notificationsData from '../../data/notifications.json';

const noticeSlice = createSlice({
  name: 'notices',
  initialState: {
    notices: noticesData,
    announcements: announcementsData,
    notifications: notificationsData,
    unreadCount: notificationsData.filter((n) => !n.isRead).length,
    loading: false,
  },
  reducers: {
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      }
    },
    markNoticeRead: (state, action) => {
      const notice = state.notices.find((n) => n.id === action.payload);
      if (notice) notice.isRead = true;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { markNotificationRead, markNoticeRead, setLoading } = noticeSlice.actions;
export default noticeSlice.reducer;
