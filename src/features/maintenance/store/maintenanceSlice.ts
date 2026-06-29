import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import maintenanceData from '../data/maintenance.json';
import type { MaintenanceRequest } from '../types';

interface MaintenanceState {
  list: MaintenanceRequest[];
  filtered: MaintenanceRequest[];
  searchQuery: string;
  filterStatus: string;
  loading: boolean;
}

const initialState: MaintenanceState = {
  list: maintenanceData as MaintenanceRequest[],
  filtered: maintenanceData as MaintenanceRequest[],
  searchQuery: '',
  filterStatus: 'All',
  loading: false,
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.filtered = (maintenanceData as MaintenanceRequest[]).filter((m) => {
        const matchQuery =
          m.title.toLowerCase().includes(action.payload.toLowerCase()) ||
          m.category.toLowerCase().includes(action.payload.toLowerCase());
        const matchStatus =
          state.filterStatus === 'All' || m.status === state.filterStatus;
        return matchQuery && matchStatus;
      });
    },
    setFilterStatus(state, action: PayloadAction<string>) {
      state.filterStatus = action.payload;
      state.filtered = (maintenanceData as MaintenanceRequest[]).filter((m) => {
        const matchQuery =
          m.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          m.category.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchStatus =
          action.payload === 'All' || m.status === action.payload;
        return matchQuery && matchStatus;
      });
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setSearchQuery, setFilterStatus, setLoading } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
