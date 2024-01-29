import { IResponseHandler } from '../types/Response';
import { HttpError, MESSAGE_INTERNAL_SERVER_ERROR } from './Error';
import { RequestContext } from './RequestContext';

export class DefaultResponseHandler implements IResponseHandler {
  public handleResponse(data: unknown, _: RequestContext): Response {
    const payload = data === null ? '{}' : JSON.stringify(data);

    return new Response(payload, {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });
  }

  public handleError(err: unknown, ctx: RequestContext): Response {
    if (err instanceof HttpError) {
      ctx.setError(err);
      return new Response(JSON.stringify(err.body), {
        headers: { 'content-type': 'application/json' },
        status: err.status,
      });
    }

    if (err instanceof Error) {
      ctx.setError(err);
      return new Response(JSON.stringify({ error: err.message, stack: err.stack ?? '' }), {
        headers: { 'content-type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ error: MESSAGE_INTERNAL_SERVER_ERROR, stack: '' }), {
      headers: { 'content-type': 'application/json' },
      status: 500,
    });
  }
}
