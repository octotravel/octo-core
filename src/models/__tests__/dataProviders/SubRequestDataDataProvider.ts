import { DataGenerationService } from '../../../services/DataGenerationService';
import { SubRequestData, SubrequestMetaData } from '../../SubRequestData';
import { SubRequestRetryDataDataProvider } from './SubRequestRetryDataDataProvider';

export class SubRequestDataDataProvider {
  private readonly dataGenerator = new DataGenerationService();
  public readonly subRequestRetryDataProvider = new SubRequestRetryDataDataProvider();
  public readonly url = 'http://subrequest.com';
  public readonly method = 'GET';
  public readonly status = 200;
  public readonly request = new Request(this.url, {
    method: this.method,
  });

  public readonly response = new Response('{ "subRequest": {} }', { status: this.status });
  public readonly error = new Error('test error');

  public readonly accountId = this.dataGenerator.generateUUID();
  public readonly id = this.dataGenerator.generateUUID();
  public readonly requestId = this.dataGenerator.generateUUID();
  public readonly subRequestId = this.dataGenerator.generateUUID();

  public readonly metaData: SubrequestMetaData = {
    id: this.id,
    requestId: this.requestId,
    date: new Date(),
    url: this.url,
    method: this.method,
    status: this.status,
    success: true,
    duration: 1000,
  };

  public readonly logsEnabled = true;

  public readonly data = new SubRequestData({
    id: this.id,
    request: this.request,
    response: this.response,
    error: this.error,
    metaData: this.metaData,
    logsEnabled: this.logsEnabled,
    retries: [this.subRequestRetryDataProvider.data],
  });
}
