import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { homeService } from '../services/homeService';
import type { HomeApiData, HomeState } from '../types';

// ─── Async Thunks ─────────────────────────────────────────────────────────

export const fetchHomeData = createAsyncThunk<HomeApiData, void, { rejectValue: string }>(
  'home/fetchHomeData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await homeService.getHomeData();
      if (!response.success) return rejectWithValue(response.message);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? 'Failed to load home data. Please try again.',
      );
    }
  },
);

export const refreshHomeData = createAsyncThunk<HomeApiData, void, { rejectValue: string }>(
  'home/refreshHomeData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await homeService.getHomeData();
      if (!response.success) return rejectWithValue(response.message);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? 'Refresh failed. Please try again.',
      );
    }
  },
);

export const approveVisitorThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  'home/approveVisitor',
  async (visitorId, { rejectWithValue }) => {
    try {
      await homeService.approveVisitor(visitorId);
      return visitorId;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? 'Failed to approve visitor.',
      );
    }
  },
);

export const rejectVisitorThunk = createAsyncThunk<
  string,
  { visitorId: string; reason: string },
  { rejectValue: string }
>(
  'home/rejectVisitor',
  async ({ visitorId, reason }, { rejectWithValue }) => {
    try {
      await homeService.rejectVisitor(visitorId, reason);
      return visitorId;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? 'Failed to reject visitor.',
      );
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────

const initialState: HomeState = {
  data: null,
  loading: false,
  refreshing: false,
  error: null,
  processingVisitors: [],
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchHomeData
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Something went wrong.';
      });

    // refreshHomeData
    builder
      .addCase(refreshHomeData.pending, (state) => {
        state.refreshing = true;
        state.error = null;
      })
      .addCase(refreshHomeData.fulfilled, (state, action) => {
        state.refreshing = false;
        state.data = action.payload;
      })
      .addCase(refreshHomeData.rejected, (state, action) => {
        state.refreshing = false;
        state.error = action.payload ?? 'Refresh failed.';
      });

    // approveVisitor
    builder
      .addCase(approveVisitorThunk.pending, (state, action) => {
        state.processingVisitors.push(action.meta.arg);
      })
      .addCase(approveVisitorThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.processingVisitors = state.processingVisitors.filter((v) => v !== id);
        if (state.data) {
          state.data.approvalQueue = state.data.approvalQueue.filter(
            (v) => v.visitorId !== id,
          );
          state.data.approvalQueueCount = state.data.approvalQueue.length;
        }
      })
      .addCase(approveVisitorThunk.rejected, (state, action) => {
        state.processingVisitors = state.processingVisitors.filter(
          (v) => v !== action.meta.arg,
        );
      });

    // rejectVisitor
    builder
      .addCase(rejectVisitorThunk.pending, (state, action) => {
        state.processingVisitors.push(action.meta.arg.visitorId);
      })
      .addCase(rejectVisitorThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.processingVisitors = state.processingVisitors.filter((v) => v !== id);
        if (state.data) {
          state.data.approvalQueue = state.data.approvalQueue.filter(
            (v) => v.visitorId !== id,
          );
          state.data.approvalQueueCount = state.data.approvalQueue.length;
        }
      })
      .addCase(rejectVisitorThunk.rejected, (state, action) => {
        state.processingVisitors = state.processingVisitors.filter(
          (v) => v !== action.meta.arg.visitorId,
        );
      });
  },
});

export default homeSlice.reducer;
