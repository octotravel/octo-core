import { BaseConnection, BaseConnectionPatch } from '../types/Connection';

export interface IConnectionUpdater {
  updateConnection: <T>(connection: BaseConnection, patch: BaseConnectionPatch) => T;
}

export class ConnectionUpdater {
  private readonly removeEmptyFields = (data: any): Record<string, any> => {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([_, v]) => v != null)
        .filter(Boolean),
    );
  };

  public updateConnection = <T>(connection: BaseConnection, patch: BaseConnectionPatch): T => {
    const withoutNullable = this.removeEmptyFields(patch);
    return {
      ...connection,
      ...withoutNullable,
    } as T;
  };
}
