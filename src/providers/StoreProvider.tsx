import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import { clearAuth } from '@features/auth/store';
import { registerUnauthorizedHandler } from '@services/api/interceptors';

interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * Registers the 401 handler once the store is available so that both
 * AsyncStorage and Redux auth state are cleared atomically on session expiry.
 */
function AuthSyncBridge() {
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      store.dispatch(clearAuth());
    });
  }, []);
  return null;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => (
  <Provider store={store}>
    <AuthSyncBridge />
    {children}
  </Provider>
);
