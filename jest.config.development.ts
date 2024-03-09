import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testPathIgnorePatterns: ["bak", "build", "system.test.ts"],
  moduleNameMapper: {
    "^assets/(.*)": "<rootDir>/src/assets/$1",
    "^bootstrap/(.*)": "<rootDir>/node_modules/bootstrap/$1",
    "^components/(.*)": "<rootDir>/src/components/$1",
    "^controllers/(.*)": "<rootDir>/src/controllers/$1",
    "^customer/(.*)": "<rootDir>/src/microservices/customer/$1",
    "^microservices": "<rootDir>/src/microservices/$1",
    "^models/(.*)": "<rootDir>/src/models/$1",
    "^modules/(.*)": "<rootDir>/src/modules/$1",
    "^product/(.*)": "<rootDir>/src/microservices/product/$1",
    "^project/(.*)": "<rootDir>/src/project/$1",
    "^public/(.*)": "<rootDir>/public/$1",
    "^root/(.*)": "<rootDir>/$1",
    "^routes/(.*)": "<rootDir>/src/routes/$1",
    "^scss/(.*)": "<rootDir>/src/scss/$1",
    "^skills/(.*)": "<rootDir>/src/skills/$1",
    "^src/(.*)": "<rootDir>/src/$1",
    "^utils/(.*)": "<rootDir>/src/utils/$1",
    "^views/(.*)": "<rootDir>/src/views/$1",
  },
};

export default config;

// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "node",
//   rootDir: ".",
//   testPathIgnorePatterns: ["bak", "build"],
//   moduleNameMapper: {
//     "^assets/(.*)": "<rootDir>/src/assets/$1",
//     "^bootstrap/(.*)": "<rootDir>/node_modules/bootstrap/$1",
//     "^components/(.*)": "<rootDir>/src/components/$1",
//     "^controllers/(.*)": "<rootDir>/src/controllers/$1",
//     "^microservices": "<rootDir>/src/microservices/$1",
//     "^models/(.*)": "<rootDir>/src/models/$1",
//     "^project/(.*)": "<rootDir>/src/project/$1",
//     "^public/(.*)": "<rootDir>/public/$1",
//     "^root/(.*)": "<rootDir>/$1",
//     "^routes/(.*)": "<rootDir>/src/routes/$1",
//     "^scss/(.*)": "<rootDir>/src/scss/$1",
//     "^skills/(.*)": "<rootDir>/src/skills/$1",
//     "^utils/(.*)": "<rootDir>/src/utils/$1",
//     "^views/(.*)": "<rootDir>/src/views/$1",
//   },
// };
