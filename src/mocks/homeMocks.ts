// ─── Home Screen Mock Data ────────────────────────────────────────────────────
// Matches the API contract: GET /api/v1/home
// TODO: Remove once backend is live and USE_MOCK_API = false.

import type {
  HomeApiResponse,
  ApiSuccessResponse,
  GuardContactResponse,
  CommunityPost,
  AdvertisementItem,
} from '@features/home/types';
import { MOCK_DELAY_MS } from './config';

function mockDelay(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
}

// ── Mock community posts ───────────────────────────────────────────────────────

const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    postId: 'POST001',
    category: 'Notice',
    isAd: true,
    adSource: 'MyPulse',
    source: 'MyPulse',
    timestamp: '4 days ago',
    title: 'Do you crave fresh, healthy fruits & veggies? Wanna try them for free!',
    content:
      "Handpickd is Bangalore & Gurgaon's most loved destination for direct from farmers, pesticide-free fresh produce. As an introductory offer, we are giving a fresh trial to all lucky families in your society.",
    notificationCount: 9,
  },
  {
    postId: 'POST002',
    category: 'Notice',
    isAdmin: true,
    source: 'Society',
    timestamp: '10 Apr',
    title: 'Expense report for quarter ending on March 2026',
    content:
      'Dear Residents, Please find the expense report for the last quarter ending on March 2026 enclosed herewith for review. Thanks, MCR Management',
    notificationCount: 0,
    attachmentCount: 1,
  },
  {
    postId: 'POST003',
    category: 'Community',
    source: 'Residents',
    timestamp: '2 days ago',
    title: 'Pool maintenance notice — 12 Apr to 14 Apr',
    content:
      'The swimming pool will remain closed from 12th to 14th April for annual maintenance. We apologize for the inconvenience and thank you for your patience.',
    notificationCount: 0,
  },
  {
    postId: 'POST004',
    category: 'Event',
    source: 'Admin',
    timestamp: 'Yesterday',
    title: 'Annual General Meeting — 20 April, 6 PM',
    content:
      'The Annual General Meeting for the society will be held on 20 April at 6 PM in the community hall. All flat owners are requested to attend.',
    notificationCount: 4,
  },
];

// ── Mock advertisements ────────────────────────────────────────────────────────

const MOCK_ADVERTISEMENTS: AdvertisementItem[] = [
  {
    adId: 'AD001',
    brandName: 'TVS Emerald',
    title: 'TVS Emerald Altura in Yelahanka, Bagalur Main Road, Bengaluru',
    description:
      'Just 1.2 km from REVA University. Pre-Launching TVS Emerald Altura, 2 & 3 BHK apartments from ₹1.36 crore* in Yelahanka, Bengaluru.',
    image: 'https://dummyimage.com/600x200/1A237E/ffffff&text=TVS+Emerald+Altura',
  },
  {
    adId: 'AD002',
    brandName: 'NivaasHub Pro',
    title: 'Upgrade to Pro — Unlock Premium Society Features',
    description:
      'Remove ads, get advanced analytics, bulk communications, and priority support for your society.',
    image: 'https://dummyimage.com/600x200/FF6F00/ffffff&text=NivaasHub+Pro',
  },
];

// ── GET /home ─────────────────────────────────────────────────────────────────
export async function mockFetchHome(): Promise<HomeApiResponse> {
  await mockDelay();
  return {
    success: true,
    message: 'Home data fetched successfully',
    data: {
      user: {
        userId: 'USR100001',
        name: 'Demo User',
        flatNumber: 'B-402',
        profileImage: 'https://dummyimage.com/100x100/1A237E/ffffff&text=U',
      },
      banner: {
        bannerId: 'BNR001',
        title: 'Online Advertising',
        image: 'https://dummyimage.com/600x200/1A237E/ffffff&text=NivassHub',
        redirectUrl: '',
      },
      quickActions: [
        { id: 1, name: 'Pre-Approve', icon: 'preapprove' },
        { id: 2, name: 'Payments',    icon: 'payments'   },
        { id: 3, name: 'Posts',       icon: 'posts'      },
        { id: 4, name: 'Security',    icon: 'security'   },
        { id: 5, name: 'Book Now',    icon: 'book'       },
        { id: 6, name: 'Directory',   icon: 'directory'  },
        { id: 7, name: 'Free Trial',  icon: 'gift'       },
        { id: 8, name: 'View More',   icon: 'plus'       },
      ],
      maintenanceMessage: 'Visitor maintenance scheduled at 11 AM.',
      approvalQueueCount: 3,
      approvalQueue: [
        { visitorId: 'VIS1001', visitorName: 'Blinkit Delivery', flat: 'B-402', visitorType: 'Delivery', entryTime: '10:45 AM' },
        { visitorId: 'VIS1002', visitorName: 'Zepto Delivery',   flat: 'C-101', visitorType: 'Delivery', entryTime: '11:02 AM' },
        { visitorId: 'VIS1003', visitorName: 'House Help',        flat: 'B-402', visitorType: 'Service',  entryTime: '11:15 AM' },
      ],
      communityPosts: MOCK_COMMUNITY_POSTS,
      advertisements: MOCK_ADVERTISEMENTS,
    },
  };
}

// ── POST /visitors/approve ────────────────────────────────────────────────────
export async function mockApproveVisitor(): Promise<ApiSuccessResponse> {
  await mockDelay();
  return { success: true, message: 'Visitor approved successfully' };
}

// ── POST /visitors/reject ─────────────────────────────────────────────────────
export async function mockRejectVisitor(): Promise<ApiSuccessResponse> {
  await mockDelay();
  return { success: true, message: 'Visitor rejected successfully' };
}

// ── GET /guard/contact ────────────────────────────────────────────────────────
export async function mockGetGuardContact(): Promise<GuardContactResponse> {
  await mockDelay();
  return {
    success: true,
    data: { guardName: 'Security Desk', phoneNumber: '+919876543210' },
  };
}
