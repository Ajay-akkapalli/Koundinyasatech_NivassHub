import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import visitorsData from '../data/visitors.json';
import type { Visitor } from '../types';

interface VisitorState {
  list: Visitor[];
  filtered: Visitor[];
  searchQuery: string;
  filterStatus: string;
  loading: boolean;
}

const initialState: VisitorState = {
  list: visitorsData as Visitor[],
  filtered: visitorsData as Visitor[],
  searchQuery: '',
  filterStatus: 'All',
  loading: false,
};

const visitorSlice = createSlice({
  name: 'visitors',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.filtered = (visitorsData as Visitor[]).filter((v) => {
        const matchQuery =
          v.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          v.hostFlat.toLowerCase().includes(action.payload.toLowerCase());
        const matchStatus =
          state.filterStatus === 'All' || v.status === state.filterStatus;
        return matchQuery && matchStatus;
      });
    },
    setFilterStatus(state, action: PayloadAction<string>) {
      state.filterStatus = action.payload;
      state.filtered = (visitorsData as Visitor[]).filter((v) => {
        const matchQuery =
          v.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          v.hostFlat.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchStatus =
          action.payload === 'All' || v.status === action.payload;
        return matchQuery && matchStatus;
      });
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setSearchQuery, setFilterStatus, setLoading } = visitorSlice.actions;
export default visitorSlice.reducer;
