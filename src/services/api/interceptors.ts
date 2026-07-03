import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { getAuthToken, clearAuthToken } from '@/utils/storage';

let _onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(handler: () => void): void {
  _onUnauthorized = handler;
}

export function applyRequestInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // ── Debug logging ──────────────────────────────────────────
      console.log('━━━━━━━━━━━ API REQUEST ━━━━━━━━━━━');
      console.log('URL    :', `${config.baseURL}${config.url}`);
      console.log('Method :', config.method?.toUpperCase());
      console.log('Headers:', JSON.stringify(config.headers));
      console.log('Payload:', JSON.stringify(config.data));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      return config;
    },
    (error: unknown) => {
      console.error('[REQUEST ERROR]', error);
      return Promise.reject(error);
    },
  );
}

export function applyResponseInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // ── Debug logging ──────────────────────────────────────────
      console.log('━━━━━━━━━━━ API RESPONSE ━━━━━━━━━━━');
      console.log('URL    :', response.config.url);
      console.log('Status :', response.status);
      console.log('Body   :', JSON.stringify(response.data));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return response;
    },
    async (error: unknown) => {
      // ── Debug logging ──────────────────────────────────────────
      console.log('━━━━━━━━━━━ API ERROR ━━━━━━━━━━━━━━');
      if (axios.isAxiosError(error)) {
        console.log('URL       :', `${error.config?.baseURL}${error.config?.url}`);
        console.log('Method    :', error.config?.method?.toUpperCase());
        console.log('Payload   :', error.config?.data);
        console.log('Status    :', error.response?.status ?? 'NO RESPONSE');
        console.log('Response  :', JSON.stringify(error.response?.data));
        console.log('Error code:', error.code);
        console.log('Message   :', error.message);

        if (error.code === 'ERR_NETWORK' || !error.response) {
          console.error(
            'DIAGNOSIS: No response received.\n' +
            '  • Is the backend running?  → node server.js in nivasshub-backend\n' +
            '  • Android emulator?        → use http://10.0.2.2:3001\n' +
            '  • Physical device?         → use http://<YOUR-PC-IP>:3001\n' +
            '  • HTTP blocked?            → add usesCleartextTraffic:true in app.json',
          );
        }
      } else {
        console.log('Unknown error:', error);
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await clearAuthToken();
        _onUnauthorized?.();
      }

      return Promise.reject(error);
    },
  );
}
