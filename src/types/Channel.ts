import { RequestContext } from "../models/RequestContext";

export interface Channel {
  name: string;
  actions: string[];
  getRequestContext(): RequestContext;
  serve(request: Request): Promise<Response>;
}
