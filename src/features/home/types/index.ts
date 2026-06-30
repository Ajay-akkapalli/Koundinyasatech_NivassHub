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
}

export interface HomeApiData {
  user: HomeUser;
  banner: HomeBanner;
  quickActions: QuickAction[];
  maintenanceMessage: string;
  approvalQueueCount: number;
  approvalQueue: ApprovalVisitor[];
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

// ─── Redux State ──────────────────────────────────────────────────────────

export interface HomeState {
  data: HomeApiData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  processingVisitors: string[];
}
