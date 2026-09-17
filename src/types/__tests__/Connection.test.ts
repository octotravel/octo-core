import { MAX, NIL, v1, v3, v4, v5, v6, v7, validate as validateUUID } from 'uuid';
import { describe, expect, it } from 'vitest';
import { createConnectionSchema, patchConnectionSchema } from '../Connection';

const uuid = '01929f47-6e9a-7d12-8c34-123456789abc';
const connection = {
  id: 'connection-id',
  supplierId: uuid,
  apiKey: uuid,
  accountId: uuid,
  endpoint: 'https://example.com',
  name: 'Connection',
};

const uuidVersions = [
  { version: 1, value: v1() },
  { version: 2, value: '000003e8-6e9a-2d12-8c00-123456789abc' },
  { version: 3, value: v3('example.com', v3.DNS) },
  { version: 4, value: v4() },
  { version: 5, value: v5('example.com', v5.DNS) },
  { version: 6, value: v6() },
  { version: 7, value: v7() },
  { version: 8, value: '01929f47-6e9a-8d12-8c34-123456789abc' },
];

const validUUIDs = [
  ...['8', '9', 'a', 'b'].map((variant) => `01929f47-6e9a-7d12-${variant}c34-123456789abc`),
  NIL,
  MAX,
  uuid.toUpperCase(),
];

const invalidUUIDs = [
  '',
  'not-a-uuid',
  uuid.replaceAll('-', ''),
  uuid.replace('7d12', '7g12'),
  uuid.slice(1),
  `${uuid}0`,
  ` ${uuid}`,
  `${uuid} `,
  `{${uuid}}`,
  uuid.replace('7d12', '0d12'),
  uuid.replace('7d12', '9d12'),
  uuid.replace('8c34', '0c34'),
  uuid.replace('8c34', 'cc34'),
  null,
];

describe.each([
  { name: 'createConnectionSchema', schema: createConnectionSchema, fields: ['supplierId', 'apiKey', 'accountId'] },
  { name: 'patchConnectionSchema', schema: patchConnectionSchema, fields: ['supplierId', 'apiKey'] },
])('$name UUID validation', ({ schema, fields }) => {
  for (const field of fields) {
    describe(field, () => {
      it.each(uuidVersions)('accepts UUID v$version', async ({ value }) => {
        const data = { ...connection, [field]: value };
        await expect(schema.validate(data)).resolves.toEqual(data);
      });

      it.each(validUUIDs)('accepts %s', async (value) => {
        const data = { ...connection, [field]: value };
        await expect(schema.validate(data)).resolves.toEqual(data);
      });

      it.each(invalidUUIDs)('rejects %s', async (value) => {
        await expect(schema.validate({ ...connection, [field]: value })).rejects.toThrow();
      });

      it.each([`${uuid}\n`, `${uuid}\r\n`])(
        'uses the library result without extra constraints for %j',
        async (value) => {
          await expect(schema.isValid({ ...connection, [field]: value })).resolves.toBe(validateUUID(value));
        },
      );
    });
  }
});

describe('UUID field requirements', () => {
  it.each(['supplierId', 'apiKey', 'accountId'])('requires %s on creation', async (field) => {
    await expect(createConnectionSchema.validate({ ...connection, [field]: undefined })).rejects.toThrow(
      `${field} is a required field`,
    );
  });

  it('allows UUID fields to be omitted on patch', async () => {
    const patch = { id: 'connection-id' };
    await expect(patchConnectionSchema.validate(patch)).resolves.toEqual(patch);
  });

  it('preserves the UUID validation error message', async () => {
    await expect(patchConnectionSchema.validate({ id: 'connection-id', apiKey: 'invalid' })).rejects.toThrow(
      'apiKey must be a valid UUID',
    );
  });
});
