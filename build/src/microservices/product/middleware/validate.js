"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const httpCodes_1=__importDefault(require("../../../utils/httpCodes")),validate={cart:cart,cart_id:cart_id,item:item};function cart(cart){if(!cart||!cart._id){const error=new Error("ERROR: invalid cart");throw error.code=httpCodes_1.default.error.badRequest,error}}function cart_id(id){if(!id){const error=new Error("ERROR: invalid cart");throw error.code=httpCodes_1.default.error.badRequest,error}}function item(item){if(!item||!item._id){const error=new Error("ERROR: invalid item");throw error.code=httpCodes_1.default.error.badRequest,error}}exports.default=validate;