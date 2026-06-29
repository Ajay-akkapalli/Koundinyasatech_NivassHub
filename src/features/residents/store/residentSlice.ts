import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import residentsData from '../data/residents.json';
import type { Resident } from '../types';

interface ResidentState {
  list: Resident[];
  filtered: Resident[];
  searchQuery: string;
  filterStatus: string;
  loading: boolean;
}

const initialState: ResidentState = {
  list: residentsData as Resident[],
  filtered: residentsData as Resident[],
  searchQuery: '',
  filterStatus: 'All',
  loading: false,
};

const residentSlice = createSlice({
  name: 'residents',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.filtered = (residentsData as Resident[]).filter((r) => {
        const matchQuery =
          r.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          r.flat.toLowerCase().includes(action.payload.toLowerCase());
        const matchStatus =
          state.filterStatus === 'All' || r.status === state.filterStatus;
        return matchQuery && matchStatus;
      });
    },
    setFilterStatus(state, action: PayloadAction<string>) {
      state.filterStatus = action.payload;
      state.filtered = (residentsData as Resident[]).filter((r) => {
        const matchQuery =
          r.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          r.flat.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchStatus =
          action.payload === 'All' || r.status === action.payload;
        return matchQuery && matchStatus;
      });
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setSearchQuery, setFilterStatus, setLoading } = residentSlice.actions;
export default residentSlice.reducer;
