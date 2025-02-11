import { DataGenerationService } from '../../../services/DataGenerationService';
import { DateFactory } from '../../DateFactory';
import { SubRequestRetryData, SubrequestRetryMetaData } from '../../SubRequestRetryData';

export class SubRequestRetryDataDataProvider {
  private readonly dataGenerator = new DataGenerationService();
  public readonly url = 'http://subrequestRetry.com';
  public readonly method = 'GET';
  public readonly status = 200;
  public readonly request = new Request(this.url, {
    method: this.method,
  });

  public readonly response = new Response('{ "subRequestRetry": {} }', { status: this.status });
  public readonly error = new Error('test error');

  public readonly accountId = this.dataGenerator.generateUUID();
  public readonly id = this.dataGenerator.generateUUID();
  public readonly requestId = this.dataGenerator.generateUUID();
  public readonly subRequestId = this.dataGenerator.generateUUID();

  public readonly metaData: SubrequestRetryMetaData = {
    id: this.id,
    requestId: this.requestId,
    subRequestId: this.subRequestId,
    date: DateFactory.createUTCDateNow(),
    url: this.url,
    method: this.method,
    status: this.status,
    success: true,
    duration: 1000,
  };

  public readonly logsEnabled = true;

  public readonly data = new SubRequestRetryData({
    id: this.id,
    request: this.request,
    response: this.response,
    error: this.error,
    metaData: this.metaData,
    logsEnabled: this.logsEnabled,
  });
}
