import {BaseRequestData, IBaseRequestData} from './BaseRequestData'

export type SubMetadata = {
    id: string;
    requestId: string;
    date: Date;
    url: string;
    method: string;
    status: number;
    success: boolean;
    duration: number;
  };

export class SubRequestData extends BaseRequestData implements IBaseRequestData {
    public id: string;
    public request: Request;
    public response: Response;
    public metadata: SubMetadata;
    public error: Error | null = null;
    public logsEnabled: boolean;
  
    constructor({
      id,
      request,
      response,
      metadata,
      logsEnabled,
    }: {
      id: string;
      request: Request;
      response: Response;
      metadata: SubMetadata;
      logsEnabled: boolean;
    }) {
      super();
      this.id = id;
      this.response = response;
      this.request = request;
      this.metadata = metadata;
      this.logsEnabled = logsEnabled;
    }
  
    public setError = (error: Error): void => {
      this.error = error;
    };
  
    public clone = (): SubRequestData => {
      return new SubRequestData({
        id: this.id,
        request: this.request.clone(),
        response: this.response.clone(),
        metadata: this.metadata,
        logsEnabled: this.logsEnabled,
      });
    };
  }
  