export interface PutOptions {
  expiration?: number;
  expirationTtl?: number;
  metadata?: any;
}

//   export interface ListOptions {
//     prefix?: string;
//     limit?: number;
//     cursor?: string;
//   };

//   export interface ListResult {
//     keys: { name: string; expiration?: number; metadata?: unknown }[];
//     list_complete: boolean;
//     cursor?: string;
//   };

export interface Repository<T> {
  set(key: string, value: T, options?: PutOptions): Promise<void>;
  get(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
}
