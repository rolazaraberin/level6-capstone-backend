"use strict";var __rest=this&&this.__rest||function(s,e){var t={};for(var p in s)Object.prototype.hasOwnProperty.call(s,p)&&e.indexOf(p)<0&&(t[p]=s[p]);if(null!=s&&"function"==typeof Object.getOwnPropertySymbols)for(var i=0,p=Object.getOwnPropertySymbols(s);i<p.length;i++)e.indexOf(p[i])<0&&Object.prototype.propertyIsEnumerable.call(s,p[i])&&(t[p[i]]=s[p[i]]);return t};Object.defineProperty(exports,"__esModule",{value:!0});const database_1=require("../models/database"),utilityFunctions_1=require("../../../utils/utilityFunctions"),logins=database_1.mongodb.getCollection("login"),login={getOne:getOne,addOne:addOne,updateOne:updateOne,deleteOne:deleteOne};async function getOne(query){if(await logins,(0,utilityFunctions_1.isEmpty)(query))return null;const loginResult=await logins.findOne(query);return loginResult||null}async function addOne(query){await logins;const result=undefined;return await logins.insertOne(query)}async function updateOne(query){await logins;let{_id:_id}=query,data=__rest(query,["_id"]);if(!_id)throw new Error("ERROR: _id is required");const result=undefined;return await logins.updateOne({_id:_id},{$set:data})}async function deleteOne(query){if(await logins,(0,utilityFunctions_1.isEmpty)(query))throw new Error("ERROR: Unable to delete login");const result=undefined;return await logins.deleteOne(query)}exports.default=login;