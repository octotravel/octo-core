import { BaseConnection, BaseConnectionPatch } from "../types/Connection";

export class ConnectionUpdater {
  private removeEmptyFields = (data: any): Record<string, any> => {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([_, v]) => v != null)
        .filter(Boolean)
    );
  };

  public updateConnection = <T>(connection: BaseConnection, patch: BaseConnectionPatch): T => {
    const withoutNullable = this.removeEmptyFields(patch);
    const backend = patch.backend ? this.removeEmptyFields(patch.backend) : {};
    return {
      ...connection,
      ...withoutNullable,
      backend: {
        ...connection.backend,
        ...backend,
      },
    } as T;
  };
}
