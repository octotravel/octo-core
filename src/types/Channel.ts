import { RequestContext } from "../models/RequestContext";

export interface Channel {
  name: string;
  actions: string[];
  serve(requestContext: RequestContext): Promise<Response>;
}
