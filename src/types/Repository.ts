import { Account } from "./Account";
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

export interface IAccountRepository<AccountData, GetAccountData> {
  create(accountData: AccountData): Promise<void>;
  update(accountData: AccountData): Promise<void>;
  get(key: string): Promise<Account | null>;
  getAll(): Promise<Array<GetAccountData>>;
  delete(key: string): Promise<void>;
}

export interface IConnectionRepository<Connection, ConnectionPatch> {
  create(data: Connection): Promise<void>;
  update(data: ConnectionPatch): Promise<void | null>;
  get(key: string): Promise<Connection | null>;
  delete(key: string): Promise<void>;
}