export const ENV = {
  API_BASE_URL: __DEV__
    ? 'http://10.0.2.2:3001/api/v1'
    : 'https://api.payo.com/api/v1',
  IS_DEV: __DEV__,
} as const;
