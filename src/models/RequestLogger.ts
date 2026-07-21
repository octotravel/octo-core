import { RequestContext } from './RequestContext';

export interface IRequestLogger {
  logRequest(requestContext: RequestContext): Promise<void>;
}

export class NullRequestLogger implements IRequestLogger {
  public async logRequest(requestContext: RequestContext): Promise<void> {
    await Promise.resolve();
  }
}
