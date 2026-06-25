import { useSelector, useDispatch } from 'react-redux';
import { refreshDashboard } from '../store/slices/dashboardSlice';

export const useDashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentActivities, loading } = useSelector((state) => state.dashboard);

  const refresh = () => dispatch(refreshDashboard());

  return { stats, recentActivities, loading, refresh };
};
