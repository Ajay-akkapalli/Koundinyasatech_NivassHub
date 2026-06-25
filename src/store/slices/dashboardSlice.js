import { createSlice } from '@reduxjs/toolkit';
import dashboardData from '../../data/dashboard.json';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: dashboardData.stats,
    recentActivities: dashboardData.recentActivities,
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    refreshDashboard: (state) => {
      state.stats = dashboardData.stats;
      state.recentActivities = dashboardData.recentActivities;
    },
  },
});

export const { setLoading, refreshDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
