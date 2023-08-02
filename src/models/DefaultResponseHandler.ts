import { IResponseHandler } from "../types/ResponseHandler";
import { HttpError } from "./Error";
import { RequestContext } from './RequestContext';

export class DefaultResponseHandler implements IResponseHandler {
    public handleResponse(data: any, ctx: RequestContext): Response {
        const payload = data === null ? "{}" : JSON.stringify(data);

        return new Response(payload, {
            headers: { "content-type": "application/json" },
            status: 200,
        }).clone();
    }

    public handleErrorResponse(err: any, ctx: RequestContext): Response {
        if (err instanceof HttpError) {
            return new Response(JSON.stringify(err.body), {
              headers: { "content-type": "application/json" },
              status: err.status,
            }).clone();
          }

          return new Response(JSON.stringify({ error: err?.message, stack: err?.stack }), {
              headers: { "content-type": "application/json" },
              status: 500,
          }).clone();
    }
}