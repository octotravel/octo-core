import { RequestContext } from '../models/RequestContext';

export interface IResponseHandler {
  handleResponse: (data: any, ctx: RequestContext) => Response;
  handleError: (err: any, ctx: RequestContext) => Response;
}
