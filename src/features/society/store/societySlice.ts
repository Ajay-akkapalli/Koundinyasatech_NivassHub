import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Society } from '../types';

interface SocietyState {
  societies: Society[];
  loading: boolean;
  error: string | null;
}

const initialState: SocietyState = {
  societies: [],
  loading: false,
  error: null,
};

const societySlice = createSlice({
  name: 'societies',
  initialState,
  reducers: {
    setSocieties(state, action: PayloadAction<Society[]>) {
      state.societies = action.payload;
    },
    addSociety(state, action: PayloadAction<Society>) {
      state.societies = [action.payload, ...state.societies];
    },
    updateSociety(state, action: PayloadAction<Society>) {
      const index = state.societies.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.societies[index] = action.payload;
      }
    },
    deleteSociety(state, action: PayloadAction<string>) {
      state.societies = state.societies.filter((s) => s.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
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
