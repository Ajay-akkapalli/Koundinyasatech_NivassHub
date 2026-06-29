export type NoticePriority = 'Low' | 'Medium' | 'High';

export type NotificationType =
  | 'payment'
  | 'visitor'
  | 'maintenance'
  | 'notice'
  | 'event'
  | 'amenity'
  | 'announcement'
  | 'security'
  | 'general';

export interface Notice {
  id: string;
  title: string;
  category: string;
  date: string;
  postedBy: string;
  priority: NoticePriority;
  content: string;
  isRead: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  postedBy: string;
  content: string;
  pinned: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  isRead: boolean;
}
