import { describe, expect, it } from 'vitest';
import { DataGenerationService } from '../DataGenerationService';

describe('DataGenerationService', () => {
  const dataGenerationService = new DataGenerationService();
  describe('generateUUID', () => {
    it('should return uuid', async () => {
      const uuid = dataGenerationService.generateUUID();
      expect(uuid).toHaveLength(36);
    });
  });
});
