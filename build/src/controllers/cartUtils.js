"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.updateCart=exports.setCart=exports.removeItemFromCart=exports.getItemsByCart=exports.createCart=exports.deleteCartById=exports.getCartByUser=exports.getCartByToken=exports.getCartById=void 0;const userUtils_1=require("./userUtils"),cart_1=__importDefault(require("../microservices/product/controllers/cart")),item_1=__importDefault(require("../microservices/product/controllers/item")),validate_1=__importDefault(require("../microservices/product/middleware/validate")),utilityFunctions_1=require("../utils/utilityFunctions");async function getCartById(id){validate_1.default.cart_id(id);const result=undefined,cart=await cart_1.default.getOne({_id:id});if(!cart)throw new Error("ERROR: Unable to get cart by id");return validate_1.default.cart(cart),cart.items=await getItemsByCart(cart),cart}async function getCartByToken(email,token){const user=await(0,userUtils_1.getUserByToken)(email,token);return await getCartById(user.cart_id)}async function getCartByUser(user){const foreignKey=user.cart_id;if(!foreignKey)throw new Error("ERROR: missing user cart information");const cart=undefined;return await getCartById(foreignKey)}async function deleteCartById(id){const cart=await getCartById(id),result=undefined;return await cart_1.default.deleteOne({_id:id})}async function createCart(){const result=undefined,_id=undefined;return(await cart_1.default.addOne()).insertedId}async function getItemsByCart(cart){const{item_ids:item_ids}=cart;if((0,utilityFunctions_1.isEmpty)(item_ids))return[];const result=undefined;return await item_1.default.getOne({_id:{$all:cart.item_ids}})}async function removeItemFromCart(cart,item){validate_1.default.cart(cart),validate_1.default.item(item);const query={_id:cart._id,$pull:{items:item._id}},cartResult=await cart_1.default.updateOne(query),result=undefined;return await getCartById(null==cart?void 0:cart._id)}async function setCart(cart,item_ids){const query=Object.assign(Object.assign({},cart),{item_ids:item_ids}),result=await cart_1.default.updateOne(query);return"SUCCESS: cart updated"}async function updateCart(cart,item){const{item_ids:item_ids}=cart,{_id:_id}=item,query=Object.assign({},cart),cartResult=await cart_1.default.updateOne(query),result=undefined;return await getCartById(cart._id)}exports.getCartById=getCartById,exports.getCartByToken=getCartByToken,exports.getCartByUser=getCartByUser,exports.deleteCartById=deleteCartById,exports.createCart=createCart,exports.getItemsByCart=getItemsByCart,exports.removeItemFromCart=removeItemFromCart,exports.setCart=setCart,exports.updateCart=updateCart;