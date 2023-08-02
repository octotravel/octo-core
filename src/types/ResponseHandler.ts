export interface IResponseHandler {
  handleResponse: (...data: any) => Response;
  handleErrorResponse: (...data: any) => Response;
}
