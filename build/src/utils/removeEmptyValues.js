"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.removeEmptyValues=void 0;const utilityFunctions_1=require("./utilityFunctions");function removeEmptyValues(object){if((0,utilityFunctions_1.isEmpty)(object))return null;let objectWithoutEmptyValues=null;for(let property in object){const value=object[property];(0,utilityFunctions_1.isEmpty)(value)||(objectWithoutEmptyValues?objectWithoutEmptyValues[property]=value:objectWithoutEmptyValues={[property]:value})}return objectWithoutEmptyValues}exports.removeEmptyValues=removeEmptyValues;