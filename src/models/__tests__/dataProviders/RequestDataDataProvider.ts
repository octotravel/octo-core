import { DataGenerationService } from '../../../services/DataGenerationService';
import { Environment } from '../../Config';
import { RequestData, RequestMetaData } from '../../RequestData';
import { SubRequestDataDataProvider } from './SubRequestDataDataProvider';

export class RequestDataDataProvider {
  private readonly dataGenerator = new DataGenerationService();
  public readonly subRequestDataProvider = new SubRequestDataDataProvider();
  public readonly action = 'testAction';
  public readonly url = 'http://request.com';
  public readonly method = 'GET';
  public readonly status = 200;
  public readonly request = new Request(this.url, {
    method: this.method,
  });

  public readonly response = new Response('{ "request": {} }', { status: this.status });
  public readonly error = new Error('test error');

  public readonly id = this.dataGenerator.generateUUID();

  public readonly metaData: RequestMetaData = {
    id: this.id,
    date: new Date(),
    connection: {
      id: null,
      channel: null,
      name: null,
      endpoint: null,
      account: null,
      environment: Environment.TEST,
    },
    action: this.action,
    url: this.url,
    method: this.method,
    status: this.status,
    success: true,
    duration: 1000,
    environment: Environment.TEST,
  };

  public readonly logsEnabled = true;
  public readonly productIds = [this.dataGenerator.generateUUID()];

  public readonly data = new RequestData({
    id: this.id,
    request: this.request,
    response: this.response,
    error: this.error,
    metaData: this.metaData,
    logsEnabled: this.logsEnabled,
    subRequests: [this.subRequestDataProvider.data],
    productIds: this.productIds,
  });
}
