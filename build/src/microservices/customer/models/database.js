"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.mongodb=exports.sql=exports.typeorm=exports.knex=void 0;const Database_1=__importDefault(require("../../../utils/Database/v1.1/Database")),mongodb_config_1=__importDefault(require("../mongodb.config")),database=new Database_1.default;database.configureMongodb(mongodb_config_1.default),exports.knex=database.knex,exports.typeorm=database.typeorm,exports.sql=database.sql,exports.mongodb=database.mongodb;