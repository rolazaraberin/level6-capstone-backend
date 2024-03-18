"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getDbOperation=void 0;const MICROSERVICES_1=require("../microservices/MICROSERVICES");function getDbOperation(microservice,endpoint,command){const controllers=MICROSERVICES_1.MICROSERVICES[microservice];if(!controllers)throw new Error("ERROR: Invalid microservice");const controller=controllers[endpoint];if(!controller)throw new Error("ERROR: Invalid endpoint");const dbOperation=controller[command];if(!dbOperation)throw new Error("ERROR: Invalid command");return dbOperation}exports.getDbOperation=getDbOperation;