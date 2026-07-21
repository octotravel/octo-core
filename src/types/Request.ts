export enum RequestMethod {
  Connect = 'CONNECT',
  Delete = 'DELETE',
  Get = 'GET',
  Head = 'HEAD',
  Options = 'OPTIONS',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
  Trace = 'TRACE',
}

export const AllRequestMethods: string[] = [
  RequestMethod.Connect,
  RequestMethod.Delete,
  RequestMethod.Get,
  RequestMethod.Head,
  RequestMethod.Options,
  RequestMethod.Patch,
  RequestMethod.Post,
  RequestMethod.Put,
  RequestMethod.Trace,
];
