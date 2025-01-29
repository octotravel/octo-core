import { RequestContext } from './RequestContext';
import { RequestData } from './RequestData';

export interface IRequestLogger {
  logRequest: (data: RequestData, ctx: RequestContext) => Promise<void>;
}

export class NullRequestLogger implements IRequestLogger {
  public logRequest = async (data: RequestData, ctx: RequestContext): Promise<void> => {
    await Promise.resolve();
  };
}
