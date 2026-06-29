/**
 * Centralized Axios instance.
 * Run `npm install axios` before connecting to a real backend.
 */
import axios from 'axios';
import { ENV } from '@/config/env';
import { applyRequestInterceptor, applyResponseInterceptor } from './interceptors';

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL || 'https://api.nivasshub.com/v1',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

applyRequestInterceptor(apiClient);
applyResponseInterceptor(apiClient);

export default apiClient;
