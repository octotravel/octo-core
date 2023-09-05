export interface IResponseHandler {
  handleResponse: (...data: any) => Response;
  handleError: (...data: any) => Response;
}
