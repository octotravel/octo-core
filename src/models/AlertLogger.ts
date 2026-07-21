import { RequestContext } from './RequestContext';

export interface IAlertLogger {
  alert(requestContext: RequestContext): Promise<void>;
}

export class NullAlertLogger implements IAlertLogger {
  public async alert(requestContext: RequestContext): Promise<void> {
    await Promise.resolve();
  }
}
