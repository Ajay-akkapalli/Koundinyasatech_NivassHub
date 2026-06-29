import { useAppDispatch, useAppSelector } from '@store/hooks';
import { refreshDashboard } from '../store/dashboardSlice';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const { stats, recentActivities, loading } = useAppSelector((state) => state.dashboard);

  const refresh = () => dispatch(refreshDashboard());

  return { stats, recentActivities, loading, refresh };
};
