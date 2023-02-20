import { BaseConfig } from "./Config";
import { BaseConnection } from "./../types/Connection";
import { RequestDataManager } from "./RequestDataManager";
import { RequestData } from "./RequestData";

export interface IAlertLogger {
  alert(rdm: RequestDataManager<BaseConnection, BaseConfig>, data: RequestData): Promise<void>;
}

export class NullAlertLogger implements IAlertLogger {
  public alert = async (rdm: RequestDataManager<BaseConnection, BaseConfig>): Promise<void> => Promise.resolve();
}
