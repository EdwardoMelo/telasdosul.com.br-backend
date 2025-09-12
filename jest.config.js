// jest.config.js
module.exports = {
  testEnvironment: "node", // Ambiente Node.js, já que é uma API
  coverageDirectory: "coverage", // Pasta para relatórios de cobertura
  coverageReporters: ["text", "lcov"], // Formatos de relatório de cobertura
  testPathIgnorePatterns: ["/node_modules/"], // Ignora node_modules
  testMatch: ["**/tests/**/*.test.js"], // Padrão para encontrar arquivos de teste
};
