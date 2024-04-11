"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.toUsedProperties=exports.getValidValues=void 0;const utilityFunctions_1=require("./utils/utilityFunctions"),validValues=[{table:"cart",properties:["_id","item_ids","items","totalQuantity","totalPrice"]},{table:"item",properties:["_id","quantity","subtotal"]},{table:"inventory",properties:["_id","item_ids","totalQuantity","totalPrice"]},{table:"user",properties:["_id","name","email","token"]},{table:"login",properties:["_id","emailHash","passwordHash","token","user_id","googleId"]}];function getValidValues(object,validTablesAndProperties=validValues){validTablesAndProperties instanceof Array||(validTablesAndProperties=[validTablesAndProperties]);let validValues={};for(let validObject of validTablesAndProperties){const table=validObject.table;let validProperties=validObject.properties;validProperties instanceof Array||(validProperties=[validProperties]);const validPropertiesAndValues=(0,utilityFunctions_1.reduce)(object[table],toUsedProperties(validProperties));(0,utilityFunctions_1.isEmpty)(validPropertiesAndValues)||(validValues[table]=validPropertiesAndValues)}return(0,utilityFunctions_1.isEmpty)(validValues)?null:validValues}function toUsedProperties(propertiesArray){return function(usedProperties={},value,property,_object){return void 0===value||value<0||propertiesArray.includes(property)&&(usedProperties[property]=value),usedProperties}}exports.getValidValues=getValidValues,exports.toUsedProperties=toUsedProperties;