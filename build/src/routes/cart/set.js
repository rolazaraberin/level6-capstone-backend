"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.set=void 0;const utilityFunctionsServer_1=require("../../utilityFunctionsServer"),userUtils_1=require("../../controllers/userUtils"),cartUtils_1=require("../../controllers/cartUtils"),errorUtils_1=require("../../utils/errorUtils"),validate_1=__importDefault(require("../../microservices/product/middleware/validate"));async function set(request,response){try{console.log("Updating cart...");const validValues=(0,utilityFunctionsServer_1.getValidValues)(request.body),user=validValues.user,cart=validValues.cart,login=validValues.login;let result;validate_1.default.cart(cart),console.log("Getting cart id..."),cart._id=await(0,userUtils_1.getCartId)(user,login.token),console.log("SUCCESS: Got cart id.");const items=undefined;cart.items&&(result=await(0,cartUtils_1.setCart)(cart)),console.log("SUCCESS: Cart updated."),response.status(200).send(result)}catch(asyncError){console.error("ERROR: Unable to update cart.");const{error:error,message:message,code:code}=await(0,errorUtils_1.handleAsyncError)(asyncError);console.error("ERROR: ",error),console.error("MESSAGE: ",message),response.status(code).send(message)}}exports.set=set;