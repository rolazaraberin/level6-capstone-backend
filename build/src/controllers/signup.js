"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const sendEmail_1=__importDefault(require("./sendEmail")),dotenv_1=__importDefault(require("dotenv")),accountUtils_1=require("./accountUtils"),errorUtils_1=require("../utils/errorUtils"),verify_1=__importDefault(require("../microservices/customer/middleware/verify")),signup={withPassword:withPassword,withGoogle:withGoogle};exports.default=signup,dotenv_1.default.config();const disableEmails=process.env.disableEmails;async function withPassword(request,response,_next){try{const{email:email,password:password}=request.body;await verify_1.default.signupEmail(email);const{user:user,token:token}=await(0,accountUtils_1.createAccountByPassword)(email,password);response.status(200).send({email:user.email,token:token}),"true"!==disableEmails&&sendEmail_1.default.signupConfirmation(email)}catch(asyncError){const{error:error,code:code,message:message}=await(0,errorUtils_1.handleAsyncError)(asyncError);response.status(code).send(message)}}async function withGoogle(request,response,next){try{const{email:email,name:name,googleId:googleId}=request.body;if(!googleId)return next();await verify_1.default.signupEmail(email);const{user:user,token:token}=await(0,accountUtils_1.createAccountByGoogle)(email,name,googleId);response.status(200).send({email:user.email,token:token}),"true"!==disableEmails&&sendEmail_1.default.signupConfirmation(email)}catch(asyncError){const{error:error,code:code,message:message}=await(0,errorUtils_1.handleAsyncError)(asyncError);response.status(code).send(message)}}