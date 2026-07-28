export interface IAlertLogger {
  alert(): Promise<void>;
}

export class NullAlertLogger implements IAlertLogger {
  public async alert(): Promise<void> {
    await Promise.resolve();
  }
}
