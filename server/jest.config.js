module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFiles: ["<rootDir>/tests/setup.js"],
  forceExit: true,
  testTimeout: 30000,
};
