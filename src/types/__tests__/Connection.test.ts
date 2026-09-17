import { describe, expect, it } from 'vitest';
import { createConnectionSchema, patchConnectionSchema } from '../Connection';

const UUID_V4 = '550e8400-e29b-41d4-a716-446655440000';
const UUID_V7 = '019694C0-870C-7191-AA65-A9EC0E52B6E4';

const createConnection = {
  id: 'connection-id',
  supplierId: UUID_V4,
  apiKey: UUID_V4,
  endpoint: 'https://example.com',
  accountId: UUID_V4,
  name: 'Test connection',
};

describe('connection UUID validation', () => {
  describe('createConnectionSchema', () => {
    it.each([
      ['v1', '6ba7b810-9dad-11d1-80b4-00c04fd430c8'],
      ['v2', '6ba7b810-9dad-21d1-80b4-00c04fd430c8'],
      ['v3', '6fa459ea-ee8a-3ca4-894e-db77e160355e'],
      ['v4', UUID_V4],
      ['v5', '886313e1-3b8a-5372-9b90-0c9aee199e5d'],
      ['v6', '1ef0c99a-0d06-6a20-8000-000000000000'],
      ['v7 regardless of case', UUID_V7],
      ['nil', '00000000-0000-0000-0000-000000000000'],
    ])('accepts a %s UUID', async (_version, uuid) => {
      await expect(
        createConnectionSchema.validate({
          ...createConnection,
          supplierId: uuid,
          apiKey: uuid,
          accountId: uuid,
        }),
      ).resolves.toBeDefined();
    });

    it.each(['supplierId', 'apiKey', 'accountId'])('rejects a malformed %s', async (field) => {
      await expect(createConnectionSchema.validate({ ...createConnection, [field]: 'not-a-uuid' })).rejects.toThrow(
        `${field} must be a valid UUID`,
      );
    });

    it.each(['supplierId', 'apiKey', 'accountId'])('rejects a v8 %s', async (field) => {
      await expect(
        createConnectionSchema.validate({ ...createConnection, [field]: '550e8400-e29b-81d4-a716-446655440000' }),
      ).rejects.toThrow(`${field} must be a valid UUID`);
    });
  });

  describe('patchConnectionSchema', () => {
    it('accepts v7 UUIDs', async () => {
      await expect(
        patchConnectionSchema.validate({ id: 'connection-id', supplierId: UUID_V7, apiKey: UUID_V7 }),
      ).resolves.toBeDefined();
    });

    it.each(['supplierId', 'apiKey'])('rejects a malformed %s', async (field) => {
      await expect(patchConnectionSchema.validate({ id: 'connection-id', [field]: 'not-a-uuid' })).rejects.toThrow(
        `${field} must be a valid UUID`,
      );
    });

    it.each(['supplierId', 'apiKey'])('rejects a v8 %s', async (field) => {
      await expect(
        patchConnectionSchema.validate({ id: 'connection-id', [field]: '550e8400-e29b-81d4-a716-446655440000' }),
      ).rejects.toThrow(`${field} must be a valid UUID`);
    });
  });
});
