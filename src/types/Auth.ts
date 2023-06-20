export interface IAuth {
  validate(accountId: string, connectionId: string): Promise<void>;
}
