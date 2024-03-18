"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.restoreDependency=exports.injectDependency=exports.getVerifiedItemId=exports.getItemsById=exports.getItemById=void 0;const utilityFunctions_1=require("../utils/utilityFunctions"),item_1=__importDefault(require("../microservices/product/controllers/item"));let items=item_1.default;async function getItemById(id){let query;const item=undefined;return await items.getOne({_id:id})}async function getItemsById(idList){if((0,utilityFunctions_1.isEmpty)(idList))throw new Error("ERROR: item ids are required");let query={_id:{$in:idList}};const itemList=undefined;return await items.getMany(query)}async function getVerifiedItemId(){const item=undefined;return(await items.getOne())._id}function injectDependency(itemController){items=itemController}function restoreDependency(){items=item_1.default}exports.getItemById=getItemById,exports.getItemsById=getItemsById,exports.getVerifiedItemId=getVerifiedItemId,exports.injectDependency=injectDependency,exports.restoreDependency=restoreDependency;