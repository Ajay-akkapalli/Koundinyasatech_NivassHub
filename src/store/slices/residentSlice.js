import { createSlice } from '@reduxjs/toolkit';
import residentsData from '../../data/residents.json';

const residentSlice = createSlice({
  name: 'residents',
  initialState: {
    list: residentsData,
    filtered: residentsData,
    searchQuery: '',
    filterStatus: 'All',
    loading: false,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filtered = residentsData.filter((r) => {
        const matchQuery =
          r.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          r.flat.toLowerCase().includes(action.payload.toLowerCase());
        const matchStatus =
          state.filterStatus === 'All' || r.status === state.filterStatus;
        return matchQuery && matchStatus;
      });
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
      state.filtered = residentsData.filter((r) => {
        const matchQuery =
          r.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          r.flat.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchStatus =
          action.payload === 'All' || r.status === action.payload;
        return matchQuery && matchStatus;
      });
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSearchQuery, setFilterStatus, setLoading } = residentSlice.actions;
export default residentSlice.reducer;
