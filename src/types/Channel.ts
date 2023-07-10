import { RequestContext } from "../models/RequestContext";

export interface Channel {
  name: string;
  actions: string[];
  serve(request: Request, requestContext: RequestContext): Promise<Response>;
}
