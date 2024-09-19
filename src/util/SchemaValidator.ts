import { AnySchema, ValidationError } from 'yup';
import { BAD_REQUEST } from '../models/BackendError';
import { HttpBadRequest } from '../models/Error';
import { RequestContext } from '../models/RequestContext';
import { AlertData } from '../models/AlertData';
import { AlertType } from '../types/AlertType';

export class SchemaValidator {
  public static validateSchema = async <T>(
    schema: AnySchema<T>,
    data: unknown,
    requestContext: RequestContext,
    onValidationError?: (err: Error) => T | never,
  ): Promise<T> => {
    try {
      await schema.validate(data);
      return schema.cast(data) as T;
    } catch (err: any) {
      if (err instanceof ValidationError || err.name === 'ValidationError') {
        const validationErrorMessage = err.errors[0];

        requestContext.enableAlert(new AlertData(AlertType.VALIDATION_ERROR, validationErrorMessage));

        if (onValidationError) {
          const result = onValidationError(err);
          if (result !== undefined) {
            return result as T;
          }
        } else {
          throw new HttpBadRequest({
            error: BAD_REQUEST,
            errorMessage: validationErrorMessage,
          });
        }
      }

      throw err;
    }
  };
}
