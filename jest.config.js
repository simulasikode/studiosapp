// jest.config.js
module.exports = {
  testEnvironment: "jest-environment-jsdom", // Use jsdom for browser-like environment
  moduleNameMapper: {
    "^@/components(.*)$": "<rootDir>/components/$1", // Alias for components directory (adjust if needed)
    "^@/app(.*)$": "<rootDir>/app/$1", // Alias for pages directory (adjust if needed)
    "^@/styles(.*)$": "<rootDir>/styles/$1", // Alias for styles directory (adjust if needed)
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS Modules
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Optional: Setup file
  collectCoverage: true, // Enable coverage reports (optional)
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/jest.config.js/**",
    "!**/jest.setup.js/**",
  ],
  coverageReporters: ["html", "text", "text-summary", "cobertura"],
}; // jest.config.js
module.exports = {
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/components(.*)$": "<rootDir>/components/$1", // Alias for components directory (adjust if needed)
    "^@/app(.*)$": "<rootDir>/app/$1", // Alias for pages directory (adjust if needed)
    "^@/styles(.*)$": "<rootDir>/styles/$1", // Alias for styles directory (adjust if needed)
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS Modules
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Optional: Setup file
  collectCoverage: true, // Enable coverage reports (optional)
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/jest.config.js/**",
    "!**/jest.setup.js/**",
  ],
  coverageReporters: ["html", "text", "text-summary", "cobertura"],
};
