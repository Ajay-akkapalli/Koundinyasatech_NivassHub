import axios from 'axios';
import { ENV } from '@/config/env';
import { applyRequestInterceptor, applyResponseInterceptor } from './interceptors';

console.log('[API] Base URL:', ENV.API_BASE_URL);

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

applyRequestInterceptor(apiClient);
applyResponseInterceptor(apiClient);

export default apiClient;
