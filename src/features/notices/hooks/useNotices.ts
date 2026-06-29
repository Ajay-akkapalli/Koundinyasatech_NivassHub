import { useAppDispatch, useAppSelector } from '@store/hooks';
import { markNotificationRead, markNoticeRead } from '../store/noticeSlice';

export const useNotices = () => {
  const dispatch = useAppDispatch();
  const { notices, announcements, notifications, unreadCount, loading } = useAppSelector(
    (state) => state.notices
  );

  const readNotification = (id: string) => dispatch(markNotificationRead(id));
  const readNotice = (id: string) => dispatch(markNoticeRead(id));

  return { notices, announcements, notifications, unreadCount, loading, readNotification, readNotice };
};
