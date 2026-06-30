import { combineReducers } from '@reduxjs/toolkit';
import dashboardReducer from '@features/dashboard/store/dashboardSlice';
import residentReducer from '@features/residents/store/residentSlice';
import visitorReducer from '@features/visitors/store/visitorSlice';
import maintenanceReducer from '@features/maintenance/store/maintenanceSlice';
import noticeReducer from '@features/notices/store/noticeSlice';
import societyReducer from '@features/society/store/societySlice';
import authReducer from '@features/auth/store/authSlice';
import homeReducer from '@features/home/store/homeSlice';

export const rootReducer = combineReducers({
  auth: authReducer,             // KEY IS STABLE — do not rename
  home: homeReducer,             // KEY IS STABLE — do not rename
  dashboard: dashboardReducer,   // KEY IS STABLE — do not rename
  residents: residentReducer,    // KEY IS STABLE — do not rename
  visitors: visitorReducer,      // KEY IS STABLE — do not rename
  maintenance: maintenanceReducer, // KEY IS STABLE — do not rename
  notices: noticeReducer,        // KEY IS STABLE — do not rename
  societies: societyReducer,     // KEY IS STABLE — do not rename
});

export type RootState = ReturnType<typeof rootReducer>;
