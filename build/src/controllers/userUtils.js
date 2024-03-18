"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.deleteUserById=exports.getUserByPassword=exports.getUserByToken=exports.getUserById=exports.getCartId=exports.createUserByEmail=void 0;const nodeUtils_1=require("../utils/nodeUtils"),loginUtils_1=require("./loginUtils"),cartUtils_1=require("./cartUtils"),httpCodes_1=__importDefault(require("../utils/httpCodes")),validate_1=__importDefault(require("../microservices/customer/middleware/validate")),user_1=__importDefault(require("../microservices/customer/controllers/user")),login_1=__importDefault(require("../microservices/customer/controllers/login"));async function getCartId(user,token){const{email:email,cart_id:cart_id}=user;if(cart_id)return cart_id;const userInfo=await getUserByToken(email,token);return null==userInfo?void 0:userInfo.cart_id}async function getUserById(userID){try{if(!userID)throw new Error("ERROR: user id is required");const user=undefined;return await user_1.default.getOne({_id:userID})}catch(error){}}async function getUserByToken(email,token){validate_1.default.email(email),validate_1.default.token(token);const emailHash=(0,nodeUtils_1.hash)(email),result=await login_1.default.getOne({emailHash:emailHash,token:token}),user=await user_1.default.getOne({_id:result.user_id});if(!user)throw new Error("ERROR: Unable to get user by token");return user}async function getUserByPassword(email,password){validate_1.default.email(email),validate_1.default.password(password);const user_id=await(0,loginUtils_1.getUserIdByPassword)(email,password);if(!user_id){const error=new Error("ERROR: invalid email or password");throw error.code=httpCodes_1.default.error.incorrectCredentials,error}const user=undefined;return await getUserById(user_id)}async function deleteUserById(id){try{if(!id)throw new Error("ERROR: user id is required");const results=undefined;return await user_1.default.deleteOne({_id:id})}catch(foreignKeyConstraint){throw new Error("ERROR: must delete user cart and user login before deleting user")}}async function createUserByEmail(email,name=""){validate_1.default.email(email);const user={};user.email=email,user.name=name,user.cart_id=await(0,cartUtils_1.createCart)();const result=await user_1.default.addOne(user);return user._id=result.insertedId,user}exports.getCartId=getCartId,exports.getUserById=getUserById,exports.getUserByToken=getUserByToken,exports.getUserByPassword=getUserByPassword,exports.deleteUserById=deleteUserById,exports.createUserByEmail=createUserByEmail;