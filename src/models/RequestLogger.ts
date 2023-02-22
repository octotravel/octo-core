import { RequestData } from "./RequestData";
import { RequestContext } from "./RequestContext";

export interface IRequestLogger {
  logRequest(data: RequestData, ctx: RequestContext): Promise<void>;
}

export class NullRequestLogger implements IRequestLogger {
  public logRequest = async (data: RequestData, ctx: RequestContext): Promise<void> =>
    Promise.resolve();
}
