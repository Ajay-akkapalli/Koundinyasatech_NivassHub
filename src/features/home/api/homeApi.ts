import { get, post } from '@services/api';
import type {
  HomeApiResponse,
  ApproveVisitorRequest,
  RejectVisitorRequest,
  ApiSuccessResponse,
  GuardContactResponse,
} from '../types';

export const homeApi = {
  fetchHome: () =>
    get<HomeApiResponse>('/home'),

  approveVisitor: (data: ApproveVisitorRequest) =>
    post<ApiSuccessResponse>('/visitors/approve', data),

  rejectVisitor: (data: RejectVisitorRequest) =>
    post<ApiSuccessResponse>('/visitors/reject', data),

  getGuardContact: () =>
    get<GuardContactResponse>('/guard/contact'),
};
