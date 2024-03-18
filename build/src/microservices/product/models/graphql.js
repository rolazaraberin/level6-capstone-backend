"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const dotenv_1=__importDefault(require("dotenv"));dotenv_1.default.config();const graphql={send:send};exports.default=graphql;const{canopyApiKey:canopyApiKey}=process.env;async function send(query){const response=undefined;return(await fetch("https://graphql.canopyapi.co/",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json","API-KEY":canopyApiKey},body:JSON.stringify({query:query})})).json()}