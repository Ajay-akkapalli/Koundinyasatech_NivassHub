import { get, post } from '@services/api';
import { USE_MOCK_API } from '@/mocks/config';
import {
  mockFetchHome,
  mockApproveVisitor,
  mockRejectVisitor,
  mockGetGuardContact,
} from '@/mocks/homeMocks';
import type {
  HomeApiResponse,
  ApproveVisitorRequest,
  RejectVisitorRequest,
  ApiSuccessResponse,
  GuardContactResponse,
} from '../types';

// TODO: Set USE_MOCK_API = false in src/mocks/config.ts once backend is live.

export const homeApi = {
  fetchHome: (): Promise<HomeApiResponse> => {
    if (USE_MOCK_API) {
      console.log('[MOCK] GET /home');
      return mockFetchHome();
    }
    return get<HomeApiResponse>('/home');
  },

  approveVisitor: (data: ApproveVisitorRequest): Promise<ApiSuccessResponse> => {
    if (USE_MOCK_API) {
      console.log('[MOCK] POST /visitors/approve', data.visitorId);
      return mockApproveVisitor();
    }
    return post<ApiSuccessResponse>('/visitors/approve', data);
  },

  rejectVisitor: (data: RejectVisitorRequest): Promise<ApiSuccessResponse> => {
    if (USE_MOCK_API) {
      console.log('[MOCK] POST /visitors/reject', data.visitorId);
      return mockRejectVisitor();
    }
    return post<ApiSuccessResponse>('/visitors/reject', data);
  },

  getGuardContact: (): Promise<GuardContactResponse> => {
    if (USE_MOCK_API) {
      console.log('[MOCK] GET /guard/contact');
      return mockGetGuardContact();
    }
    return get<GuardContactResponse>('/guard/contact');
  },
};
