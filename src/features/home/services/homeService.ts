import { homeApi } from '../api/homeApi';

export const homeService = {
  getHomeData: () => homeApi.fetchHome(),

  approveVisitor: (visitorId: string) =>
    homeApi.approveVisitor({ visitorId }),

  rejectVisitor: (visitorId: string, reason: string) =>
    homeApi.rejectVisitor({ visitorId, reason }),

  getGuardContact: () => homeApi.getGuardContact(),
};
