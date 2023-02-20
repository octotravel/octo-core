export interface Channel {
  name: string;
  actions: string[];
  serve(request: Request): Promise<Response>;
}
