import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, clearAuthToken } from '@/utils/storage';

export function applyRequestInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: unknown) => Promise.reject(error),
  );
}

export function applyResponseInterceptor(
  client: AxiosInstance,
  onUnauthorized?: () => void,
): void {
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => {
      if ((error as { response?: { status?: number } }).response?.status === 401) {
        clearAuthToken();
        onUnauthorized?.();
      }
      return Promise.reject(error);
    },
  );
}
