import { DependencyContainer } from "tsyringe";
import { RequestContext } from "../models/RequestContext";

export interface Channel {
  getName(): string;
  getActions(): string[];
  serve(requestContext: RequestContext): Promise<Response>;
  getDependencyContainer(): DependencyContainer
}
