module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.+(test.ts)"],
  transform: {
    "\\.ts?$": ["ts-jest", { tsconfig: "./tsconfig.json" }],
    "node_modules/@octocloud/types/\\.ts?$": ["ts-jest", { tsconfig: "./tsconfig.json" }],
  },
  transformIgnorePatterns: ["node_modules/(?!@octocloud/types.*)"],
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["<rootDir>/src/generators"],
};
