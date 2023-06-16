export interface AccountData {
  id: string;
  name: string;
  apiKey: string;
}

export interface GetAccountData {
  id: string;
  name: string;
}

export interface Account {
  id: string;
  name: string;
  apiKey: string;
  connectionIds: string[];
}
