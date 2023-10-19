import { RequestContext } from "../models/RequestContext";

export interface IResponseHandler {
  handleResponse: (data: unknown, ctx: RequestContext) => Response;
  handleError: (err: Error, ctx: RequestContext) => Response;
}
