import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dashboardData from '../data/dashboard.json';

interface DashboardStats {
  totalResidents: number;
  totalFlats: number;
  activeVisitors: number;
  monthlyMaintenanceCollection: number;
  pendingComplaints: number;
  occupancyRate: number;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
  icon: string;
}

interface DashboardState {
  stats: DashboardStats;
  recentActivities: Activity[];
  loading: boolean;
}

const initialState: DashboardState = {
  stats: dashboardData.stats as DashboardStats,
  recentActivities: dashboardData.recentActivities as Activity[],
  loading: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    refreshDashboard(state) {
      state.stats = dashboardData.stats as DashboardStats;
      state.recentActivities = dashboardData.recentActivities as Activity[];
    },
  },
});

export const { setLoading, refreshDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
