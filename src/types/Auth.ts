export interface IAuthService {
  validate(accountId: string, connectionId: string): Promise<void>;
}
