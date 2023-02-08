export interface IBaseRequestData {
  id: string;
  request: Request;
  response: Response;
  metadata: any;
  logsEnabled: boolean;
  error: Error | null;
  setError(error: Error): void;
}

export abstract class BaseRequestData {
  protected getDuration = (start: Date, end: Date): number => {
    return (end.getTime() - start.getTime()) / 1000;
  };
}
