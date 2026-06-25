import { createSlice } from '@reduxjs/toolkit';
import maintenanceData from '../../data/maintenance.json';

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState: {
    list: maintenanceData,
    filtered: maintenanceData,
    searchQuery: '',
    filterStatus: 'All',
    loading: false,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filtered = maintenanceData.filter((m) => {
        const matchQuery =
          m.title.toLowerCase().includes(action.payload.toLowerCase()) ||
          m.category.toLowerCase().includes(action.payload.toLowerCase());
        const matchStatus =
          state.filterStatus === 'All' || m.status === state.filterStatus;
        return matchQuery && matchStatus;
      });
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
      state.filtered = maintenanceData.filter((m) => {
        const matchQuery =
          m.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          m.category.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchStatus =
          action.payload === 'All' || m.status === action.payload;
        return matchQuery && matchStatus;
      });
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSearchQuery, setFilterStatus, setLoading } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
