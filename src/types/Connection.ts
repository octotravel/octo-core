import { AnySchema, mixed, object, ObjectSchema, string, ValidationError } from 'yup';
import { HttpBadRequest } from '../models/Error';

export enum BackendType {
  octo = 'octo',
  anchor = 'anchor',
  cityconnect = 'cityconnect',
}

export interface OctoBackend {
  type: BackendType.octo;
  endpoint: string;
  apiKey: string;
  supplierId: string;
}

export interface OctoBackendPatch {
  type: BackendType.octo;
  endpoint?: string;
  apiKey?: string;
  supplierId?: string;
}

export interface AnchorBackend {
  type: BackendType.anchor;
  endpoint: string;
  apiKey: string;
}

export interface AnchorBackendPatch {
  type: BackendType.anchor;
  endpoint?: string;
  apiKey?: string;
}

export interface CityConnectBackend {
  type: BackendType.cityconnect;
  endpoint: string;
  username: string;
  password: string;
}

export interface CityConnectBackendPatch {
  type: BackendType.cityconnect;
  endpoint?: string;
  username?: string;
  password?: string;
}

type ConnectionBackend = OctoBackend | AnchorBackend | CityConnectBackend;
type ConnectionBackendPatch = OctoBackendPatch | AnchorBackendPatch | CityConnectBackendPatch;

export interface BaseConnection {
  id: string;
  supplierId: string;
  apiKey: string;
  endpoint: string;
  accountId: string;
  name: string;
}

export interface BaseConnectionPatch {
  id: string;
  name?: string;
  endpoint?: string;
  apiKey?: string;
  supplierId?: string;
}

const octoBackendSchema: ObjectSchema<OctoBackend> = object().shape({
  type: string<BackendType.octo>().required(),
  endpoint: string().url().required(),
  apiKey: string().required(),
  supplierId: string().required(),
});

const octoBackendPatchSchema: ObjectSchema<OctoBackendPatch> = object().shape({
  type: string<BackendType.octo>().required(),
  endpoint: string().url().optional(),
  apiKey: string().optional(),
  supplierId: string().optional(),
});

const anchorBackendSchema: ObjectSchema<AnchorBackend> = object().shape({
  type: string<BackendType.anchor>().required(),
  endpoint: string().url().required(),
  apiKey: string().required(),
});

const anchorBackendPatchSchema: ObjectSchema<AnchorBackendPatch> = object().shape({
  type: string<BackendType.anchor>().required(),
  endpoint: string().url().optional(),
  apiKey: string().optional(),
});

const cityconnectBackendSchema: ObjectSchema<CityConnectBackend> = object().shape({
  type: string<BackendType.cityconnect>().required(),
  endpoint: string().url().required(),
  username: string().required(),
  password: string().required(),
});

const cityconnectBackendPatchSchema: ObjectSchema<CityConnectBackendPatch> = object().shape({
  type: string<BackendType.cityconnect>().required(),
  endpoint: string().url().optional(),
  username: string().optional(),
  password: string().optional(),
});

export const createConnectionSchema: ObjectSchema<BaseConnection> = object().shape({
  id: string().defined(),
  supplierId: string().uuid().required(),
  apiKey: string().uuid().required(),
  endpoint: string().required(),
  accountId: string().uuid().required(),
  name: string().required(),
});

export const deleteConnectionSchema = string().required();

export const getConnectionSchema = string().required();

export const patchConnectionSchema: ObjectSchema<BaseConnectionPatch> = object().shape({
  id: string().required(),
  supplierId: string().uuid().optional(),
  apiKey: string().uuid().optional(),
  endpoint: string().optional(),
  name: string().optional(),
});

export const validateSchema = async <T>(schema: AnySchema<T>, data: any): Promise<T> => {
  await schema.validate(data);
  return schema.cast(data) as T;
};

/**
 * @throws Error when there is not valid backend
 */
const validateBackendSchema = async (backendType: BackendType, data: any): Promise<ConnectionBackend> => {
  switch (backendType) {
    case BackendType.octo: {
      return await validateSchema<OctoBackend>(octoBackendSchema, data);
    }
    case BackendType.anchor: {
      return await validateSchema<AnchorBackend>(anchorBackendSchema, data);
    }
    case BackendType.cityconnect: {
      return await validateSchema<CityConnectBackend>(cityconnectBackendSchema, data);
    }
    default:
      throw new Error('invalid backend');
  }
};

/**
 * @throws Error when there is not valid backend
 */
const validateBackendPatchSchema = async (backendType: BackendType, data: any): Promise<ConnectionBackendPatch> => {
  switch (backendType) {
    case BackendType.octo: {
      return await validateSchema<OctoBackendPatch>(octoBackendPatchSchema, data);
    }
    case BackendType.anchor: {
      return await validateSchema<AnchorBackendPatch>(anchorBackendPatchSchema, data);
    }
    case BackendType.cityconnect: {
      return await validateSchema<CityConnectBackendPatch>(cityconnectBackendPatchSchema, data);
    }
    default:
      throw new Error('invalid backend');
  }
};

/**
 * @throws HttpBadRequest when there is validation error
 */
export const validateConnectionSchema = async <T>(schema: AnySchema<T>, data: any): Promise<T> => {
  try {
    const connection = await validateSchema<T>(schema, data);
    const backend = await validateBackendSchema(data.backend.type, data.backend);
    return {
      ...connection,
      backend,
    };
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new HttpBadRequest({ error: err.errors[0] });
    }
    throw err;
  }
};

/**
 * @throws HttpBadRequest when there is validation error
 */
export const validateConnectionPatchSchema = async <T>(schema: AnySchema<T>, data: any): Promise<T> => {
  try {
    const connection = (await validateSchema<T>(schema, data)) as any;
    if (connection.backend) {
      const backend = await validateBackendPatchSchema(data.backend.type, data.backend);
      return {
        ...connection,
        backend,
      };
    }
    return connection;
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new HttpBadRequest({ error: err.errors[0] });
    }
    throw err;
  }
};
