export const STORAGE_KEYS = {
  SETTINGS: '@nivasshub_settings',
  PROFILE: '@nivasshub_profile',
  AUTH_TOKEN: '@nivasshub_auth_token',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
