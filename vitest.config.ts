import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  cacheDir: '.cache/vitest',
  test: {
    passWithNoTests: true,
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false,
        isolate: true,
      },
    },
    fileParallelism: true,
    watch: false,
    globals: false,
    testTimeout: 30000,
    hookTimeout: 30000,
    reporters: ['verbose'],
    include: ['**/__tests__/**/*.+(test.ts)'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      reporter: ['text'],
      reportOnFailure: true,
      all: false,
      allowExternal: false,
      include: ['src/**/*.ts'],
      exclude: ['**/node_modules/**', '**/__tests__/**'],
      thresholds: {
        perFile: true,
        branches: 0,
        lines: 0,
        functions: 0,
        statements: 0,
      },
    },
  },
});
