import { RequestContext } from "./RequestContext";
import { RequestData } from "./RequestData";

export interface IAlertLogger {
  alert(data: RequestData, ctx: RequestContext): Promise<void>;
}

export class NullAlertLogger implements IAlertLogger {
  public alert = async (data: RequestData, ctx: RequestContext): Promise<void> => Promise.resolve();
}
