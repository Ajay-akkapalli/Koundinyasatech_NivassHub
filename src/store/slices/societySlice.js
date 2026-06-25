import { createSlice } from '@reduxjs/toolkit';

const societySlice = createSlice({
  name: 'societies',
  initialState: {
    societies: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSocieties: (state, action) => {
      state.societies = action.payload;
    },
    addSociety: (state, action) => {
      state.societies = [action.payload, ...state.societies];
    },
    updateSociety: (state, action) => {
      const index = state.societies.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.societies[index] = action.payload;
      }
    },
    deleteSociety: (state, action) => {
      state.societies = state.societies.filter((s) => s.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSocieties,
  addSociety,
  updateSociety,
  deleteSociety,
  setLoading,
  setError,
} = societySlice.actions;

export default societySlice.reducer;
