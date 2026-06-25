import notificationsData from '../data/notifications.json';

export const getAllNotifications = () => notificationsData;

export const getUnreadNotifications = () =>
  notificationsData.filter((n) => !n.isRead);

export const getUnreadCount = () =>
  notificationsData.filter((n) => !n.isRead).length;

export const getNotificationsByType = (type) =>
  notificationsData.filter((n) => n.type === type);
