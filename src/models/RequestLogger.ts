import { BaseConnection } from "../types/Connection";
import { BaseConfig } from "./Config";
import { RequestData } from "./RequestData";
import { RequestDataManager } from "./RequestDataManager";

export interface IRequestLogger {
  logRequest(rdm: RequestDataManager<BaseConnection, BaseConfig>, data: RequestData): Promise<void>;
}

export class NullRequestLogger implements IRequestLogger {
  public logRequest = async (rdm: RequestDataManager<BaseConnection, BaseConfig>, data: RequestData): Promise<void> =>
    Promise.resolve();
}
