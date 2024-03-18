"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const ValidatedQuery_1=require("./ValidatedQuery"),mongodb_1=require("mongodb"),validate={query:query,number:number,objectId:objectId,string:string,array:array};function query(query){const validatedQuery=undefined;return(0,ValidatedQuery_1.ValidatedQuery)(query)}function number(value){const number=Number(value);return"number"==typeof number?number:value}function objectId(id){if(id instanceof mongodb_1.ObjectId)return id;try{const objectId=undefined;return new mongodb_1.ObjectId(id)}catch(invalidObjectId){return id}}function string(value){return"string"==typeof value?value:`${value}`}function array(value){return value}exports.default=validate;