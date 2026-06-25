import { createSlice } from '@reduxjs/toolkit';
import visitorsData from '../../data/visitors.json';

const visitorSlice = createSlice({
  name: 'visitors',
  initialState: {
    list: visitorsData,
    filtered: visitorsData,
    searchQuery: '',
    filterStatus: 'All',
    loading: false,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filtered = visitorsData.filter((v) => {
        const matchQuery =
          v.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          v.hostFlat.toLowerCase().includes(action.payload.toLowerCase());
        const matchStatus =
          state.filterStatus === 'All' || v.status === state.filterStatus;
        return matchQuery && matchStatus;
      });
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
      state.filtered = visitorsData.filter((v) => {
        const matchQuery =
          v.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          v.hostFlat.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchStatus =
          action.payload === 'All' || v.status === action.payload;
        return matchQuery && matchStatus;
      });
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSearchQuery, setFilterStatus, setLoading } = visitorSlice.actions;
export default visitorSlice.reducer;
