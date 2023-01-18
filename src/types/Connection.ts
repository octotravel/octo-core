import * as yup from "yup";
import { HttpBadRequest } from "../models/Error";

export enum BackendType {
  octo = "octo",
  anchor = "anchor",
  cityconnect = "cityconnect",
}

export type OctoBackend = {
  type: BackendType;
  endpoint: string;
  apiKey: string;
  supplierId: string;
};

export type OctoBackendPatch = {
  type: BackendType;
  endpoint?: string;
  apiKey?: string;
  supplierId?: string;
};

export type AnchorBackend = {
  type: BackendType;
  endpoint: string;
  apiKey: string;
};

export type AnchorBackendPatch = {
  type: BackendType.anchor;
  endpoint?: string;
  apiKey?: string;
};

export type CityConnectBackend = {
  type: BackendType.cityconnect;
  endpoint: string;
  username: string;
  password: string;
};

export type CityConnectBackendPatch = {
  type: BackendType.cityconnect;
  endpoint?: string;
  username?: string;
  password?: string;
};

type ConnectionBackend = OctoBackend | AnchorBackend | CityConnectBackend;
type ConnectionBackendPatch =
  | OctoBackendPatch
  | AnchorBackendPatch
  | CityConnectBackendPatch;

export type BaseConnection = {
  id: string;
  backend: ConnectionBackend;
  accountId: string;
  name: string;
};

export type BaseConnectionPatch = {
  id: string;
  accountId: string;
  name?: string;
  backend?: ConnectionBackendPatch;
};

const octoBackendSchema: yup.SchemaOf<OctoBackend> = yup.object().shape({
  type: yup.mixed().oneOf(Object.values(BackendType)).required(),
  endpoint: yup.string().url().required(),
  apiKey: yup.string().required(),
  supplierId: yup.string().required(),
});

const octoBackendPatchSchema: yup.SchemaOf<OctoBackendPatch> = yup
  .object()
  .shape({
    type: yup.mixed().oneOf(Object.values(BackendType)).required(),
    endpoint: yup.string().url().optional(),
    apiKey: yup.string().optional(),
    supplierId: yup.string().optional(),
  });

const anchorBackendSchema: yup.SchemaOf<AnchorBackend> = yup.object().shape({
  type: yup.mixed().oneOf(Object.values(BackendType)).required(),
  endpoint: yup.string().url().required(),
  apiKey: yup.string().required(),
});

const anchorBackendPatchSchema: yup.SchemaOf<AnchorBackendPatch> = yup
  .object()
  .shape({
    type: yup.mixed().oneOf(Object.values(BackendType)).required(),
    endpoint: yup.string().url().optional(),
    apiKey: yup.string().optional(),
  });

const cityconnectBackendSchema: yup.SchemaOf<CityConnectBackend> = yup
  .object()
  .shape({
    type: yup.mixed().oneOf(Object.values(BackendType)).required(),
    endpoint: yup.string().url().required(),
    username: yup.string().required(),
    password: yup.string().required(),
  });

const cityconnectBackendPatchSchema: yup.SchemaOf<CityConnectBackendPatch> = yup
  .object()
  .shape({
    type: yup.mixed().oneOf(Object.values(BackendType)).required(),
    endpoint: yup.string().url().optional(),
    username: yup.string().optional(),
    password: yup.string().optional(),
  });

export const createConnectionSchema = yup.object().shape({
  id: yup.string().defined(),
  backend: yup
    .object()
    .shape({
      type: yup.mixed().oneOf(Object.values(BackendType)),
    })
    .optional()
    .default(undefined),
  accountId: yup.string().required(),
  name: yup.string().required(),
});

export const deleteConnectionSchema = yup.string().required();

export const getConnectionSchema = yup.string().required();

export const patchConnectionSchema = yup.object().shape({
  id: yup.string().required(),
  backend: yup
    .object()
    .shape({
      type: yup.mixed().oneOf(Object.values(BackendType)),
    })
    .default(undefined)
    .optional(),
  accountId: yup.string().required(),
  name: yup.string().optional(),
});

export const validateSchema = async <T>(
  schema: yup.SchemaOf<T>,
  data: unknown,
): Promise<T> => {
  await schema.validate(data);
  return schema.cast(data) as T;
};

/**
 * @throws Error when there is not valid backend
 */
const validateBackendSchema = (
  backendType: BackendType,
  data: unknown,
): Promise<ConnectionBackend> => {
  switch (backendType) {
    case BackendType.octo: {
      return validateSchema<OctoBackend>(octoBackendSchema, data);
    }
    case BackendType.anchor: {
      return validateSchema<AnchorBackend>(anchorBackendSchema, data);
    }
    case BackendType.cityconnect: {
      return validateSchema<CityConnectBackend>(cityconnectBackendSchema, data);
    }
    default:
      throw new Error("invalid backend");
  }
};

/**
 * @throws Error when there is not valid backend
 */
const validateBackendPatchSchema = (
  backendType: BackendType,
  data: unknown,
): Promise<ConnectionBackendPatch> => {
  switch (backendType) {
    case BackendType.octo: {
      return validateSchema<OctoBackendPatch>(octoBackendPatchSchema, data);
    }
    case BackendType.anchor: {
      return validateSchema<AnchorBackendPatch>(anchorBackendPatchSchema, data);
    }
    case BackendType.cityconnect: {
      return validateSchema<CityConnectBackendPatch>(
        cityconnectBackendPatchSchema,
        data,
      );
    }
    default:
      throw new Error("invalid backend");
  }
};

/**
 * @throws HttpBadRequest when there is validation error
 */
export const validateConnectionSchema = async <T>(
  schema: yup.SchemaOf<T>,
  data: any,
): Promise<T> => {
  try {
    const connection = await validateSchema<T>(schema, data);
    const backend = await validateBackendSchema(
      data.backend.type,
      data.backend,
    );
    return {
      ...connection,
      backend,
    };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      throw new HttpBadRequest({ error: err.errors[0] });
    }
    throw err;
  }
};

/**
 * @throws HttpBadRequest when there is validation error
 */
export const validateConnectionPatchSchema = async <T>(
  schema: yup.SchemaOf<T>,
  data: any,
): Promise<T> => {
  try {
    const connection = (await validateSchema<T>(schema, data)) as any;
    if (connection.backend) {
      const backend = await validateBackendPatchSchema(
        data.backend.type,
        data.backend,
      );
      return {
        ...connection,
        backend,
      };
    }
    return connection;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      throw new HttpBadRequest({ error: err.errors[0] });
    }
    throw err;
  }
};
