// ─── API Response Types ────────────────────────────────────────────────────

export interface HomeUser {
  userId: string;
  name: string;
  flatNumber: string;
  profileImage: string;
}

export interface HomeBanner {
  bannerId: string;
  title: string;
  image: string;
  redirectUrl?: string;
}

export interface QuickAction {
  id: number;
  name: string;
  icon: string;
}

export interface ApprovalVisitor {
  visitorId: string;
  visitorName: string;
  flat: string;
  visitorType?: string;
  entryTime?: string;
  photo?: string;
}

export interface HomeApiData {
  user: HomeUser;
  banner: HomeBanner;
  quickActions: QuickAction[];
  maintenanceMessage: string;
  approvalQueueCount: number;
  approvalQueue: ApprovalVisitor[];
  communityPosts?: CommunityPost[];
  advertisements?: AdvertisementItem[];
}

export interface HomeApiResponse {
  success: boolean;
  message: string;
  data: HomeApiData;
}

// ─── Guard Contact ─────────────────────────────────────────────────────────

export interface GuardContactData {
  guardName: string;
  phoneNumber: string;
}

export interface GuardContactResponse {
  success: boolean;
  data: GuardContactData;
}

// ─── Visitor Action Requests ───────────────────────────────────────────────

export interface ApproveVisitorRequest {
  visitorId: string;
}

export interface RejectVisitorRequest {
  visitorId: string;
  reason: string;
}

export interface ApiSuccessResponse {
  success: boolean;
  message: string;
}

// ─── Community Post ────────────────────────────────────────────────────────

export interface CommunityPost {
  postId: string;
  category: string;
  isAdmin?: boolean;
  isAd?: boolean;
  adSource?: string;
  source: string;
  timestamp: string;
  title?: string;
  content: string;
  notificationCount?: number;
  attachmentCount?: number;
  image?: string;
}

// ─── Advertisement ─────────────────────────────────────────────────────────

export interface AdvertisementItem {
  adId: string;
  brandName: string;
  brandLogo?: string;
  title: string;
  description?: string;
  image?: string;
}

// ─── Redux State ──────────────────────────────────────────────────────────

export interface HomeState {
  data: HomeApiData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  processingVisitors: string[];
}
