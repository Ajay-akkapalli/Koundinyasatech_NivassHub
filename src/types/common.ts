export type ID = string;
export type Timestamp = string; // ISO 8601

export interface AsyncResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
