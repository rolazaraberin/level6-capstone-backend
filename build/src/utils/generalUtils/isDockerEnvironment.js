"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.isDockerEnvironment=void 0;const fs_1=__importDefault(require("fs"));function isDockerEnvironment(){return fs_1.default.existsSync("/.dockerenv")}exports.isDockerEnvironment=isDockerEnvironment;