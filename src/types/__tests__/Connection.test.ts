import { describe, expect, it } from 'vitest';
import { createConnectionSchema, patchConnectionSchema } from '../Connection';

const UUID_V4 = '123e4567-e89b-42d3-a456-426614174000';
const UUID_V7 = '0198f2bc-4a3d-7f1e-8c2b-123456789abc';
const NIL_UUID = '00000000-0000-0000-0000-000000000000';
const UUID_V8 = '123e4567-e89b-82d3-a456-426614174000';
const MALFORMED_UUID = 'not-a-uuid';

const createConnection = {
  id: 'connection-id',
  supplierId: UUID_V4,
  apiKey: UUID_V4,
  endpoint: 'https://example.com',
  accountId: UUID_V4,
  name: 'Test connection',
};

const patchConnection = {
  id: 'connection-id',
  supplierId: UUID_V4,
  apiKey: UUID_V4,
};

const uuidFields = [
  { name: 'create supplierId', schema: createConnectionSchema, payload: createConnection, field: 'supplierId' },
  { name: 'create apiKey', schema: createConnectionSchema, payload: createConnection, field: 'apiKey' },
  { name: 'create accountId', schema: createConnectionSchema, payload: createConnection, field: 'accountId' },
  { name: 'patch supplierId', schema: patchConnectionSchema, payload: patchConnection, field: 'supplierId' },
  { name: 'patch apiKey', schema: patchConnectionSchema, payload: patchConnection, field: 'apiKey' },
];

describe('connection UUID validation', () => {
  it.each(uuidFields)('$name accepts UUIDv4, UUIDv7, and the nil UUID', async ({ schema, payload, field }) => {
    for (const uuid of [UUID_V4, UUID_V7, NIL_UUID]) {
      const result = (await schema.validate({ ...payload, [field]: uuid })) as Record<string, unknown>;

      expect(result[field]).toBe(uuid);
    }
  });

  it.each(uuidFields)('$name rejects malformed and UUIDv8 values', async ({ schema, payload, field }) => {
    for (const uuid of [MALFORMED_UUID, UUID_V8]) {
      await expect(schema.validate({ ...payload, [field]: uuid })).rejects.toMatchObject({
        errors: [`${field} must be a valid UUID`],
      });
    }
  });
});
