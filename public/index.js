/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./build/src/controllers/accountUtils.js":
/*!***********************************************!*\
  !*** ./build/src/controllers/accountUtils.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.getAccountById = exports.getAccountByToken = exports.deleteAccountById = exports.deleteAccountByToken = exports.deleteAccountByPassword = exports.createAccountByGoogle = exports.createAccountByPassword = void 0;
const cartUtils_1 = __webpack_require__(/*! ./cartUtils */ "./build/src/controllers/cartUtils.js"),
  dbToken_1 = __importDefault(__webpack_require__(/*! ./dbToken */ "./build/src/controllers/dbToken.js")),
  loginUtils_1 = __webpack_require__(/*! ./loginUtils */ "./build/src/controllers/loginUtils.js"),
  httpCodes_1 = __importDefault(__webpack_require__(/*! ../utils/httpCodes */ "./build/src/utils/httpCodes.js")),
  userUtils_1 = __webpack_require__(/*! ./userUtils */ "./build/src/controllers/userUtils.js");
async function createAccountByPassword(email, password) {
  const userResult = undefined,
    user = await (0, userUtils_1.createUserByEmail)(email);
  await (0, loginUtils_1.createLoginByPassword)(email, password, user);
  const token = dbToken_1.default.getNew(email);
  return await dbToken_1.default.save(email, token), {
    user: user,
    token: token
  };
}
async function createAccountByGoogle(email, name, googleId) {
  const userResult = undefined,
    user = await (0, userUtils_1.createUserByEmail)(email, name);
  await (0, loginUtils_1.createLoginByGoogle)(email, user._id, googleId);
  const token = dbToken_1.default.getNew(email);
  return await dbToken_1.default.save(email, token), {
    user: user,
    token: token
  };
}
async function deleteAccount(cartId, email, userId) {
  await (0, cartUtils_1.deleteCartById)(cartId), await (0, loginUtils_1.deleteLoginByEmail)(email), await (0, userUtils_1.deleteUserById)(userId);
}
async function deleteAccountById(userId) {
  const user = await (0, userUtils_1.getUserById)(userId);
  if (!user) {
    const error = new Error("ERROR: invalid user id");
    throw error.code = httpCodes_1.default.error.badRequest, error;
  }
  await deleteAccount(user.cart_id, user.email, userId);
}
async function deleteAccountByPassword(email, password) {
  const user = await (0, userUtils_1.getUserByPassword)(email, password);
  if (!user) {
    const error = new Error("ERROR: incorrect password");
    throw error.code = httpCodes_1.default.error.incorrectPassword, error;
  }
  await deleteAccount(user.cart_id, email, user._id);
}
async function deleteAccountByToken(email, token) {
  const user = await (0, userUtils_1.getUserByToken)(email, token);
  if (!user) {
    const error = new Error("ERROR: invalid token");
    throw error.code = httpCodes_1.default.error.incorrectCredentials, error;
  }
  await deleteAccount(user.cart_id, email, user._id);
}
async function getAccountByToken(email, token) {
  const user = await (0, userUtils_1.getUserByToken)(email, token),
    account = await getAccountById(user._id);
  return account && (account.token = token), account;
}
async function getAccountById(userID) {
  const account = await (0, userUtils_1.getUserById)(userID);
  return account.cart = await (0, cartUtils_1.getCartById)(account.cart_id), account;
}
exports.createAccountByPassword = createAccountByPassword, exports.createAccountByGoogle = createAccountByGoogle, exports.deleteAccountById = deleteAccountById, exports.deleteAccountByPassword = deleteAccountByPassword, exports.deleteAccountByToken = deleteAccountByToken, exports.getAccountByToken = getAccountByToken, exports.getAccountById = getAccountById;

/***/ }),

/***/ "./build/src/controllers/api.js":
/*!**************************************!*\
  !*** ./build/src/controllers/api.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const httpCodes_1 = __importDefault(__webpack_require__(/*! ../utils/httpCodes */ "./build/src/utils/httpCodes.js")),
  userUtils_1 = __webpack_require__(/*! ./userUtils */ "./build/src/controllers/userUtils.js"),
  api = {
    ping: ping
  };
async function ping(_request, response) {
  try {
    const fakeId = {};
    await (0, userUtils_1.getUserById)(fakeId), response.send("API ready");
  } catch (asyncError) {
    const error = await asyncError;
    error.message = "ERROR: API not ready. Try again.";
    const code = httpCodes_1.default.error.serverError;
    response.status(code).send(error);
  }
}
exports["default"] = api;

/***/ }),

/***/ "./build/src/controllers/authenticate.js":
/*!***********************************************!*\
  !*** ./build/src/controllers/authenticate.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const httpCodes_1 = __importDefault(__webpack_require__(/*! ../utils/httpCodes */ "./build/src/utils/httpCodes.js")),
  nodeUtils_1 = __webpack_require__(/*! ../utils/nodeUtils */ "./build/src/utils/nodeUtils.js"),
  utilityFunctions_1 = __webpack_require__(/*! ../utils/utilityFunctions */ "./build/src/utils/utilityFunctions.js"),
  login_1 = __importDefault(__webpack_require__(/*! ../microservices/customer/controllers/login */ "./build/src/microservices/customer/controllers/login.js")),
  authenticate = {
    cart: cart,
    password: password,
    token: token,
    google: google
  };
async function cart(cart_id, user, token) {
  if (!cart_id) throw new Error("ERROR: invalid cart id");
  const result = await authenticate.token(user.email, token),
    {
      user_id: user_id
    } = result;
  if (user._id !== user_id) {
    const error = new Error("ERROR: forbidden access to cart");
    throw error.code = httpCodes_1.default.error.forbiddenUser, error;
  }
}
async function password(email, password) {
  if (!email || !password) {
    const error = new Error("ERROR: email and password must be provided");
    throw error.code = httpCodes_1.default.error.unauthenticated, error;
  }
  const emailHash = (0, nodeUtils_1.hash)(email),
    passwordHash = (0, nodeUtils_1.hash)(password),
    result = await login_1.default.getOne({
      emailHash: emailHash,
      passwordHash: passwordHash
    });
  if (!result) {
    const error = new Error("ERROR: Incorrect email or password");
    throw error.code = httpCodes_1.default.error.unauthenticated, error;
  }
  const {
    user_id: user_id,
    token: token
  } = result;
  return {
    user_id: user_id,
    token: token
  };
}
async function token(email, token) {
  if ((0, utilityFunctions_1.isEmpty)(email) || (0, utilityFunctions_1.isEmpty)(token)) {
    const error = new Error("ERROR: incorrect email or token");
    throw error.code = httpCodes_1.default.error.unauthenticated, error;
  }
  const emailHash = (0, nodeUtils_1.hash)(email);
  if (!emailHash) {
    const error = new Error("ERROR: Invalid email or token");
    throw error.code = httpCodes_1.default.error.unauthenticated, error;
  }
  const result = undefined;
  return await login_1.default.getOne({
    emailHash: emailHash,
    token: token
  });
}
async function google(email, googleId) {
  if ((0, utilityFunctions_1.isEmpty)(email) || (0, utilityFunctions_1.isEmpty)(googleId)) {
    const error = new Error("ERROR: incorrect email or id");
    throw error.code = httpCodes_1.default.error.unauthenticated, error;
  }
  const emailHash = (0, nodeUtils_1.hash)(email);
  if (!emailHash) {
    const error = new Error("ERROR: Invalid email or token");
    throw error.code = httpCodes_1.default.error.unauthenticated, error;
  }
  const result = await login_1.default.getOne({
    emailHash: emailHash,
    googleId: googleId
  });
  if (!result) {
    const error = new Error("ERROR: An account with that email was not found.");
    throw error.code = httpCodes_1.default.error.unauthenticated, error;
  }
  return result;
}
exports["default"] = authenticate;

/***/ }),

/***/ "./build/src/controllers/cartUtils.js":
/*!********************************************!*\
  !*** ./build/src/controllers/cartUtils.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.updateCart = exports.setCart = exports.removeItemFromCart = exports.getItemsByCart = exports.createCart = exports.deleteCartById = exports.getCartByUser = exports.getCartByToken = exports.getCartById = void 0;
const userUtils_1 = __webpack_require__(/*! ./userUtils */ "./build/src/controllers/userUtils.js"),
  cart_1 = __importDefault(__webpack_require__(/*! ../microservices/product/controllers/cart */ "./build/src/microservices/product/controllers/cart.js")),
  item_1 = __importDefault(__webpack_require__(/*! ../microservices/product/controllers/item */ "./build/src/microservices/product/controllers/item.js")),
  validate_1 = __importDefault(__webpack_require__(/*! ../microservices/product/middleware/validate */ "./build/src/microservices/product/middleware/validate.js")),
  utilityFunctions_1 = __webpack_require__(/*! ../utils/utilityFunctions */ "./build/src/utils/utilityFunctions.js");
async function getCartById(id) {
  validate_1.default.cart_id(id);
  const result = undefined,
    cart = await cart_1.default.getOne({
      _id: id
    });
  if (!cart) throw new Error("ERROR: Unable to get cart by id");
  return validate_1.default.cart(cart), cart.items = await getItemsByCart(cart), cart;
}
async function getCartByToken(email, token) {
  const user = await (0, userUtils_1.getUserByToken)(email, token);
  return await getCartById(user.cart_id);
}
async function getCartByUser(user) {
  const foreignKey = user.cart_id;
  if (!foreignKey) throw new Error("ERROR: missing user cart information");
  const cart = undefined;
  return await getCartById(foreignKey);
}
async function deleteCartById(id) {
  const cart = await getCartById(id),
    result = undefined;
  return await cart_1.default.deleteOne({
    _id: id
  });
}
async function createCart() {
  const result = undefined,
    _id = undefined;
  return (await cart_1.default.addOne()).insertedId;
}
async function getItemsByCart(cart) {
  const {
    item_ids: item_ids
  } = cart;
  if ((0, utilityFunctions_1.isEmpty)(item_ids)) return [];
  const result = undefined;
  return await item_1.default.getOne({
    _id: {
      $all: cart.item_ids
    }
  });
}
async function removeItemFromCart(cart, item) {
  validate_1.default.cart(cart), validate_1.default.item(item);
  const query = {
      _id: cart._id,
      $pull: {
        items: item._id
      }
    },
    cartResult = await cart_1.default.updateOne(query),
    result = undefined;
  return await getCartById(null == cart ? void 0 : cart._id);
}
async function setCart(cart, item_ids) {
  const query = Object.assign(Object.assign({}, cart), {
      item_ids: item_ids
    }),
    result = await cart_1.default.updateOne(query);
  return "SUCCESS: cart updated";
}
async function updateCart(cart, item) {
  const {
      item_ids: item_ids
    } = cart,
    {
      _id: _id
    } = item,
    query = Object.assign({}, cart),
    cartResult = await cart_1.default.updateOne(query),
    result = undefined;
  return await getCartById(cart._id);
}
exports.getCartById = getCartById, exports.getCartByToken = getCartByToken, exports.getCartByUser = getCartByUser, exports.deleteCartById = deleteCartById, exports.createCart = createCart, exports.getItemsByCart = getItemsByCart, exports.removeItemFromCart = removeItemFromCart, exports.setCart = setCart, exports.updateCart = updateCart;

/***/ }),

/***/ "./build/src/controllers/dbToken.js":
/*!******************************************!*\
  !*** ./build/src/controllers/dbToken.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const utilityFunctions_1 = __webpack_require__(/*! ../utils/utilityFunctions */ "./build/src/utils/utilityFunctions.js"),
  nodeUtils_1 = __webpack_require__(/*! ../utils/nodeUtils */ "./build/src/utils/nodeUtils.js"),
  login_1 = __importDefault(__webpack_require__(/*! ../microservices/customer/controllers/login */ "./build/src/microservices/customer/controllers/login.js")),
  dbToken = {
    invalidate: invalidate,
    revoke: invalidateGoogle,
    getNew: getNew,
    save: save
  };
async function invalidate(loginId) {
  const query = {
      _id: loginId,
      token: ""
    },
    result = undefined;
  return await login_1.default.updateOne(query);
}
async function invalidateGoogle(loginId) {
  const query = {
      _id: loginId,
      token: "",
      accessToken: "",
      revokeToken: ""
    },
    result = undefined;
  return await login_1.default.updateOne(query);
}
function getNew(email) {
  const token = undefined;
  return (0, nodeUtils_1.hash)(email + (0, utilityFunctions_1.generateKey)());
}
async function save(email, token, accessToken, revokeToken) {
  const emailHash = (0, nodeUtils_1.hash)(email),
    loginResult = await login_1.default.getOne({
      emailHash: emailHash
    }),
    {
      _id: _id
    } = loginResult,
    updateInfo = {
      _id: _id,
      token: token
    };
  accessToken && (updateInfo.accessToken = accessToken), revokeToken && (updateInfo.revokeToken = revokeToken);
  const result = undefined;
  return await login_1.default.updateOne(updateInfo);
}
exports["default"] = dbToken;

/***/ }),

/***/ "./build/src/controllers/inventoryUtils.js":
/*!*************************************************!*\
  !*** ./build/src/controllers/inventoryUtils.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.restoreDependencies = exports.injectDependencies = exports.getInventory = void 0;
const inventory_1 = __importDefault(__webpack_require__(/*! ../microservices/product/controllers/inventory */ "./build/src/microservices/product/controllers/inventory.js")),
  itemUtils_1 = __webpack_require__(/*! ./itemUtils */ "./build/src/controllers/itemUtils.js");
let inventories = inventory_1.default;
async function getInventory() {
  const inventoryResult = undefined,
    inventory = await inventories.getOne(),
    itemResults = undefined,
    itemList = await (0, itemUtils_1.getItemsById)(inventory.item_ids),
    inventoryEnhanced = undefined;
  return Object.assign(Object.assign({}, inventory), {
    items: itemList
  });
}
function injectDependencies(inventoryController, itemController) {
  inventories = inventoryController, (0, itemUtils_1.injectDependency)(itemController);
}
function restoreDependencies() {
  inventories = inventory_1.default, (0, itemUtils_1.restoreDependency)();
}
exports.getInventory = getInventory, exports.injectDependencies = injectDependencies, exports.restoreDependencies = restoreDependencies;

/***/ }),

/***/ "./build/src/controllers/itemUtils.js":
/*!********************************************!*\
  !*** ./build/src/controllers/itemUtils.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.restoreDependency = exports.injectDependency = exports.getVerifiedItemId = exports.getItemsById = exports.getItemById = void 0;
const utilityFunctions_1 = __webpack_require__(/*! ../utils/utilityFunctions */ "./build/src/utils/utilityFunctions.js"),
  item_1 = __importDefault(__webpack_require__(/*! ../microservices/product/controllers/item */ "./build/src/microservices/product/controllers/item.js"));
let items = item_1.default;
async function getItemById(id) {
  let query;
  const item = undefined;
  return await items.getOne({
    _id: id
  });
}
async function getItemsById(idList) {
  if ((0, utilityFunctions_1.isEmpty)(idList)) throw new Error("ERROR: item ids are required");
  let query = {
    _id: {
      $in: idList
    }
  };
  const itemList = undefined;
  return await items.getMany(query);
}
async function getVerifiedItemId() {
  const item = undefined;
  return (await items.getOne())._id;
}
function injectDependency(itemController) {
  items = itemController;
}
function restoreDependency() {
  items = item_1.default;
}
exports.getItemById = getItemById, exports.getItemsById = getItemsById, exports.getVerifiedItemId = getVerifiedItemId, exports.injectDependency = injectDependency, exports.restoreDependency = restoreDependency;

/***/ }),

/***/ "./build/src/controllers/login.js":
/*!****************************************!*\
  !*** ./build/src/controllers/login.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const authenticate_1 = __importDefault(__webpack_require__(/*! ./authenticate */ "./build/src/controllers/authenticate.js")),
  dbToken_1 = __importDefault(__webpack_require__(/*! ./dbToken */ "./build/src/controllers/dbToken.js")),
  errorUtils_1 = __webpack_require__(/*! ../utils/errorUtils */ "./build/src/utils/errorUtils.js"),
  verify_1 = __importDefault(__webpack_require__(/*! ../microservices/customer/middleware/verify */ "./build/src/microservices/customer/middleware/verify.js")),
  login = {
    withToken: withToken,
    withPassword: withPassword,
    withGoogle: withGoogle
  };
async function withPassword(request, response) {
  const {
    email: email,
    password: password
  } = request.body;
  try {
    verify_1.default.loginAttempts(email);
    const {
        token: token
      } = await authenticate_1.default.password(email, password),
      authInfo = {
        email: email,
        token: token,
        isTemporary: !1
      };
    token || (authInfo.token = dbToken_1.default.getNew(email), await dbToken_1.default.save(email, authInfo.token)), response.status(200).send(authInfo);
  } catch (asyncError) {
    const {
      error: error,
      code: code,
      message: message
    } = await (0, errorUtils_1.handleAsyncError)(asyncError);
    response.status(code).send(message);
  }
}
async function withToken(request, response, next) {
  const {
    email: email,
    token: token
  } = request.body;
  if (!token) return next();
  try {
    const loginInfo = await authenticate_1.default.token(email, token);
    if (!loginInfo) return response.status(401).send("ERROR: Invalid email or token");
    const data = {
      email: email,
      token: token,
      isTemporary: !1,
      googleId: loginInfo.googleId
    };
    response.status(200).send(data);
  } catch (asyncError) {
    const {
      error: error,
      code: code,
      message: message
    } = await (0, errorUtils_1.handleAsyncError)(asyncError);
    response.status(code).send(message);
  }
}
async function withGoogle(request, response, next) {
  try {
    const {
      email: email,
      googleId: googleId
    } = request.body;
    if (!googleId) return next();
    const {
        token: token
      } = await authenticate_1.default.google(email, googleId),
      authInfo = {
        email: email,
        token: token,
        isTemporary: !1
      };
    token || (authInfo.token = dbToken_1.default.getNew(email), await dbToken_1.default.save(email, authInfo.token)), response.status(200).send(authInfo);
  } catch (asyncError) {
    const {
      error: error,
      code: code,
      message: message
    } = await (0, errorUtils_1.handleAsyncError)(asyncError);
    response.status(code).send(message);
  }
}
exports["default"] = login;

/***/ }),

/***/ "./build/src/controllers/loginUtils.js":
/*!*********************************************!*\
  !*** ./build/src/controllers/loginUtils.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.loginWithToken = exports.loginWithPassword = exports.deleteLoginByEmail = exports.getUserIdByPassword = exports.createLoginByGoogle = exports.createLoginByPassword = void 0;
const nodeUtils_1 = __webpack_require__(/*! ../utils/nodeUtils */ "./build/src/utils/nodeUtils.js"),
  dbToken_1 = __importDefault(__webpack_require__(/*! ./dbToken */ "./build/src/controllers/dbToken.js")),
  validate_1 = __importDefault(__webpack_require__(/*! ../microservices/customer/middleware/validate */ "./build/src/microservices/customer/middleware/validate.js")),
  verify_1 = __importDefault(__webpack_require__(/*! ../microservices/customer/middleware/verify */ "./build/src/microservices/customer/middleware/verify.js")),
  login_1 = __importDefault(__webpack_require__(/*! ../microservices/customer/controllers/login */ "./build/src/microservices/customer/controllers/login.js")),
  user_1 = __importDefault(__webpack_require__(/*! ../microservices/customer/controllers/user */ "./build/src/microservices/customer/controllers/user.js")),
  userUtils_1 = __webpack_require__(/*! ./userUtils */ "./build/src/controllers/userUtils.js");
async function createLoginByPassword(email, password, user) {
  validate_1.default.email(email), validate_1.default.password(password), validate_1.default.user(user, "ERROR: user is required"), await verify_1.default.signupEmail(email);
  const emailHash = (0, nodeUtils_1.hash)(email),
    passwordHash = (0, nodeUtils_1.hash)(password),
    user_id = user._id,
    loginResult = undefined;
  return await login_1.default.addOne({
    emailHash: emailHash,
    passwordHash: passwordHash,
    user_id: user_id
  });
}
async function createLoginByGoogle(email, user_id, googleId) {
  validate_1.default.email(email), validate_1.default.userId(user_id, "ERROR: userId is required"), await verify_1.default.signupEmail(email);
  const emailHash = (0, nodeUtils_1.hash)(email),
    loginResult = undefined;
  return await login_1.default.addOne({
    emailHash: emailHash,
    user_id: user_id,
    googleId: googleId
  });
}
async function deleteLoginByEmail(email) {
  validate_1.default.email(email);
  const emailHash = (0, nodeUtils_1.hash)(email),
    result = undefined;
  return await login_1.default.deleteOne({
    emailHash: emailHash
  });
}
async function getUserIdByPassword(email, password) {
  validate_1.default.email(email), validate_1.default.password(password);
  const emailHash = (0, nodeUtils_1.hash)(email),
    passwordHash = (0, nodeUtils_1.hash)(password),
    result = await login_1.default.getOne({
      emailHash: emailHash,
      passwordHash: passwordHash
    }),
    user_id = undefined;
  return null == result ? void 0 : result.user_id;
}
async function loginWithPassword(email, password) {
  validate_1.default.email(email), validate_1.default.password(password);
  const emailHash = (0, nodeUtils_1.hash)(email),
    passwordHash = (0, nodeUtils_1.hash)(password),
    result = await login_1.default.getOne({
      emailHash: emailHash,
      passwordHash: passwordHash
    });
  let token = null == result ? void 0 : result.token;
  token || (token = dbToken_1.default.getNew(email), await dbToken_1.default.save(email, token));
  const userResult = await user_1.default.getOne({
    _id: result.user_id
  });
  if (!userResult) throw new Error("ERROR: invalid login");
  const user = undefined;
  return {
    user: userResult,
    token: token
  };
}
async function loginWithToken(email, token) {
  validate_1.default.email(email), validate_1.default.token(token);
  const emailHash = (0, nodeUtils_1.hash)(email),
    login = await login_1.default.getOne({
      emailHash: emailHash,
      token: token
    });
  if (!login) throw new Error("ERROR: invalid login");
  const {
      user_id: user_id
    } = login,
    user = undefined;
  return await (0, userUtils_1.getUserById)(user_id);
}
exports.createLoginByPassword = createLoginByPassword, exports.createLoginByGoogle = createLoginByGoogle, exports.deleteLoginByEmail = deleteLoginByEmail, exports.getUserIdByPassword = getUserIdByPassword, exports.loginWithPassword = loginWithPassword, exports.loginWithToken = loginWithToken;

/***/ }),

/***/ "./build/src/controllers/logout.js":
/*!*****************************************!*\
  !*** ./build/src/controllers/logout.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const authenticate_1 = __importDefault(__webpack_require__(/*! ./authenticate */ "./build/src/controllers/authenticate.js")),
  dbToken_1 = __importDefault(__webpack_require__(/*! ./dbToken */ "./build/src/controllers/dbToken.js")),
  errorUtils_1 = __webpack_require__(/*! ../utils/errorUtils */ "./build/src/utils/errorUtils.js"),
  logout = {
    withToken: withToken
  };
async function withToken(request, response) {
  try {
    const {
        email: email,
        token: token
      } = request.body,
      result = await authenticate_1.default.token(email, token),
      {
        _id: _id
      } = result;
    await dbToken_1.default.invalidate(_id), response.status(200).send("SUCCESS: logged out");
  } catch (asyncError) {
    const {
      error: error,
      code: code,
      message: message
    } = await (0, errorUtils_1.handleAsyncError)(asyncError);
    response.status(code).send(message);
  }
}
exports["default"] = logout;

/***/ }),

/***/ "./build/src/controllers/sendEmail.js":
/*!********************************************!*\
  !*** ./build/src/controllers/sendEmail.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const mail_1 = __importDefault(__webpack_require__(/*! @sendgrid/mail */ "@sendgrid/mail")),
  dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ "dotenv")),
  errorUtils_1 = __webpack_require__(/*! ../utils/errorUtils */ "./build/src/utils/errorUtils.js");
dotenv_1.default.config();
const sendEmail = {
  signupConfirmation: signupConfirmation,
  deleteConfirmation: deleteConfirmation
};
function signupConfirmation(email) {
  if (isTestEmail(email)) return;
  const message = undefined;
  send({
    from: "rolazaraberin.test@gmail.com",
    to: email,
    subject: "Signup Confirmation",
    text: `${email} has been signed up for Online Store`,
    html: `<p>${email} has been signed up for Online Store</p>`
  });
}
function deleteConfirmation(email) {
  if (isTestEmail(email)) return;
  const message = undefined;
  send({
    from: "rolazaraberin.test@gmail.com",
    to: email,
    subject: "Delete Confirmation",
    text: `${email} has been deleted from Online Store`,
    html: `<p>${email} has been deleted from Online Store</p>`
  });
}
async function send(message) {
  try {
    const result = undefined;
    return (await mail_1.default.send(message))[0].statusCode;
  } catch (asyncError) {
    const {
      error: error,
      code: code,
      message: message
    } = await (0, errorUtils_1.handleAsyncError)(asyncError);
    console.log(error);
  }
}
function isTestEmail(email) {
  switch (email) {
    case "new@email.com":
    case "temp@email.com":
    case "temporary@email.com":
    case "correct@email.com":
    case "permanent@email.com":
      return !0;
  }
  return !1;
}
exports["default"] = sendEmail, mail_1.default.setApiKey("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");

/***/ }),

/***/ "./build/src/controllers/signup.js":
/*!*****************************************!*\
  !*** ./build/src/controllers/signup.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const sendEmail_1 = __importDefault(__webpack_require__(/*! ./sendEmail */ "./build/src/controllers/sendEmail.js")),
  dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ "dotenv")),
  accountUtils_1 = __webpack_require__(/*! ./accountUtils */ "./build/src/controllers/accountUtils.js"),
  errorUtils_1 = __webpack_require__(/*! ../utils/errorUtils */ "./build/src/utils/errorUtils.js"),
  verify_1 = __importDefault(__webpack_require__(/*! ../microservices/customer/middleware/verify */ "./build/src/microservices/customer/middleware/verify.js")),
  signup = {
    withPassword: withPassword,
    withGoogle: withGoogle
  };
exports["default"] = signup, dotenv_1.default.config();
const disableEmails = "true";
async function withPassword(request, response, _next) {
  try {
    const {
      email: email,
      password: password
    } = request.body;
    await verify_1.default.signupEmail(email);
    const {
      user: user,
      token: token
    } = await (0, accountUtils_1.createAccountByPassword)(email, password);
    response.status(200).send({
      email: user.email,
      token: token
    }), "true" !== disableEmails && sendEmail_1.default.signupConfirmation(email);
  } catch (asyncError) {
    const {
      error: error,
      code: code,
      message: message
    } = await (0, errorUtils_1.handleAsyncError)(asyncError);
    response.status(code).send(message);
  }
}
async function withGoogle(request, response, next) {
  try {
    const {
      email: email,
      name: name,
      googleId: googleId
    } = request.body;
    if (!googleId) return next();
    await verify_1.default.signupEmail(email);
    const {
      user: user,
      token: token
    } = await (0, accountUtils_1.createAccountByGoogle)(email, name, googleId);
    response.status(200).send({
      email: user.email,
      token: token
    }), "true" !== disableEmails && sendEmail_1.default.signupConfirmation(email);
  } catch (asyncError) {
    const {
      error: error,
      code: code,
      message: message
    } = await (0, errorUtils_1.handleAsyncError)(asyncError);
    response.status(code).send(message);
  }
}

/***/ }),

/***/ "./build/src/controllers/user.js":
/*!***************************************!*\
  !*** ./build/src/controllers/user.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const sendEmail_1 = __importDefault(__webpack_require__(/*! ./sendEmail */ "./build/src/controllers/sendEmail.js")),
  dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ "dotenv")),
  errorUtils_1 = __webpack_require__(/*! ../utils/errorUtils */ "./build/src/utils/errorUtils.js"),
  accountUtils_1 = __webpack_require__(/*! ./accountUtils */ "./build/src/controllers/accountUtils.js"),
  user = {
    fetchInfo: fetchInfo,
    delete: del
  };
exports["default"] = user, dotenv_1.default.config();
const disableEmails = "true";
async function fetchInfo(request, response) {
  try {
    const {
        email: email,
        token: token
      } = request.body,
      account = await (0, accountUtils_1.getAccountByToken)(email, token);
    if (!account) return response.status(401).send("ERROR: Cannot retrieve account");
    response.status(200).send(account);
  } catch (asyncError) {
    const {
      error: error,
      message: message,
      code: code
    } = await (0, errorUtils_1.handleAsyncError)(asyncError);
    response.status(code).send(message);
  }
}
async function del(request, response) {
  try {
    const {
      email: email,
      password: password,
      token: token
    } = request.body;
    password ? await (0, accountUtils_1.deleteAccountByPassword)(email, password) : token && (await (0, accountUtils_1.deleteAccountByToken)(email, token)), response.status(200).send("SUCCESS: Account deleted"), "true" !== disableEmails && sendEmail_1.default.deleteConfirmation(email);
  } catch (asyncError) {
    const {
      error: error,
      message: message,
      code: code
    } = await (0, errorUtils_1.handleAsyncError)(asyncError);
    response.status(code).send(message);
  }
}

/***/ }),

/***/ "./build/src/controllers/userUtils.js":
/*!********************************************!*\
  !*** ./build/src/controllers/userUtils.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.deleteUserById = exports.getUserByPassword = exports.getUserByToken = exports.getUserById = exports.getCartId = exports.createUserByEmail = void 0;
const nodeUtils_1 = __webpack_require__(/*! ../utils/nodeUtils */ "./build/src/utils/nodeUtils.js"),
  loginUtils_1 = __webpack_require__(/*! ./loginUtils */ "./build/src/controllers/loginUtils.js"),
  cartUtils_1 = __webpack_require__(/*! ./cartUtils */ "./build/src/controllers/cartUtils.js"),
  httpCodes_1 = __importDefault(__webpack_require__(/*! ../utils/httpCodes */ "./build/src/utils/httpCodes.js")),
  validate_1 = __importDefault(__webpack_require__(/*! ../microservices/customer/middleware/validate */ "./build/src/microservices/customer/middleware/validate.js")),
  user_1 = __importDefault(__webpack_require__(/*! ../microservices/customer/controllers/user */ "./build/src/microservices/customer/controllers/user.js")),
  login_1 = __importDefault(__webpack_require__(/*! ../microservices/customer/controllers/login */ "./build/src/microservices/customer/controllers/login.js"));
async function getCartId(user, token) {
  const {
    email: email,
    cart_id: cart_id
  } = user;
  if (cart_id) return cart_id;
  const userInfo = await getUserByToken(email, token);
  return null == userInfo ? void 0 : userInfo.cart_id;
}
async function getUserById(userID) {
  try {
    if (!userID) throw new Error("ERROR: user id is required");
    const user = undefined;
    return await user_1.default.getOne({
      _id: userID
    });
  } catch (error) {}
}
async function getUserByToken(email, token) {
  validate_1.default.email(email), validate_1.default.token(token);
  const emailHash = (0, nodeUtils_1.hash)(email),
    result = await login_1.default.getOne({
      emailHash: emailHash,
      token: token
    }),
    user = await user_1.default.getOne({
      _id: result.user_id
    });
  if (!user) throw new Error("ERROR: Unable to get user by token");
  return user;
}
async function getUserByPassword(email, password) {
  validate_1.default.email(email), validate_1.default.password(password);
  const user_id = await (0, loginUtils_1.getUserIdByPassword)(email, password);
  if (!user_id) {
    const error = new Error("ERROR: invalid email or password");
    throw error.code = httpCodes_1.default.error.incorrectCredentials, error;
  }
  const user = undefined;
  return await getUserById(user_id);
}
async function deleteUserById(id) {
  try {
    if (!id) throw new Error("ERROR: user id is required");
    const results = undefined;
    return await user_1.default.deleteOne({
      _id: id
    });
  } catch (foreignKeyConstraint) {
    throw new Error("ERROR: must delete user cart and user login before deleting user");
  }
}
async function createUserByEmail(email, name = "") {
  validate_1.default.email(email);
  const user = {};
  user.email = email, user.name = name, user.cart_id = await (0, cartUtils_1.createCart)();
  const result = await user_1.default.addOne(user);
  return user._id = result.insertedId, user;
}
exports.getCartId = getCartId, exports.getUserById = getUserById, exports.getUserByToken = getUserByToken, exports.getUserByPassword = getUserByPassword, exports.deleteUserById = deleteUserById, exports.createUserByEmail = createUserByEmail;

/***/ }),

/***/ "./build/src/index.js":
/*!****************************!*\
  !*** ./build/src/index.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), __webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const express_1 = __importDefault(__webpack_require__(/*! express */ "express")),
  cors_1 = __importDefault(__webpack_require__(/*! cors */ "cors")),
  router_1 = __importDefault(__webpack_require__(/*! ./routes/router */ "./build/src/routes/router.js")),
  item_graphql_1 = __importDefault(__webpack_require__(/*! ./microservices/product/controllers/item.graphql */ "./build/src/microservices/product/controllers/item.graphql.js")),
  inventory_graphql_1 = __importDefault(__webpack_require__(/*! ./microservices/product/controllers/inventory.graphql */ "./build/src/microservices/product/controllers/inventory.graphql.js")),
  inventoryUtils_1 = __webpack_require__(/*! ./controllers/inventoryUtils */ "./build/src/controllers/inventoryUtils.js"),
  isDockerEnvironment_1 = __webpack_require__(/*! ./utils/generalUtils/isDockerEnvironment */ "./build/src/utils/generalUtils/isDockerEnvironment.js"),
  dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ "dotenv"));
dotenv_1.default.config();
const shouldInjectDependency = !1;
const app = (0, express_1.default)(),
  host = (0, isDockerEnvironment_1.isDockerEnvironment)() ? "0.0.0.0" : "localhost" || 0,
  port = Number(process.env.PORT) || 8e3,
  baseUrl = "/",
  hostEnvironment = process.env.hostEnvironment;
function handleListen() {
  (0, isDockerEnvironment_1.isDockerEnvironment)() ? console.log(`Listening on http://localhost:${port}`) : console.log(`Listening on http://${host}:${port}`);
}
app.use((0, cors_1.default)({
  origin: "*"
})), app.use(express_1.default.static("public")), app.use(express_1.default.json()), app.use("/", router_1.default), "lambda" !== hostEnvironment && (console.log("Starting server..."), app.listen(port, host, handleListen)), exports["default"] = app;

/***/ }),

/***/ "./build/src/microservices/MICROSERVICES.js":
/*!**************************************************!*\
  !*** ./build/src/microservices/MICROSERVICES.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.MICROSERVICES = void 0;
const CONTROLLERS_1 = __webpack_require__(/*! ./customer/controllers/CONTROLLERS */ "./build/src/microservices/customer/controllers/CONTROLLERS.js"),
  CONTROLLERS_2 = __webpack_require__(/*! ./product/controllers/CONTROLLERS */ "./build/src/microservices/product/controllers/CONTROLLERS.js");
exports.MICROSERVICES = {
  customer: CONTROLLERS_1.CONTROLLERS,
  product: CONTROLLERS_2.CONTROLLERS
};

/***/ }),

/***/ "./build/src/microservices/customer/controllers/CONTROLLERS.js":
/*!*********************************************************************!*\
  !*** ./build/src/microservices/customer/controllers/CONTROLLERS.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.CONTROLLERS = void 0;
const login_1 = __importDefault(__webpack_require__(/*! ./login */ "./build/src/microservices/customer/controllers/login.js")),
  user_1 = __importDefault(__webpack_require__(/*! ./user */ "./build/src/microservices/customer/controllers/user.js"));
exports.CONTROLLERS = {
  login: login_1.default,
  user: user_1.default
};

/***/ }),

/***/ "./build/src/microservices/customer/controllers/login.js":
/*!***************************************************************!*\
  !*** ./build/src/microservices/customer/controllers/login.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0 && (t[p] = s[p]);
  if (null != s && "function" == typeof Object.getOwnPropertySymbols) for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]) && (t[p[i]] = s[p[i]]);
  return t;
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const database_1 = __webpack_require__(/*! ../models/database */ "./build/src/microservices/customer/models/database.js"),
  utilityFunctions_1 = __webpack_require__(/*! ../../../utils/utilityFunctions */ "./build/src/utils/utilityFunctions.js"),
  logins = database_1.mongodb.getCollection("login"),
  login = {
    getOne: getOne,
    addOne: addOne,
    updateOne: updateOne,
    deleteOne: deleteOne
  };
async function getOne(query) {
  if (await logins, (0, utilityFunctions_1.isEmpty)(query)) return null;
  const loginResult = await logins.findOne(query);
  return loginResult || null;
}
async function addOne(query) {
  await logins;
  const result = undefined;
  return await logins.insertOne(query);
}
async function updateOne(query) {
  await logins;
  let {
      _id: _id
    } = query,
    data = __rest(query, ["_id"]);
  if (!_id) throw new Error("ERROR: _id is required");
  const result = undefined;
  return await logins.updateOne({
    _id: _id
  }, {
    $set: data
  });
}
async function deleteOne(query) {
  if (await logins, (0, utilityFunctions_1.isEmpty)(query)) throw new Error("ERROR: Unable to delete login");
  const result = undefined;
  return await logins.deleteOne(query);
}
exports["default"] = login;

/***/ }),

/***/ "./build/src/microservices/customer/controllers/user.js":
/*!**************************************************************!*\
  !*** ./build/src/microservices/customer/controllers/user.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0 && (t[p] = s[p]);
    if (null != s && "function" == typeof Object.getOwnPropertySymbols) for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]) && (t[p[i]] = s[p[i]]);
    return t;
  },
  __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : {
      default: mod
    };
  };
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const database_1 = __webpack_require__(/*! ../models/database */ "./build/src/microservices/customer/models/database.js"),
  validate_1 = __importDefault(__webpack_require__(/*! ../middleware/validate */ "./build/src/microservices/customer/middleware/validate.js")),
  utilityFunctions_1 = __webpack_require__(/*! ../../../utils/utilityFunctions */ "./build/src/utils/utilityFunctions.js"),
  mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb"),
  user = {
    getOne: getOne,
    addOne: addOne,
    deleteOne: deleteOne,
    updateOne: updateOne
  };
exports["default"] = user;
const users = database_1.mongodb.getCollection("user");
async function getOne(query) {
  if (await users, (0, utilityFunctions_1.isEmpty)(query)) return null;
  let {
    _id: _id
  } = query;
  if (!_id) throw new Error("ERROR: User ID is required");
  "string" == typeof _id && (_id = new mongodb_1.ObjectId(_id));
  const user = undefined;
  return await users.findOne({
    _id: _id
  });
}
async function addOne(query) {
  await users;
  const {
    email: email
  } = query;
  validate_1.default.email(email);
  const result = undefined;
  return await users.insertOne(query);
}
async function deleteOne(query) {
  await users;
  const result = undefined;
  return await users.deleteOne(query);
}
async function updateOne(query) {
  await users;
  let {
      _id: _id
    } = query,
    data = __rest(query, ["_id"]);
  if (!_id) throw new Error("ERROR: _id is required");
  const result = undefined;
  return await users.updateOne({
    _id: _id
  }, {
    $set: data
  });
}

/***/ }),

/***/ "./build/src/microservices/customer/middleware/validate.js":
/*!*****************************************************************!*\
  !*** ./build/src/microservices/customer/middleware/validate.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const httpCodes_1 = __importDefault(__webpack_require__(/*! ../../../utils/httpCodes */ "./build/src/utils/httpCodes.js")),
  validate = {
    email: email,
    password: password,
    user: user,
    userId: userId,
    token: token
  };
function email(email) {
  if (!email) throw new Error("ERROR: email is required");
  if ("string" != typeof email) throw new Error("ERROR: invalid email");
}
function password(password) {
  if (!password) throw new Error("ERROR: password is required");
  if ("string" != typeof password) throw new Error("ERROR: invalid password");
}
function user(user, errorMessage = "ERROR: invalid user") {
  if (!user || !user._id) {
    const error = new Error(errorMessage);
    throw error.code = httpCodes_1.default.error.badRequest, error;
  }
}
function userId(userId, errorMessage = "ERROR: invalid user id") {
  if (!userId) {
    const error = new Error(errorMessage);
    throw error.code = httpCodes_1.default.error.badRequest, error;
  }
}
function token(token) {
  if (!token) throw new Error("ERROR: token is required");
  if ("string" != typeof token) throw new Error("ERROR: invalid token");
}
exports["default"] = validate;

/***/ }),

/***/ "./build/src/microservices/customer/middleware/verify.js":
/*!***************************************************************!*\
  !*** ./build/src/microservices/customer/middleware/verify.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const nodeUtils_1 = __webpack_require__(/*! ../../../utils/nodeUtils */ "./build/src/utils/nodeUtils.js"),
  validate_1 = __importDefault(__webpack_require__(/*! ../middleware/validate */ "./build/src/microservices/customer/middleware/validate.js")),
  login_1 = __importDefault(__webpack_require__(/*! ../controllers/login */ "./build/src/microservices/customer/controllers/login.js")),
  verify = {
    signupEmail: signupEmail,
    loginAttempts: loginAttempts
  };
async function signupEmail(email) {
  validate_1.default.email(email);
  const emailHash = (0, nodeUtils_1.hash)(email),
    result = undefined,
    isSignupEmailTaken = undefined;
  if (!!(await login_1.default.getOne({
    emailHash: emailHash
  }))) throw new Error("ERROR: An account with that email already exists");
}
exports["default"] = verify;
const loginAttemptCount = {},
  timeoutIds = {},
  LOGIN_TIMEOUT_DURATION = 6e4;
function loginAttempts(email) {
  var _a;
  const numberOfAttempts = null !== (_a = loginAttemptCount[email]) && void 0 !== _a ? _a : 0;
  if (numberOfAttempts > 3) throw new Error("ERROR: Too many login attempts");
  loginAttemptCount[email] = numberOfAttempts + 1, resetTimeout(email);
}
function resetTimeout(email) {
  clearTimeout(timeoutIds[email]), timeoutIds[email] = setTimeout(() => {
    clearTimeout(timeoutIds[email]), loginAttemptCount[email] = 0;
  }, LOGIN_TIMEOUT_DURATION);
}

/***/ }),

/***/ "./build/src/microservices/customer/models/database.js":
/*!*************************************************************!*\
  !*** ./build/src/microservices/customer/models/database.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.mongodb = exports.sql = exports.typeorm = exports.knex = void 0;
const Database_1 = __importDefault(__webpack_require__(/*! ../../../utils/Database/v1.1/Database */ "./build/src/utils/Database/v1.1/Database.js")),
  mongodb_config_1 = __importDefault(__webpack_require__(/*! ../mongodb.config */ "./build/src/microservices/customer/mongodb.config.js")),
  database = new Database_1.default();
database.configureMongodb(mongodb_config_1.default), exports.knex = database.knex, exports.typeorm = database.typeorm, exports.sql = database.sql, exports.mongodb = database.mongodb;

/***/ }),

/***/ "./build/src/microservices/customer/mongodb.config.js":
/*!************************************************************!*\
  !*** ./build/src/microservices/customer/mongodb.config.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ "dotenv"));
dotenv_1.default.config();
const connectionString = "mongodb+srv://rolazar:Peppu71EdiA0svLf@level6-capstone-project.ltvx75b.mongodb.net/?retryWrites=true&w=majority",
  database = "level6-capstone-project";
if (!connectionString) throw new Error("ERROR: Mongodb connection string is required");
if (!database) throw new Error("ERROR: Mongodb database is required");
const mongodbConfig = {
  connectionString: connectionString,
  database: database,
  user: process.env.mongodbUser,
  password: process.env.mongodbPassword
};
exports["default"] = mongodbConfig;

/***/ }),

/***/ "./build/src/microservices/product/controllers/CONTROLLERS.js":
/*!********************************************************************!*\
  !*** ./build/src/microservices/product/controllers/CONTROLLERS.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.CONTROLLERS = void 0;
const cart_1 = __importDefault(__webpack_require__(/*! ./cart */ "./build/src/microservices/product/controllers/cart.js")),
  item_1 = __importDefault(__webpack_require__(/*! ./item */ "./build/src/microservices/product/controllers/item.js")),
  inventory_1 = __importDefault(__webpack_require__(/*! ./inventory */ "./build/src/microservices/product/controllers/inventory.js"));
exports.CONTROLLERS = {
  cart: cart_1.default,
  item: item_1.default,
  inventory: inventory_1.default
};

/***/ }),

/***/ "./build/src/microservices/product/controllers/cart.js":
/*!*************************************************************!*\
  !*** ./build/src/microservices/product/controllers/cart.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0 && (t[p] = s[p]);
  if (null != s && "function" == typeof Object.getOwnPropertySymbols) for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]) && (t[p[i]] = s[p[i]]);
  return t;
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const database_1 = __webpack_require__(/*! ../models/database */ "./build/src/microservices/product/models/database.js"),
  utilityFunctions_1 = __webpack_require__(/*! ../../../utils/utilityFunctions */ "./build/src/utils/utilityFunctions.js"),
  mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb"),
  cart = {
    addOne: addOne,
    getOne: getOne,
    deleteOne: deleteOne,
    updateOne: updateOne
  };
exports["default"] = cart;
const carts = database_1.mongodb.getCollection("cart");
async function addOne(query) {
  await carts, query || (query = {});
  const result = undefined;
  return await carts.insertOne(query);
}
async function getOne(query) {
  if (await carts, (0, utilityFunctions_1.isEmpty)(query)) return null;
  const {
    _id: _id
  } = query;
  if (!_id) throw new Error("ERROR: Cart id is required");
  const result = undefined;
  return await carts.findOne({
    _id: new mongodb_1.ObjectId(_id)
  });
}
async function deleteOne(query) {
  if (await carts, (0, utilityFunctions_1.isEmpty)(query)) throw new Error("ERROR: Unable to delete cart");
  const result = undefined;
  return await carts.deleteOne(query);
}
async function updateOne(query) {
  await carts;
  let {
      _id: _id
    } = query,
    data = __rest(query, ["_id"]);
  if (!_id) throw new Error("ERROR: _id is required");
  const result = undefined;
  return await carts.updateOne({
    _id: _id
  }, {
    $set: data
  });
}

/***/ }),

/***/ "./build/src/microservices/product/controllers/inventory.graphql.js":
/*!**************************************************************************!*\
  !*** ./build/src/microservices/product/controllers/inventory.graphql.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const graphql_1 = __importDefault(__webpack_require__(/*! ../models/graphql */ "./build/src/microservices/product/models/graphql.js")),
  Item_1 = __webpack_require__(/*! ../models/entities/Item */ "./build/src/microservices/product/models/entities/Item.js"),
  inventory = {
    getOne: getOne
  };
async function getOne(query) {
  var _a, _b, _c;
  const graphqlQuery = '\n    query {\n      amazonProductCategory(input: {categoryId: "1084128"}) {\n        productResults {\n          results{\n            asin\n            title\n            mainImageUrl\n            price {\n              value\n            }\n          }\n        }\n      }\n    }',
    response = await graphql_1.default.send(graphqlQuery),
    productsArray = undefined,
    items = (null === (_c = null === (_b = null === (_a = null == response ? void 0 : response.data) || void 0 === _a ? void 0 : _a.amazonProductCategory) || void 0 === _b ? void 0 : _b.productResults) || void 0 === _c ? void 0 : _c.results).map(toItem),
    item_ids = undefined,
    inventory = undefined;
  return {
    item_ids: items.map(toItemId),
    items: items
  };
}
function toItem(item) {
  const _id = item.asin,
    {
      name: name,
      description: description
    } = extractInfo(item.title),
    price = item.price.value,
    image = item.mainImageUrl;
  return (0, Item_1.Item)({
    _id: _id,
    name: name,
    description: description,
    price: price,
    image: image
  });
}
function toItemId(item) {
  const {
    _id: _id
  } = item;
  return _id;
}
function extractInfo(info) {
  const [name, ..._otherInfo] = info.split(",");
  return {
    name: name,
    description: info
  };
}
exports["default"] = inventory;

/***/ }),

/***/ "./build/src/microservices/product/controllers/inventory.js":
/*!******************************************************************!*\
  !*** ./build/src/microservices/product/controllers/inventory.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0 && (t[p] = s[p]);
  if (null != s && "function" == typeof Object.getOwnPropertySymbols) for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]) && (t[p[i]] = s[p[i]]);
  return t;
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const database_1 = __webpack_require__(/*! ../models/database */ "./build/src/microservices/product/models/database.js"),
  inventory = {
    getOne: getOne,
    updateOne: updateOne
  };
exports["default"] = inventory;
const inventories = database_1.mongodb.getCollection("inventory");
async function getOne(query) {
  await inventories;
  const result = undefined;
  return await inventories.findOne(query);
}
async function updateOne(query) {
  await inventories;
  let {
      _id: _id
    } = query,
    data = __rest(query, ["_id"]);
  if (!_id) throw new Error("ERROR: _id is required");
  const result = undefined;
  return await inventories.updateOne({
    _id: _id
  }, {
    $set: data
  });
}

/***/ }),

/***/ "./build/src/microservices/product/controllers/item.graphql.js":
/*!*********************************************************************!*\
  !*** ./build/src/microservices/product/controllers/item.graphql.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const graphql_1 = __importDefault(__webpack_require__(/*! ../models/graphql */ "./build/src/microservices/product/models/graphql.js")),
  Item_1 = __webpack_require__(/*! ../models/entities/Item */ "./build/src/microservices/product/models/entities/Item.js"),
  inventory_graphql_1 = __importDefault(__webpack_require__(/*! ./inventory.graphql */ "./build/src/microservices/product/controllers/inventory.graphql.js")),
  item = {
    getOne: getOne,
    getMany: getMany
  };
async function getOne(query) {
  var _a;
  let {
    _id: _id
  } = query || {};
  _id || (_id = "B0BDHWDR12");
  const graphqlQuery = `\n    query amazonProduct {\n      amazonProduct(input: { asinLookup: { asin: "${_id}" } }) {\n        asin\n        title\n        mainImageUrl\n        price {\n          value\n        }\n      }\n    }`,
    response = await graphql_1.default.send(graphqlQuery),
    productResult = null === (_a = null == response ? void 0 : response.data) || void 0 === _a ? void 0 : _a.amazonProduct;
  if (!productResult) return null;
  productResult.asin = _id;
  const item = undefined;
  return toItem(productResult);
}
async function getMany(query) {
  var _a;
  const inventory = await inventory_graphql_1.default.getOne(),
    {
      items: items
    } = inventory,
    ids = (null === (_a = null == query ? void 0 : query._id) || void 0 === _a ? void 0 : _a.$in) || [],
    matchingItems = undefined;
  return items.filter(matchItemIds(ids));
}
function toItem(product) {
  const _id = product.asin,
    {
      name: name,
      description: description
    } = extractInfo(product.title),
    price = product.price.value,
    image = product.mainImageUrl;
  return (0, Item_1.Item)({
    _id: _id,
    name: name,
    description: description,
    price: price,
    image: image
  });
}
function extractInfo(info) {
  const [name, ..._otherInfo] = info.split(",");
  return {
    name: name,
    description: info
  };
}
function matchItemIds(itemIds) {
  return function (item) {
    const id = `${item._id}`,
      doesMatch = undefined;
    return itemIds.includes(id);
  };
}
exports["default"] = item;

/***/ }),

/***/ "./build/src/microservices/product/controllers/item.js":
/*!*************************************************************!*\
  !*** ./build/src/microservices/product/controllers/item.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0 && (t[p] = s[p]);
  if (null != s && "function" == typeof Object.getOwnPropertySymbols) for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]) && (t[p[i]] = s[p[i]]);
  return t;
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const database_1 = __webpack_require__(/*! ../models/database */ "./build/src/microservices/product/models/database.js"),
  item = {
    getOne: getOne,
    getMany: getMany,
    updateOne: updateOne
  };
exports["default"] = item;
const items = database_1.mongodb.getCollection("item");
async function getOne(query) {
  await items;
  const result = undefined;
  return await items.findOne(query);
}
async function getMany(query) {
  await items;
  const result = undefined;
  return await items.find(query).toArray();
}
async function updateOne(query) {
  await items;
  let {
      _id: _id
    } = query,
    data = __rest(query, ["_id"]);
  if (!_id) throw new Error("ERROR: _id is required");
  const result = undefined;
  return await items.updateOne({
    _id: _id
  }, {
    $set: data
  });
}

/***/ }),

/***/ "./build/src/microservices/product/middleware/validate.js":
/*!****************************************************************!*\
  !*** ./build/src/microservices/product/middleware/validate.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const httpCodes_1 = __importDefault(__webpack_require__(/*! ../../../utils/httpCodes */ "./build/src/utils/httpCodes.js")),
  validate = {
    cart: cart,
    cart_id: cart_id,
    item: item
  };
function cart(cart) {
  if (!cart || !cart._id) {
    const error = new Error("ERROR: invalid cart");
    throw error.code = httpCodes_1.default.error.badRequest, error;
  }
}
function cart_id(id) {
  if (!id) {
    const error = new Error("ERROR: invalid cart");
    throw error.code = httpCodes_1.default.error.badRequest, error;
  }
}
function item(item) {
  if (!item || !item._id) {
    const error = new Error("ERROR: invalid item");
    throw error.code = httpCodes_1.default.error.badRequest, error;
  }
}
exports["default"] = validate;

/***/ }),

/***/ "./build/src/microservices/product/models/database.js":
/*!************************************************************!*\
  !*** ./build/src/microservices/product/models/database.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.mongodb = exports.sql = exports.typeorm = exports.knex = void 0;
const Database_1 = __importDefault(__webpack_require__(/*! ../../../utils/Database/v1.1/Database */ "./build/src/utils/Database/v1.1/Database.js")),
  mongodb_config_1 = __importDefault(__webpack_require__(/*! ../mongodb.config */ "./build/src/microservices/product/mongodb.config.js")),
  database = new Database_1.default();
database.configureMongodb(mongodb_config_1.default);
const {
  knex: knex,
  typeorm: typeorm,
  sql: sql,
  mongodb: mongodb
} = database;
exports.knex = knex, exports.typeorm = typeorm, exports.sql = sql, exports.mongodb = mongodb;

/***/ }),

/***/ "./build/src/microservices/product/models/entities/Item.js":
/*!*****************************************************************!*\
  !*** ./build/src/microservices/product/models/entities/Item.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.Item = void 0;
const utilityFunctions_1 = __webpack_require__(/*! ../../../../utils/utilityFunctions */ "./build/src/utils/utilityFunctions.js"),
  validate_1 = __importDefault(__webpack_require__(/*! ../../../../middleware/validate */ "./build/src/middleware/validate.js")),
  Item = object => {
    if ((0, utilityFunctions_1.isEmpty)(object)) return null;
    const item = Object.assign({}, object),
      {
        _id: _id,
        name: name,
        price: price,
        image: image,
        description: description
      } = item;
    return _id && (item._id = validate_1.default.objectId(_id)), name && (item.name = validate_1.default.string(name)), price && (item.price = validate_1.default.number(price)), image && (item.image = validate_1.default.string(image)), description && (item.description = validate_1.default.string(description)), item;
  };
exports.Item = Item;

/***/ }),

/***/ "./build/src/microservices/product/models/graphql.js":
/*!***********************************************************!*\
  !*** ./build/src/microservices/product/models/graphql.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ "dotenv"));
dotenv_1.default.config();
const graphql = {
  send: send
};
exports["default"] = graphql;
const {
  canopyApiKey: canopyApiKey
} = process.env;
async function send(query) {
  const response = undefined;
  return (await fetch("https://graphql.canopyapi.co/", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "API-KEY": canopyApiKey
    },
    body: JSON.stringify({
      query: query
    })
  })).json();
}

/***/ }),

/***/ "./build/src/microservices/product/mongodb.config.js":
/*!***********************************************************!*\
  !*** ./build/src/microservices/product/mongodb.config.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ "dotenv"));
dotenv_1.default.config();
const connectionString = "mongodb+srv://rolazar:Peppu71EdiA0svLf@level6-capstone-project.ltvx75b.mongodb.net/?retryWrites=true&w=majority",
  database = "level6-capstone-project";
if (!connectionString) throw new Error("ERROR: Mongodb connection string is required");
if (!database) throw new Error("ERROR: Mongodb database is required");
const mongodbConfig = {
  connectionString: connectionString,
  database: database,
  user: process.env.mongodbUser,
  password: process.env.mongodbPassword
};
exports["default"] = mongodbConfig;

/***/ }),

/***/ "./build/src/middleware/ValidatedQuery.js":
/*!************************************************!*\
  !*** ./build/src/middleware/ValidatedQuery.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.ValidatedQuery = void 0;
const removeEmptyValues_1 = __webpack_require__(/*! ../utils/removeEmptyValues */ "./build/src/utils/removeEmptyValues.js"),
  utilityFunctions_1 = __webpack_require__(/*! ../utils/utilityFunctions */ "./build/src/utils/utilityFunctions.js");
function ValidatedQuery(query) {
  const withoutEmptyValues = undefined,
    withoutUnmatchedOptions = undefined;
  return removeUnmatchedOptions((0, removeEmptyValues_1.removeEmptyValues)(query));
}
function removeUnmatchedOptions(query) {
  if ((0, utilityFunctions_1.isEmpty)(query)) return null;
  const newQuery = Object.assign({}, query),
    properties = Object.getOwnPropertyNames(query),
    fields = properties.filter(property => !property.includes("_option")),
    options = properties.filter(property => property.includes("_option"));
  for (let option of options) {
    const field = option.split("_")[0],
      hasMatchingField = undefined;
    fields.find(value => value === field) || delete newQuery[option];
  }
  return newQuery;
}
exports.ValidatedQuery = ValidatedQuery;

/***/ }),

/***/ "./build/src/middleware/assert.js":
/*!****************************************!*\
  !*** ./build/src/middleware/assert.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const errorUtils_1 = __webpack_require__(/*! ../utils/errorUtils */ "./build/src/utils/errorUtils.js"),
  authenticate_1 = __importDefault(__webpack_require__(/*! ../controllers/authenticate */ "./build/src/controllers/authenticate.js")),
  validate = {
    token: token
  };
async function token(request, response, next) {
  try {
    const {
      email: email,
      token: token
    } = request.body.user;
    return await authenticate_1.default.token(email, token), next();
  } catch (asyncError) {
    const {
      error: error,
      code: code,
      message: message
    } = await (0, errorUtils_1.handleAsyncError)(asyncError);
    response.status(code).send(message);
  }
}
exports["default"] = validate;

/***/ }),

/***/ "./build/src/middleware/validate.js":
/*!******************************************!*\
  !*** ./build/src/middleware/validate.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const ValidatedQuery_1 = __webpack_require__(/*! ./ValidatedQuery */ "./build/src/middleware/ValidatedQuery.js"),
  mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb"),
  validate = {
    query: query,
    number: number,
    objectId: objectId,
    string: string,
    array: array
  };
function query(query) {
  const validatedQuery = undefined;
  return (0, ValidatedQuery_1.ValidatedQuery)(query);
}
function number(value) {
  const number = Number(value);
  return "number" == typeof number ? number : value;
}
function objectId(id) {
  if (id instanceof mongodb_1.ObjectId) return id;
  try {
    const objectId = undefined;
    return new mongodb_1.ObjectId(id);
  } catch (invalidObjectId) {
    return id;
  }
}
function string(value) {
  return "string" == typeof value ? value : `${value}`;
}
function array(value) {
  return value;
}
exports["default"] = validate;

/***/ }),

/***/ "./build/src/routes/delete.js":
/*!************************************!*\
  !*** ./build/src/routes/delete.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const utilityFunctionsServer_1 = __webpack_require__(/*! ../utilityFunctionsServer */ "./build/src/utilityFunctionsServer.js"),
  cartUtils_1 = __webpack_require__(/*! ../controllers/cartUtils */ "./build/src/controllers/cartUtils.js"),
  errorUtils_1 = __webpack_require__(/*! ../utils/errorUtils */ "./build/src/utils/errorUtils.js"),
  userUtils_1 = __webpack_require__(/*! ../controllers/userUtils */ "./build/src/controllers/userUtils.js"),
  validate_1 = __importDefault(__webpack_require__(/*! ../microservices/product/middleware/validate */ "./build/src/microservices/product/middleware/validate.js"));
async function cartData(request, response) {
  try {
    const validValues = (0, utilityFunctionsServer_1.getValidValues)(request.body),
      cart = validValues.cart,
      item = validValues.item,
      user = validValues.user,
      token = validValues.token;
    validate_1.default.cart(cart), validate_1.default.item(item), cart._id = await (0, userUtils_1.getCartId)(user, token);
    const result = await (0, cartUtils_1.removeItemFromCart)(cart, item);
    response.status(200).send(result);
  } catch (asyncError) {
    const {
      error: error,
      message: message,
      code: code
    } = await (0, errorUtils_1.handleAsyncError)(asyncError);
    response.status(code).send(message);
  }
}
exports["default"] = {
  cartData: cartData
};

/***/ }),

/***/ "./build/src/routes/endpoints.js":
/*!***************************************!*\
  !*** ./build/src/routes/endpoints.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.urls = exports.hostUrl = exports.endpoints = void 0, exports.endpoints = {
  baseUrl: "/",
  api: "/api",
  cart: "/api/cart",
  inventory: "/api/inventory",
  login: "/api/login",
  logout: "/api/logout",
  signup: "/api/signup",
  user: "/api/user",
  test: "/test",
  redirect: "/api/auth/redirect",
  callback: "/api/auth/callback",
  refresh: "/api/auth/refresh",
  revoke: "/api/auth/revoke",
  dynamic: "/api/:microservice/:endpoint/:command"
}, exports.hostUrl = "localhost", exports.urls = {
  host: exports.hostUrl,
  root: exports.hostUrl + exports.endpoints.baseUrl,
  api: exports.hostUrl + exports.endpoints.api,
  cart: exports.hostUrl + exports.endpoints.cart,
  inventory: exports.hostUrl + exports.endpoints.inventory,
  login: exports.hostUrl + exports.endpoints.login,
  logout: exports.hostUrl + exports.endpoints.logout,
  signup: exports.hostUrl + exports.endpoints.signup,
  account: exports.hostUrl + exports.endpoints.user,
  test: exports.hostUrl + exports.endpoints.test
};

/***/ }),

/***/ "./build/src/routes/getDbOperation.js":
/*!********************************************!*\
  !*** ./build/src/routes/getDbOperation.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.getDbOperation = void 0;
const MICROSERVICES_1 = __webpack_require__(/*! ../microservices/MICROSERVICES */ "./build/src/microservices/MICROSERVICES.js");
function getDbOperation(microservice, endpoint, command) {
  const controllers = MICROSERVICES_1.MICROSERVICES[microservice];
  if (!controllers) throw new Error("ERROR: Invalid microservice");
  const controller = controllers[endpoint];
  if (!controller) throw new Error("ERROR: Invalid endpoint");
  const dbOperation = controller[command];
  if (!dbOperation) throw new Error("ERROR: Invalid command");
  return dbOperation;
}
exports.getDbOperation = getDbOperation;

/***/ }),

/***/ "./build/src/routes/handleRoute.js":
/*!*****************************************!*\
  !*** ./build/src/routes/handleRoute.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.handleRoute = void 0;
const validate_1 = __importDefault(__webpack_require__(/*! ../middleware/validate */ "./build/src/middleware/validate.js")),
  getDbOperation_1 = __webpack_require__(/*! ./getDbOperation */ "./build/src/routes/getDbOperation.js");
async function handleRoute(request, response) {
  const {
      microservice: microservice,
      endpoint: endpoint,
      command: command
    } = request.params,
    {
      query: query,
      body: body
    } = request,
    newQuery = Object.assign(Object.assign({}, query), body),
    validatedQuery = validate_1.default.query(newQuery);
  try {
    const dbOperation = (0, getDbOperation_1.getDbOperation)(microservice, endpoint, command),
      result = await dbOperation(validatedQuery);
    response.json(result);
  } catch (asyncError) {
    await asyncError, response.status(404).json(asyncError.message);
  }
}
exports.handleRoute = handleRoute;

/***/ }),

/***/ "./build/src/routes/home.js":
/*!**********************************!*\
  !*** ./build/src/routes/home.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {



function urlHome(_request, response) {
  response.sendFile("index.html", {
    root: "public"
  });
}
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports["default"] = urlHome;

/***/ }),

/***/ "./build/src/routes/read.js":
/*!**********************************!*\
  !*** ./build/src/routes/read.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const cartUtils_1 = __webpack_require__(/*! ../controllers/cartUtils */ "./build/src/controllers/cartUtils.js"),
  inventoryUtils_1 = __webpack_require__(/*! ../controllers/inventoryUtils */ "./build/src/controllers/inventoryUtils.js");
async function inventoryData(_request, response) {
  try {
    const inventory = await (0, inventoryUtils_1.getInventory)();
    response.status(200).send(inventory);
  } catch (error) {
    response.status(400).send(error);
  }
}
async function cartData(request, response) {
  try {
    const {
        email: email,
        token: token
      } = request.body.user,
      cart = await (0, cartUtils_1.getCartByToken)(email, token);
    response.status(200).send(cart);
  } catch (error) {
    response.status(400).send(error);
  }
}
exports["default"] = {
  cartData: cartData,
  inventoryData: inventoryData
};

/***/ }),

/***/ "./build/src/routes/router.js":
/*!************************************!*\
  !*** ./build/src/routes/router.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const express_1 = __importDefault(__webpack_require__(/*! express */ "express")),
  home_1 = __importDefault(__webpack_require__(/*! ./home */ "./build/src/routes/home.js")),
  testPage_1 = __webpack_require__(/*! ./testPage */ "./build/src/routes/testPage.js"),
  read_1 = __importDefault(__webpack_require__(/*! ./read */ "./build/src/routes/read.js")),
  update_1 = __importDefault(__webpack_require__(/*! ./update */ "./build/src/routes/update.js")),
  delete_1 = __importDefault(__webpack_require__(/*! ./delete */ "./build/src/routes/delete.js")),
  logout_1 = __importDefault(__webpack_require__(/*! ../controllers/logout */ "./build/src/controllers/logout.js")),
  signup_1 = __importDefault(__webpack_require__(/*! ../controllers/signup */ "./build/src/controllers/signup.js")),
  login_1 = __importDefault(__webpack_require__(/*! ../controllers/login */ "./build/src/controllers/login.js")),
  user_1 = __importDefault(__webpack_require__(/*! ../controllers/user */ "./build/src/controllers/user.js")),
  assert_1 = __importDefault(__webpack_require__(/*! ../middleware/assert */ "./build/src/middleware/assert.js")),
  api_1 = __importDefault(__webpack_require__(/*! ../controllers/api */ "./build/src/controllers/api.js")),
  endpoints_1 = __webpack_require__(/*! ./endpoints */ "./build/src/routes/endpoints.js"),
  handleRoute_1 = __webpack_require__(/*! ./handleRoute */ "./build/src/routes/handleRoute.js"),
  dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ "dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post(endpoints_1.endpoints.login, login_1.default.withGoogle, login_1.default.withToken, login_1.default.withPassword), router.post(endpoints_1.endpoints.logout, logout_1.default.withToken), router.post(endpoints_1.endpoints.signup, signup_1.default.withGoogle, signup_1.default.withPassword), router.post(endpoints_1.endpoints.user, user_1.default.fetchInfo), router.delete(endpoints_1.endpoints.user, user_1.default.delete), router.post(endpoints_1.endpoints.cart, assert_1.default.token, read_1.default.cartData), router.put(endpoints_1.endpoints.cart, assert_1.default.token, update_1.default.cartData), router.delete(endpoints_1.endpoints.cart, assert_1.default.token, delete_1.default.cartData), router.get(endpoints_1.endpoints.inventory, read_1.default.inventoryData), router.get(endpoints_1.endpoints.baseUrl, home_1.default), router.get(endpoints_1.endpoints.test, testPage_1.testPage), router.post(endpoints_1.endpoints.test, testPage_1.testPage), router.get(endpoints_1.endpoints.api, api_1.default.ping), router.get(endpoints_1.endpoints.dynamic, handleRoute_1.handleRoute), router.post(endpoints_1.endpoints.dynamic, handleRoute_1.handleRoute), router.put(endpoints_1.endpoints.dynamic, handleRoute_1.handleRoute), router.delete(endpoints_1.endpoints.dynamic, handleRoute_1.handleRoute), exports["default"] = router;

/***/ }),

/***/ "./build/src/routes/testPage.js":
/*!**************************************!*\
  !*** ./build/src/routes/testPage.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.testPage = void 0;
const dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ "dotenv"));
function testPage(request, response) {
  const message = JSON.stringify({
    method: request.method,
    mode: "mongodbdb",
    hostEnvironment: process.env.hostEnvironment
  });
  response.send(message);
}
dotenv_1.default.config(), exports.testPage = testPage;

/***/ }),

/***/ "./build/src/routes/update.js":
/*!************************************!*\
  !*** ./build/src/routes/update.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const utilityFunctionsServer_1 = __webpack_require__(/*! ../utilityFunctionsServer */ "./build/src/utilityFunctionsServer.js"),
  cartUtils_1 = __webpack_require__(/*! ../controllers/cartUtils */ "./build/src/controllers/cartUtils.js"),
  errorUtils_1 = __webpack_require__(/*! ../utils/errorUtils */ "./build/src/utils/errorUtils.js"),
  userUtils_1 = __webpack_require__(/*! ../controllers/userUtils */ "./build/src/controllers/userUtils.js"),
  validate_1 = __importDefault(__webpack_require__(/*! ../microservices/product/middleware/validate */ "./build/src/microservices/product/middleware/validate.js"));
async function cartData(request, response) {
  var _a, _b;
  try {
    const validValues = (0, utilityFunctionsServer_1.getValidValues)(request.body),
      user = validValues.user,
      cart = validValues.cart,
      token = validValues.token;
    let result;
    validate_1.default.cart(cart), cart._id = await (0, userUtils_1.getCartId)(user, token);
    const item = validValues.item,
      item_ids = null === (_b = null === (_a = null == request ? void 0 : request.body) || void 0 === _a ? void 0 : _a.cart) || void 0 === _b ? void 0 : _b.item_ids;
    item ? result = await (0, cartUtils_1.updateCart)(cart, item) : item_ids && (result = await (0, cartUtils_1.setCart)(cart, item_ids)), response.status(200).send(result);
  } catch (asyncError) {
    const {
      error: error,
      message: message,
      code: code
    } = await (0, errorUtils_1.handleAsyncError)(asyncError);
    response.status(code).send(message);
  }
}
exports["default"] = {
  cartData: cartData
};

/***/ }),

/***/ "./build/src/utilityFunctionsServer.js":
/*!*********************************************!*\
  !*** ./build/src/utilityFunctionsServer.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.toUsedProperties = exports.getValidValues = void 0;
const utilityFunctions_1 = __webpack_require__(/*! ./utils/utilityFunctions */ "./build/src/utils/utilityFunctions.js"),
  validValues = [{
    table: "cart",
    properties: ["_id", "item_ids", "totalQuantity", "totalPrice"]
  }, {
    table: "item",
    properties: ["_id", "quantity", "subtotal"]
  }, {
    table: "inventory",
    properties: ["_id", "item_ids", "totalQuantity", "totalPrice"]
  }, {
    table: "user",
    properties: ["_id", "name", "email", "token"]
  }];
function getValidValues(object, validTablesAndProperties = validValues) {
  validTablesAndProperties instanceof Array || (validTablesAndProperties = [validTablesAndProperties]);
  let validValues = {};
  for (let validObject of validTablesAndProperties) {
    const table = validObject.table;
    let validProperties = validObject.properties;
    validProperties instanceof Array || (validProperties = [validProperties]);
    const validPropertiesAndValues = (0, utilityFunctions_1.reduce)(object[table], toUsedProperties(validProperties));
    (0, utilityFunctions_1.isEmpty)(validPropertiesAndValues) || (validValues[table] = validPropertiesAndValues);
  }
  return (0, utilityFunctions_1.isEmpty)(validValues) ? null : validValues;
}
function toUsedProperties(propertiesArray) {
  return function (usedProperties = {}, value, property, _object) {
    return void 0 === value || value < 0 || propertiesArray.includes(property) && (usedProperties[property] = value), usedProperties;
  };
}
exports.getValidValues = getValidValues, exports.toUsedProperties = toUsedProperties;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/Database.js":
/*!***************************************************!*\
  !*** ./build/src/utils/Database/v1.0/Database.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const configureKnex_1 = __webpack_require__(/*! ./configureKnex */ "./build/src/utils/Database/v1.0/configureKnex.js"),
  configureMysql_1 = __webpack_require__(/*! ./configureMysql */ "./build/src/utils/Database/v1.0/configureMysql.js"),
  configureTypeorm_1 = __webpack_require__(/*! ./configureTypeorm */ "./build/src/utils/Database/v1.0/configureTypeorm.js"),
  configureSqlite_1 = __webpack_require__(/*! ./configureSqlite */ "./build/src/utils/Database/v1.0/configureSqlite.js"),
  configureSqlKnex_1 = __webpack_require__(/*! ./configureSqlKnex */ "./build/src/utils/Database/v1.0/configureSqlKnex.js"),
  configureSqlMysql_1 = __webpack_require__(/*! ./configureSqlMysql */ "./build/src/utils/Database/v1.0/configureSqlMysql.js"),
  configureSqlTypeorm_1 = __webpack_require__(/*! ./configureSqlTypeorm */ "./build/src/utils/Database/v1.0/configureSqlTypeorm.js"),
  sqlKnex_1 = __webpack_require__(/*! ./sqlKnex */ "./build/src/utils/Database/v1.0/sqlKnex.js"),
  sqlTypeorm_1 = __webpack_require__(/*! ./sqlTypeorm */ "./build/src/utils/Database/v1.0/sqlTypeorm.js"),
  sqlSqlite_1 = __webpack_require__(/*! ./sqlSqlite */ "./build/src/utils/Database/v1.0/sqlSqlite.js"),
  sqlSqliteFile_1 = __webpack_require__(/*! ./sqlSqliteFile */ "./build/src/utils/Database/v1.0/sqlSqliteFile.js"),
  sqlMysql_1 = __webpack_require__(/*! ./sqlMysql */ "./build/src/utils/Database/v1.0/sqlMysql.js");
class Database {
  constructor() {
    this.configureKnex = configureKnex_1.configureKnex.bind(this), this.configureMysql = configureMysql_1.configureMysql.bind(this), this.configureTypeorm = configureTypeorm_1.configureTypeorm.bind(this), this.configureSqlite = configureSqlite_1.configureSqlite.bind(this), this.configureSqlKnex = configureSqlKnex_1.configureSqlKnex.bind(this), this.configureSqlMysql = configureSqlMysql_1.configureSqlMysql.bind(this), this.configureSqlTypeorm = configureSqlTypeorm_1.configureSqlTypeorm.bind(this), this.sqlKnex = sqlKnex_1.sqlKnex.bind(this), this.sqlTypeorm = sqlTypeorm_1.sqlTypeorm.bind(this), this.sqlSqlite = sqlSqlite_1.sqlSqlite.bind(this), this.sqlSqliteFile = sqlSqliteFile_1.sqlSqliteFile.bind(this), this.sqlMysql = sqlMysql_1.sqlMysql.bind(this);
  }
}
exports["default"] = Database;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/configureKnex.js":
/*!********************************************************!*\
  !*** ./build/src/utils/Database/v1.0/configureKnex.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.configureKnex = void 0;
const knex_1 = __importDefault(__webpack_require__(/*! knex */ "knex"));
function configureKnex(knexfileConfig) {
  if (!knexfileConfig) throw new Error("ERROR: knexfile is required");
  const knex = (0, knex_1.default)(knexfileConfig);
  this.knex = knex;
}
exports.configureKnex = configureKnex;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/configureMysql.js":
/*!*********************************************************!*\
  !*** ./build/src/utils/Database/v1.0/configureMysql.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.configureMysql = void 0;
const mysql_1 = __importDefault(__webpack_require__(/*! mysql */ "mysql"));
function configureMysql(mysqlConfig) {
  const mysql = mysql_1.default.createConnection({
    host: mysqlConfig.host,
    user: mysqlConfig.user,
    password: mysqlConfig.password
  });
  this.mysql = mysql;
}
exports.configureMysql = configureMysql;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/configureSqlKnex.js":
/*!***********************************************************!*\
  !*** ./build/src/utils/Database/v1.0/configureSqlKnex.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {



function configureSqlKnex() {
  if (!this.knex) throw new Error("ERROR: knex must be configured");
  this.sql = this.sqlKnex.bind(this);
}
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.configureSqlKnex = void 0, exports.configureSqlKnex = configureSqlKnex;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/configureSqlMysql.js":
/*!************************************************************!*\
  !*** ./build/src/utils/Database/v1.0/configureSqlMysql.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {



function configureSqlMysql() {
  if (!this.typeorm) throw new Error("ERROR: mysql must be configured");
  this.sql = this.sqlMysql.bind(this);
}
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.configureSqlMysql = void 0, exports.configureSqlMysql = configureSqlMysql;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/configureSqlTypeorm.js":
/*!**************************************************************!*\
  !*** ./build/src/utils/Database/v1.0/configureSqlTypeorm.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {



function configureSqlTypeorm() {
  if (!this.typeorm) throw new Error("ERROR: typeorm must be configured");
  this.sql = this.sqlTypeorm.bind(this), this.sql.initialized = async function () {
    this.typeorm.isInitialized || (await this.typeorm.initialize());
  }.bind(this);
}
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.configureSqlTypeorm = void 0, exports.configureSqlTypeorm = configureSqlTypeorm;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/configureSqlite.js":
/*!**********************************************************!*\
  !*** ./build/src/utils/Database/v1.0/configureSqlite.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.configureSqlite = void 0;
const better_sqlite3_1 = __importDefault(__webpack_require__(/*! better-sqlite3 */ "better-sqlite3"));
function configureSqlite(cwd, filename) {
  if (!cwd) throw new Error("ERROR: current working directory is required");
  if (!filename) throw new Error("ERROR: filename is required");
  this.sqlite = new better_sqlite3_1.default(cwd + "/" + filename), this.sqlite.cwd = cwd;
}
exports.configureSqlite = configureSqlite;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/configureTypeorm.js":
/*!***********************************************************!*\
  !*** ./build/src/utils/Database/v1.0/configureTypeorm.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {



function configureTypeorm(appDataSource) {
  if (!appDataSource) throw new Error("ERROR: AppDataSource is required");
  this.typeorm = appDataSource, this.typeorm.initialize(), this.typeorm.initialized = async function () {
    return this.typeorm.isInitialized ? void 0 : await this.typeorm.initialize();
  }.bind(this);
}
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.configureTypeorm = void 0, exports.configureTypeorm = configureTypeorm;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/sqlKnex.js":
/*!**************************************************!*\
  !*** ./build/src/utils/Database/v1.0/sqlKnex.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {



async function sqlKnex(sqlCommand, parameters) {
  const results = undefined;
  return (await this.knex.raw(sqlCommand, parameters))[0];
}
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.sqlKnex = void 0, exports.sqlKnex = sqlKnex;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/sqlMysql.js":
/*!***************************************************!*\
  !*** ./build/src/utils/Database/v1.0/sqlMysql.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {



async function sqlMysql(sqlCommand, parameters) {
  return this.mysql.raw(sqlCommand, parameters);
}
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.sqlMysql = void 0, exports.sqlMysql = sqlMysql;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/sqlSqlite.js":
/*!****************************************************!*\
  !*** ./build/src/utils/Database/v1.0/sqlSqlite.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {



async function sqlSqlite(sqlCommand, label = "") {
  const results = this.sqlite.prepare(sqlCommand).all();
  return console.log(label, "\n", results, "\n"), results;
}
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.sqlSqlite = void 0, exports.sqlSqlite = sqlSqlite;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/sqlSqliteFile.js":
/*!********************************************************!*\
  !*** ./build/src/utils/Database/v1.0/sqlSqliteFile.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.sqlSqliteFile = void 0;
const fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
async function sqlSqliteFile(filename, cwd = this.sqlite.cwd) {
  if (!cwd) throw new Error("ERROR: sqlite is not configured");
  const SQLcommands = fs_1.default.readFileSync(cwd + "/" + filename);
  this.sqlite.exec(SQLcommands.toString());
}
exports.sqlSqliteFile = sqlSqliteFile;

/***/ }),

/***/ "./build/src/utils/Database/v1.0/sqlTypeorm.js":
/*!*****************************************************!*\
  !*** ./build/src/utils/Database/v1.0/sqlTypeorm.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {



async function sqlTypeorm(sqlCommand, parameters) {
  const results = undefined;
  return await this.typeorm.query(sqlCommand, parameters);
}
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.sqlTypeorm = void 0, exports.sqlTypeorm = sqlTypeorm;

/***/ }),

/***/ "./build/src/utils/Database/v1.1/Database.js":
/*!***************************************************!*\
  !*** ./build/src/utils/Database/v1.1/Database.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const Database_1 = __importDefault(__webpack_require__(/*! ../v1.0/Database */ "./build/src/utils/Database/v1.0/Database.js")),
  configureMongodb_1 = __webpack_require__(/*! ./configureMongodb */ "./build/src/utils/Database/v1.1/configureMongodb.js");
class Database extends Database_1.default {
  constructor() {
    super(...arguments), this.configureMongodb = configureMongodb_1.configureMongodb.bind(this);
  }
}
exports["default"] = Database;

/***/ }),

/***/ "./build/src/utils/Database/v1.1/configureMongodb.js":
/*!***********************************************************!*\
  !*** ./build/src/utils/Database/v1.1/configureMongodb.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.configureMongodb = void 0;
const PromiseExtends_1 = __webpack_require__(/*! ../../PromiseExtends */ "./build/src/utils/PromiseExtends.js"),
  mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb"),
  isDockerEnvironment_1 = __webpack_require__(/*! ../../generalUtils/isDockerEnvironment */ "./build/src/utils/generalUtils/isDockerEnvironment.js");
function configureMongodb({
  connectionString: connectionString,
  database: database
}) {
  const {
    protocol: protocol,
    port: port
  } = new URL(connectionString);
  async function getClientAndDb(resolve, reject) {
    try {
      const client = new mongodb_1.MongoClient(connectionString);
      await client.connect();
      const db = client.db(database);
      resolve({
        client: client,
        db: db
      });
    } catch (asyncError) {
      console.error("ERROR: Unable to connect to mongodb"), await asyncError, reject(asyncError);
    }
  }
  connectionString = (0, isDockerEnvironment_1.isDockerEnvironment)() && connectionString.includes("localhost") ? `${protocol}//host.docker.internal:${port}` : connectionString, this.mongodb = (0, PromiseExtends_1.PromiseExtends)(getClientAndDb.bind(this)), this.mongodb.getCollection = collectionName => {
    return (0, PromiseExtends_1.PromiseExtends)(getCollection.bind(this));
    async function getCollection(resolve) {
      await this.mongodb;
      const {
          db: db
        } = this.mongodb,
        collection = undefined;
      resolve(db.collection(collectionName));
    }
  };
}
exports.configureMongodb = configureMongodb;

/***/ }),

/***/ "./build/src/utils/PromiseExtends.js":
/*!*******************************************!*\
  !*** ./build/src/utils/PromiseExtends.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {



function PromiseExtends(promiseCallback) {
  const extendedPromise = new Promise(extendedCallback);
  return extendedPromise;
  function extendedCallback(resolve, reject) {
    function extendedResolve(resolvedValue) {
      "object" == typeof resolvedValue ? (Object.assign(extendedPromise, resolvedValue), Object.setPrototypeOf(extendedPromise, resolvedValue)) : Object.defineProperty(extendedPromise, "value", {
        value: resolvedValue
      }), resolve("Promise has been extended with new properties");
    }
    makeAsynchronous(() => promiseCallback(extendedResolve, reject));
  }
}
function makeAsynchronous(callback) {
  setTimeout(callback, 0);
}
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.PromiseExtends = void 0, exports.PromiseExtends = PromiseExtends;

/***/ }),

/***/ "./build/src/utils/errorUtils.js":
/*!***************************************!*\
  !*** ./build/src/utils/errorUtils.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.handleAsyncError = void 0;
const httpCodes_1 = __importDefault(__webpack_require__(/*! ./httpCodes */ "./build/src/utils/httpCodes.js"));
async function handleAsyncError(asyncError) {
  const error = await asyncError,
    message = error.message;
  let code = error.code;
  return ("number" != typeof code || code >= 600) && (code = httpCodes_1.default.error.serverError), {
    error: error,
    code: code,
    message: message
  };
}
exports.handleAsyncError = handleAsyncError;

/***/ }),

/***/ "./build/src/utils/generalUtils/isDockerEnvironment.js":
/*!*************************************************************!*\
  !*** ./build/src/utils/generalUtils/isDockerEnvironment.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.isDockerEnvironment = void 0;
const fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
function isDockerEnvironment() {
  return fs_1.default.existsSync("/.dockerenv");
}
exports.isDockerEnvironment = isDockerEnvironment;

/***/ }),

/***/ "./build/src/utils/httpCodes.js":
/*!**************************************!*\
  !*** ./build/src/utils/httpCodes.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: !0
}));
const httpCodes = {
  success: {
    created: 201,
    general: 200,
    ok: 200
  },
  error: {
    badRequest: 400,
    conflict: 409,
    forbiddenUser: 403,
    general: 400,
    unauthorized: 401,
    unauthenticated: 401,
    incorrectPassword: 401,
    incorrectCredentials: 401,
    serverError: 500
  },
  redirect: {
    general: 300
  }
};
exports["default"] = httpCodes;

/***/ }),

/***/ "./build/src/utils/nodeUtils.js":
/*!**************************************!*\
  !*** ./build/src/utils/nodeUtils.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.hash = void 0;
const crypto_1 = __importDefault(__webpack_require__(/*! crypto */ "crypto"));
function hash(string, algorithm = "sha256") {
  try {
    const hashCode = undefined;
    return crypto_1.default.createHash(algorithm).update(string).digest("hex");
  } catch (error) {
    return;
  }
}
exports.hash = hash;

/***/ }),

/***/ "./build/src/utils/removeEmptyValues.js":
/*!**********************************************!*\
  !*** ./build/src/utils/removeEmptyValues.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.removeEmptyValues = void 0;
const utilityFunctions_1 = __webpack_require__(/*! ./utilityFunctions */ "./build/src/utils/utilityFunctions.js");
function removeEmptyValues(object) {
  if ((0, utilityFunctions_1.isEmpty)(object)) return null;
  let objectWithoutEmptyValues = null;
  for (let property in object) {
    const value = object[property];
    (0, utilityFunctions_1.isEmpty)(value) || (objectWithoutEmptyValues ? objectWithoutEmptyValues[property] = value : objectWithoutEmptyValues = {
      [property]: value
    });
  }
  return objectWithoutEmptyValues;
}
exports.removeEmptyValues = removeEmptyValues;

/***/ }),

/***/ "./build/src/utils/utilityFunctions.js":
/*!*********************************************!*\
  !*** ./build/src/utils/utilityFunctions.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: !0
})), exports.toCloneDeep = exports.toClone = exports.toFormEntries = exports.toFields = exports.toArrayish = exports.timeout = exports.temporarilyShrink = exports.stringify = exports.serialize = exports.runCallback = exports.removeFileExtension = exports.removeElement = exports.reduceObject = exports.reduceArray = exports.reduce = exports.quoteValues = exports.pressEnter = exports.outValue = exports.outProperty = exports.outIndex = exports.noHandler = exports.matchValue = exports.matchAllProperties = exports.matchProperty = exports.matchIndex = exports.matchIsEqual = exports.mapProperties = exports.map = exports.isURL = exports.isObjectEmpty = exports.isArrayEmpty = exports.isEmpty = exports.isChar = exports.isHTMLfile = exports.isDOMobjectReady = exports.isUniqueValue = exports.hash = exports.getObjectProperties = exports.getUniqueValues = exports.getMultiArrayValue = exports.getFormEntries = exports.getCommandLineParameters = exports.generateKey = exports.floorOf = exports.filterSort = exports.find = exports.convertToTextDocument = exports.convertToHtmlDocument = exports.combine = exports.copyValuesOf = void 0;
const lodash_1 = __webpack_require__(/*! lodash */ "lodash"),
  crypto_js_1 = __importDefault(__webpack_require__(/*! crypto-js */ "crypto-js"));
function copyValuesOf(source, copy) {
  let property, value;
  for (property in source) try {
    value = source[property], copy[property] = value;
  } catch (couldntCopyValue) {
    console.log(`Couldn't copy ${property}:${value}`);
  }
}
function combine(value1, value2) {
  if (typeof value1 != typeof value2) throw Error("Cannot combine different types");
  return "string" == typeof value1 ? `${value1} ${value2}` : value1 instanceof Array ? [...value1, ...value2] : "object" == typeof value1 ? Object.assign(Object.assign({}, value1), value2) : void 0;
}
function removeElement(element, _index, _array) {
  element.remove();
}
async function convertToHtmlDocument(fileString) {
  let htmlContent = await convertToTextDocument(fileString),
    htmlDocument = new DOMParser().parseFromString(htmlContent, "text/html");
  return isHTMLfile(fileString) ? Promise.resolve(htmlDocument) : Promise.reject(htmlDocument);
}
async function convertToTextDocument(fileString) {
  let fileContent = await fetch(fileString),
    textContent;
  return await fileContent.text();
}
function filterSort(array, isMatch) {
  const match = undefined,
    notMatch = undefined;
  return reduce(array, toFilterSort, [[], []]);
  function toFilterSort(filtered = [[], []], value, _index, _array) {
    const match = filtered[0],
      notMatch = filtered[1];
    return isMatch(value) ? match.push(value) : notMatch.push(value), filtered;
  }
}
function find(collection, callback, startingIndex = 0) {
  if (0 !== startingIndex) throw new Error("find() startingIndex not yet implemented");
  collection instanceof Array || (collection = [collection]), collection.find(callback);
}
function floorOf(number, decimalPlaces) {
  const shifted = number * decimalPlaces * 10,
    truncated = undefined,
    unshifted = undefined;
  return Math.trunc(shifted) / (10 * decimalPlaces);
}
exports.copyValuesOf = copyValuesOf, exports.combine = combine, exports.removeElement = removeElement, exports.convertToHtmlDocument = convertToHtmlDocument, exports.convertToTextDocument = convertToTextDocument, exports.filterSort = filterSort, exports.find = find, exports.floorOf = floorOf;
let numberOfKeysGenerated = 0;
function generateKey() {
  return new Date().getTime() + "-" + numberOfKeysGenerated++;
}
function getCommandLineParameters() {
  const commandLine = undefined,
    parameters = undefined;
  return process.argv.slice(2);
}
function getFormEntries(formElement) {
  const fields = undefined;
  let entries;
  return reduce(formElement.querySelectorAll("[name]"), toFormEntries);
}
function getMultiArrayValue(indexArray, array) {
  if (isEmpty(indexArray)) {
    const value = undefined;
    return array;
  }
  const index = indexArray.shift();
  return getMultiArrayValue(indexArray, array[index]);
}
function getUniqueValues(array) {
  const arrayWithUniqueValues = undefined;
  return array.filter(isUniqueValue);
}
function getObjectProperties(object) {
  let property;
  const properties = [];
  for (property in object) properties.push(property);
  return properties;
}
function hash(string) {
  try {
    if (!string) return;
    const hashObject = crypto_js_1.default.SHA256(string),
      hashCode = undefined;
    return hashObject.toString(crypto_js_1.default.enc.Hex);
  } catch (error) {
    return;
  }
}
function isChar(string) {
  return "string" == typeof string && 1 === string.length;
}
function isUniqueValue(value, index, array) {
  return array.indexOf(value) === index;
}
function isDOMobjectReady(DOMobject) {
  if ("loading" !== DOMobject.readyState) return DOMobject.removeEventListener("readystatechange", _listener), Promise.resolve(`${DOMobject} is ready`);
  function _listener(event) {
    isDOMobjectReady(event.target);
  }
  DOMobject.addEventListener("readystatechange", _listener);
}
function isHTMLfile(filenameString) {
  let htmlRegex;
  return /\.html$/.test(filenameString);
}
function isEmpty(object) {
  return object instanceof Array ? isArrayEmpty(object) : object instanceof Object ? isObjectEmpty(object) : null == object || "" === object;
}
function isArrayEmpty(array) {
  if (!array) return array;
  const numberOfValues = undefined;
  return 0 === array.length;
}
function isObjectEmpty(object) {
  const numberOfValues = undefined;
  return 0 === Object.keys(object).length;
}
function isURL(urlString) {
  let urlRegex;
  return /^http(s):\/\//i.test(urlString);
}
function map(collection, callback) {
  return collection instanceof Array || (collection = [collection]), collection.map(callback);
}
function mapProperties(object, callback) {
  if (!object) return [];
  const properties = Object.getOwnPropertyNames(object);
  if (!properties) return [];
  const results = [];
  return properties.forEach(property => {
    const result = callback(object[property], property, object);
    results.push(result);
  }), results;
}
function matchIsEqual(value) {
  return function (value2, _index, _array) {
    return (0, lodash_1.isEqual)(value, value2);
  };
}
function matchIndex(indexToMatch) {
  return function (_value, index, _array) {
    return index === indexToMatch;
  };
}
function matchProperty(property, valueToMatch) {
  return "string" == typeof property && (property = [property]), function (object, _index, _array) {
    let value = object;
    try {
      for (let stringIndex of property) value = value[stringIndex];
      return value === valueToMatch;
    } catch (invalidProperty) {
      return !1;
    }
  };
}
function matchAllProperties(propertiesAndValues) {
  return function (object, _index, _array) {
    let isMatching = !0;
    for (let property in propertiesAndValues) {
      const value = propertiesAndValues[property];
      if (isMatching = isMatching && object[property] === value, !isMatching) return !1;
    }
    return !0;
  };
}
function matchValue(valueToMatch) {
  return function (value, _index, _array) {
    return value === valueToMatch;
  };
}
function noHandler() {}
function outIndex(indexToRemove) {
  return function (_value, index, _array) {
    return index !== indexToRemove;
  };
}
function outProperty(property, valueToMatch) {
  return "string" == typeof property && (property = [property]), function (object, _index, _array) {
    let value = object;
    for (let stringIndex of property) value = value[stringIndex];
    return value !== valueToMatch;
  };
}
function outValue(valueToRemove) {
  return function (value, _index, _array) {
    return value !== valueToRemove;
  };
}
function pressEnter() {
  return new Promise(_pressEnter);
  function _pressEnter(resolve, _reject) {
    process.stdin.resume(), process.stdin.once("data", () => (process.stdin.pause(), resolve()));
  }
}
function quoteValues(array) {
  if (!array) return array;
  const quotedArray = undefined;
  return array.map(value => `"${value}"`);
}
function serialize(object) {
  const serialized = {};
  for (let property in object) {
    const value = object[property];
    serialized[property] = value;
  }
  return serialized;
}
function stringify(object) {
  const replacer = void 0,
    spacer = " ",
    string = undefined;
  return JSON.stringify(object, undefined, " ");
}
function temporarilyShrink(htmlElement) {
  let container = htmlElement.parentElement,
    {
      offsetHeight: containerHeight,
      offsetWidth: containerWidth
    } = container || {};
  const originalContainerSize = forceStyleSize(container, containerHeight, containerWidth),
    currentHeight = htmlElement.offsetHeight,
    currentWidth = htmlElement.offsetWidth,
    shrinkPercent = .05,
    tempHeight = undefined,
    tempWidth = undefined,
    originalElementSize = forceStyleSize(htmlElement, currentHeight - .05 * currentHeight, currentWidth - .05 * currentWidth),
    delay = 100;
  function restoreSizes() {
    const originalHeight = originalElementSize.offsetHeight,
      originalWidth = originalElementSize.offsetWidth;
    forceStyleSize(htmlElement, originalHeight, originalWidth), restoreStyleSize(htmlElement, originalElementSize), restoreStyleSize(container, originalContainerSize);
  }
  setTimeout(restoreSizes, 100);
}
function reduce(collection, callback, initialValue) {
  return collection ? collection instanceof Array ? reduceArray(collection, callback, initialValue) : reduceObject(collection, callback, initialValue) : initialValue;
}
function reduceArray(array, callback, initialValue) {
  if (!(array instanceof Array)) throw new Error("An array was not passed to reduceArray()");
  let reducedValue = initialValue;
  return array.forEach(function (currentValue, index, arrayCopy) {
    reducedValue = callback(reducedValue, currentValue, index, arrayCopy);
  }), 0 === array.length && (reducedValue = callback(reducedValue)), reducedValue;
}
function reduceObject(object, callback, initialValue) {
  if (object instanceof Array || "string" == typeof object || "number" == typeof object) throw new Error("An object was not passed to reduceObject()");
  let reducedValue = initialValue;
  for (let property in object) {
    const value = undefined;
    reducedValue = callback(reducedValue, object[property], property, object);
  }
  return isEmpty(object) && (reducedValue = callback(reducedValue)), reducedValue;
}
function removeFileExtension(filename) {
  const splitFilename = filename.split(".");
  splitFilename.length > 2 && splitFilename.pop();
  const extensionRemoved = undefined;
  return splitFilename.join(".");
}
function restoreStyleSize(htmlElement, originalSizeObject) {
  const original = originalSizeObject;
  htmlElement.style.height = original.style.height, htmlElement.style.width = original.style.width;
}
function runCallback(callback, _index, _array) {
  callback();
}
function forceStyleSize(htmlElement, height, width) {
  const originalSize = {
    style: {
      height: htmlElement.style.height,
      width: htmlElement.style.width
    },
    offsetHeight: htmlElement.offsetHeight,
    offsetWidth: htmlElement.offsetWidth
  };
  return htmlElement.style.height = `${height}px`, htmlElement.style.width = `${width}px`, originalSize;
}
function timeout(milliseconds) {
  return new Promise(function (resolvePromise) {
    setTimeout(() => resolvePromise("Timeout complete"), milliseconds);
  });
}
function toArrayish(arrayish = {}, value, index, _array) {
  return arrayish[index] = value, arrayish;
}
function toFields(fieldList, object, index, _array) {
  fieldList instanceof Array || (fieldList = []);
  const fields = Object.keys(object),
    newFields = (0, lodash_1.difference)(fields, fieldList);
  return fieldList = fieldList.concat(newFields);
}
function toFormEntries(entries = {}, element, index, _array) {
  const name = element.name,
    value = element.value;
  return name && (entries[name] = value), entries;
}
function toClone(value, _index, _array) {
  return value;
}
function toCloneDeep(value, _index, _array) {
  return (0, lodash_1.cloneDeep)(value);
}
exports.generateKey = generateKey, exports.getCommandLineParameters = getCommandLineParameters, exports.getFormEntries = getFormEntries, exports.getMultiArrayValue = getMultiArrayValue, exports.getUniqueValues = getUniqueValues, exports.getObjectProperties = getObjectProperties, exports.hash = hash, exports.isChar = isChar, exports.isUniqueValue = isUniqueValue, exports.isDOMobjectReady = isDOMobjectReady, exports.isHTMLfile = isHTMLfile, exports.isEmpty = isEmpty, exports.isArrayEmpty = isArrayEmpty, exports.isObjectEmpty = isObjectEmpty, exports.isURL = isURL, exports.map = map, exports.mapProperties = mapProperties, exports.matchIsEqual = matchIsEqual, exports.matchIndex = matchIndex, exports.matchProperty = matchProperty, exports.matchAllProperties = matchAllProperties, exports.matchValue = matchValue, exports.noHandler = noHandler, exports.outIndex = outIndex, exports.outProperty = outProperty, exports.outValue = outValue, exports.pressEnter = pressEnter, exports.quoteValues = quoteValues, exports.serialize = serialize, exports.stringify = stringify, exports.temporarilyShrink = temporarilyShrink, exports.reduce = reduce, exports.reduceArray = reduceArray, exports.reduceObject = reduceObject, exports.removeFileExtension = removeFileExtension, exports.runCallback = runCallback, exports.timeout = timeout, exports.toArrayish = toArrayish, exports.toFields = toFields, exports.toFormEntries = toFormEntries, exports.toClone = toClone, exports.toCloneDeep = toCloneDeep;

/***/ }),

/***/ "@sendgrid/mail":
/*!*********************************!*\
  !*** external "@sendgrid/mail" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@sendgrid/mail");

/***/ }),

/***/ "better-sqlite3":
/*!*********************************!*\
  !*** external "better-sqlite3" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("better-sqlite3");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "crypto-js":
/*!****************************!*\
  !*** external "crypto-js" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("crypto-js");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "knex":
/*!***********************!*\
  !*** external "knex" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("knex");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ "mysql":
/*!************************!*\
  !*** external "mysql" ***!
  \************************/
/***/ ((module) => {

module.exports = require("mysql");

/***/ }),

/***/ "reflect-metadata":
/*!***********************************!*\
  !*** external "reflect-metadata" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("reflect-metadata");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./build/src/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QkFBbUIsR0FBQ21lLFdBQVcsRUFBQ25lLGdCQUFnQixHQUFDa2UsUUFBUSxFQUFDbGUsa0JBQWtCLEdBQUNpZSxVQUFVLEVBQUNqZSxtQkFBbUIsR0FBQ2dlLFdBQVcsRUFBQ2hlLGlCQUFpQixHQUFDMGQsU0FBUyxFQUFDMWQsaUJBQWlCLEdBQUM4UyxTQUFTLEVBQUM5Uyx5QkFBeUIsR0FBQ3lkLGlCQUFpQixFQUFDemQsY0FBYyxHQUFDcVgsTUFBTSxFQUFDclgsbUJBQW1CLEdBQUMrZCxXQUFXLEVBQUMvZCxvQkFBb0IsR0FBQzhkLFlBQVksRUFBQzlkLDJCQUEyQixHQUFDNGQsbUJBQW1CLEVBQUM1ZCxtQkFBbUIsR0FBQzJkLFdBQVcsRUFBQzNkLGVBQWUsR0FBQ3dkLE9BQU8sRUFBQ3hkLGtCQUFrQixHQUFDdWQsVUFBVSxFQUFDdmQsZ0JBQWdCLEdBQUNzZCxRQUFRLEVBQUN0ZCxxQkFBcUIsR0FBQ3FkLGFBQWEsRUFBQ3JkLGVBQWUsR0FBQ29kLE9BQU8sRUFBQ3BkLG1CQUFtQixHQUFDbWQsV0FBVzs7Ozs7Ozs7OztBQ0EvdVg7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9jb250cm9sbGVycy9hY2NvdW50VXRpbHMuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvY29udHJvbGxlcnMvYXBpLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL2NvbnRyb2xsZXJzL2F1dGhlbnRpY2F0ZS5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9jb250cm9sbGVycy9jYXJ0VXRpbHMuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvY29udHJvbGxlcnMvZGJUb2tlbi5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9jb250cm9sbGVycy9pbnZlbnRvcnlVdGlscy5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9jb250cm9sbGVycy9pdGVtVXRpbHMuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvY29udHJvbGxlcnMvbG9naW4uanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvY29udHJvbGxlcnMvbG9naW5VdGlscy5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9jb250cm9sbGVycy9sb2dvdXQuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvY29udHJvbGxlcnMvc2VuZEVtYWlsLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL2NvbnRyb2xsZXJzL3NpZ251cC5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9jb250cm9sbGVycy91c2VyLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL2NvbnRyb2xsZXJzL3VzZXJVdGlscy5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9taWNyb3NlcnZpY2VzL01JQ1JPU0VSVklDRVMuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvbWljcm9zZXJ2aWNlcy9jdXN0b21lci9jb250cm9sbGVycy9DT05UUk9MTEVSUy5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9taWNyb3NlcnZpY2VzL2N1c3RvbWVyL2NvbnRyb2xsZXJzL2xvZ2luLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL21pY3Jvc2VydmljZXMvY3VzdG9tZXIvY29udHJvbGxlcnMvdXNlci5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9taWNyb3NlcnZpY2VzL2N1c3RvbWVyL21pZGRsZXdhcmUvdmFsaWRhdGUuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvbWljcm9zZXJ2aWNlcy9jdXN0b21lci9taWRkbGV3YXJlL3ZlcmlmeS5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9taWNyb3NlcnZpY2VzL2N1c3RvbWVyL21vZGVscy9kYXRhYmFzZS5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9taWNyb3NlcnZpY2VzL2N1c3RvbWVyL21vbmdvZGIuY29uZmlnLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL21pY3Jvc2VydmljZXMvcHJvZHVjdC9jb250cm9sbGVycy9DT05UUk9MTEVSUy5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9taWNyb3NlcnZpY2VzL3Byb2R1Y3QvY29udHJvbGxlcnMvY2FydC5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9taWNyb3NlcnZpY2VzL3Byb2R1Y3QvY29udHJvbGxlcnMvaW52ZW50b3J5LmdyYXBocWwuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvbWljcm9zZXJ2aWNlcy9wcm9kdWN0L2NvbnRyb2xsZXJzL2ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9taWNyb3NlcnZpY2VzL3Byb2R1Y3QvY29udHJvbGxlcnMvaXRlbS5ncmFwaHFsLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL21pY3Jvc2VydmljZXMvcHJvZHVjdC9jb250cm9sbGVycy9pdGVtLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL21pY3Jvc2VydmljZXMvcHJvZHVjdC9taWRkbGV3YXJlL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL21pY3Jvc2VydmljZXMvcHJvZHVjdC9tb2RlbHMvZGF0YWJhc2UuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvbWljcm9zZXJ2aWNlcy9wcm9kdWN0L21vZGVscy9lbnRpdGllcy9JdGVtLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL21pY3Jvc2VydmljZXMvcHJvZHVjdC9tb2RlbHMvZ3JhcGhxbC5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9taWNyb3NlcnZpY2VzL3Byb2R1Y3QvbW9uZ29kYi5jb25maWcuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvbWlkZGxld2FyZS9WYWxpZGF0ZWRRdWVyeS5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9taWRkbGV3YXJlL2Fzc2VydC5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9taWRkbGV3YXJlL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3JvdXRlcy9kZWxldGUuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvcm91dGVzL2VuZHBvaW50cy5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy9yb3V0ZXMvZ2V0RGJPcGVyYXRpb24uanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvcm91dGVzL2hhbmRsZVJvdXRlLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3JvdXRlcy9ob21lLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3JvdXRlcy9yZWFkLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3JvdXRlcy9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvcm91dGVzL3Rlc3RQYWdlLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3JvdXRlcy91cGRhdGUuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvdXRpbGl0eUZ1bmN0aW9uc1NlcnZlci5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy91dGlscy9EYXRhYmFzZS92MS4wL0RhdGFiYXNlLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3V0aWxzL0RhdGFiYXNlL3YxLjAvY29uZmlndXJlS25leC5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy91dGlscy9EYXRhYmFzZS92MS4wL2NvbmZpZ3VyZU15c3FsLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3V0aWxzL0RhdGFiYXNlL3YxLjAvY29uZmlndXJlU3FsS25leC5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy91dGlscy9EYXRhYmFzZS92MS4wL2NvbmZpZ3VyZVNxbE15c3FsLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3V0aWxzL0RhdGFiYXNlL3YxLjAvY29uZmlndXJlU3FsVHlwZW9ybS5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy91dGlscy9EYXRhYmFzZS92MS4wL2NvbmZpZ3VyZVNxbGl0ZS5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy91dGlscy9EYXRhYmFzZS92MS4wL2NvbmZpZ3VyZVR5cGVvcm0uanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvdXRpbHMvRGF0YWJhc2UvdjEuMC9zcWxLbmV4LmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3V0aWxzL0RhdGFiYXNlL3YxLjAvc3FsTXlzcWwuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvdXRpbHMvRGF0YWJhc2UvdjEuMC9zcWxTcWxpdGUuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvdXRpbHMvRGF0YWJhc2UvdjEuMC9zcWxTcWxpdGVGaWxlLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3V0aWxzL0RhdGFiYXNlL3YxLjAvc3FsVHlwZW9ybS5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy91dGlscy9EYXRhYmFzZS92MS4xL0RhdGFiYXNlLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3V0aWxzL0RhdGFiYXNlL3YxLjEvY29uZmlndXJlTW9uZ29kYi5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy91dGlscy9Qcm9taXNlRXh0ZW5kcy5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy91dGlscy9lcnJvclV0aWxzLmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3V0aWxzL2dlbmVyYWxVdGlscy9pc0RvY2tlckVudmlyb25tZW50LmpzIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kLy4vYnVpbGQvc3JjL3V0aWxzL2h0dHBDb2Rlcy5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC8uL2J1aWxkL3NyYy91dGlscy9ub2RlVXRpbHMuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvdXRpbHMvcmVtb3ZlRW1wdHlWYWx1ZXMuanMiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvLi9idWlsZC9zcmMvdXRpbHMvdXRpbGl0eUZ1bmN0aW9ucy5qcyIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcIkBzZW5kZ3JpZC9tYWlsXCIiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvZXh0ZXJuYWwgY29tbW9uanMgXCJiZXR0ZXItc3FsaXRlM1wiIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kL2V4dGVybmFsIGNvbW1vbmpzIFwiY29yc1wiIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kL2V4dGVybmFsIGNvbW1vbmpzIFwiY3J5cHRvLWpzXCIiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvZXh0ZXJuYWwgY29tbW9uanMgXCJkb3RlbnZcIiIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcImtuZXhcIiIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcImxvZGFzaFwiIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kL2V4dGVybmFsIGNvbW1vbmpzIFwibW9uZ29kYlwiIiwid2VicGFjazovL2xldmVsNi1jYXBzdG9uZS1iYWNrZW5kL2V4dGVybmFsIGNvbW1vbmpzIFwibXlzcWxcIiIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcInJlZmxlY3QtbWV0YWRhdGFcIiIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiY3J5cHRvXCIiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImZzXCIiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9sZXZlbDYtY2Fwc3RvbmUtYmFja2VuZC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vbGV2ZWw2LWNhcHN0b25lLWJhY2tlbmQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGV4cG9ydHMuZ2V0QWNjb3VudEJ5SWQ9ZXhwb3J0cy5nZXRBY2NvdW50QnlUb2tlbj1leHBvcnRzLmRlbGV0ZUFjY291bnRCeUlkPWV4cG9ydHMuZGVsZXRlQWNjb3VudEJ5VG9rZW49ZXhwb3J0cy5kZWxldGVBY2NvdW50QnlQYXNzd29yZD1leHBvcnRzLmNyZWF0ZUFjY291bnRCeUdvb2dsZT1leHBvcnRzLmNyZWF0ZUFjY291bnRCeVBhc3N3b3JkPXZvaWQgMDtjb25zdCBjYXJ0VXRpbHNfMT1yZXF1aXJlKFwiLi9jYXJ0VXRpbHNcIiksZGJUb2tlbl8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9kYlRva2VuXCIpKSxsb2dpblV0aWxzXzE9cmVxdWlyZShcIi4vbG9naW5VdGlsc1wiKSxodHRwQ29kZXNfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL3V0aWxzL2h0dHBDb2Rlc1wiKSksdXNlclV0aWxzXzE9cmVxdWlyZShcIi4vdXNlclV0aWxzXCIpO2FzeW5jIGZ1bmN0aW9uIGNyZWF0ZUFjY291bnRCeVBhc3N3b3JkKGVtYWlsLHBhc3N3b3JkKXtjb25zdCB1c2VyUmVzdWx0PXVuZGVmaW5lZCx1c2VyPWF3YWl0KDAsdXNlclV0aWxzXzEuY3JlYXRlVXNlckJ5RW1haWwpKGVtYWlsKTthd2FpdCgwLGxvZ2luVXRpbHNfMS5jcmVhdGVMb2dpbkJ5UGFzc3dvcmQpKGVtYWlsLHBhc3N3b3JkLHVzZXIpO2NvbnN0IHRva2VuPWRiVG9rZW5fMS5kZWZhdWx0LmdldE5ldyhlbWFpbCk7cmV0dXJuIGF3YWl0IGRiVG9rZW5fMS5kZWZhdWx0LnNhdmUoZW1haWwsdG9rZW4pLHt1c2VyOnVzZXIsdG9rZW46dG9rZW59fWFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUFjY291bnRCeUdvb2dsZShlbWFpbCxuYW1lLGdvb2dsZUlkKXtjb25zdCB1c2VyUmVzdWx0PXVuZGVmaW5lZCx1c2VyPWF3YWl0KDAsdXNlclV0aWxzXzEuY3JlYXRlVXNlckJ5RW1haWwpKGVtYWlsLG5hbWUpO2F3YWl0KDAsbG9naW5VdGlsc18xLmNyZWF0ZUxvZ2luQnlHb29nbGUpKGVtYWlsLHVzZXIuX2lkLGdvb2dsZUlkKTtjb25zdCB0b2tlbj1kYlRva2VuXzEuZGVmYXVsdC5nZXROZXcoZW1haWwpO3JldHVybiBhd2FpdCBkYlRva2VuXzEuZGVmYXVsdC5zYXZlKGVtYWlsLHRva2VuKSx7dXNlcjp1c2VyLHRva2VuOnRva2VufX1hc3luYyBmdW5jdGlvbiBkZWxldGVBY2NvdW50KGNhcnRJZCxlbWFpbCx1c2VySWQpe2F3YWl0KDAsY2FydFV0aWxzXzEuZGVsZXRlQ2FydEJ5SWQpKGNhcnRJZCksYXdhaXQoMCxsb2dpblV0aWxzXzEuZGVsZXRlTG9naW5CeUVtYWlsKShlbWFpbCksYXdhaXQoMCx1c2VyVXRpbHNfMS5kZWxldGVVc2VyQnlJZCkodXNlcklkKX1hc3luYyBmdW5jdGlvbiBkZWxldGVBY2NvdW50QnlJZCh1c2VySWQpe2NvbnN0IHVzZXI9YXdhaXQoMCx1c2VyVXRpbHNfMS5nZXRVc2VyQnlJZCkodXNlcklkKTtpZighdXNlcil7Y29uc3QgZXJyb3I9bmV3IEVycm9yKFwiRVJST1I6IGludmFsaWQgdXNlciBpZFwiKTt0aHJvdyBlcnJvci5jb2RlPWh0dHBDb2Rlc18xLmRlZmF1bHQuZXJyb3IuYmFkUmVxdWVzdCxlcnJvcn1hd2FpdCBkZWxldGVBY2NvdW50KHVzZXIuY2FydF9pZCx1c2VyLmVtYWlsLHVzZXJJZCl9YXN5bmMgZnVuY3Rpb24gZGVsZXRlQWNjb3VudEJ5UGFzc3dvcmQoZW1haWwscGFzc3dvcmQpe2NvbnN0IHVzZXI9YXdhaXQoMCx1c2VyVXRpbHNfMS5nZXRVc2VyQnlQYXNzd29yZCkoZW1haWwscGFzc3dvcmQpO2lmKCF1c2VyKXtjb25zdCBlcnJvcj1uZXcgRXJyb3IoXCJFUlJPUjogaW5jb3JyZWN0IHBhc3N3b3JkXCIpO3Rocm93IGVycm9yLmNvZGU9aHR0cENvZGVzXzEuZGVmYXVsdC5lcnJvci5pbmNvcnJlY3RQYXNzd29yZCxlcnJvcn1hd2FpdCBkZWxldGVBY2NvdW50KHVzZXIuY2FydF9pZCxlbWFpbCx1c2VyLl9pZCl9YXN5bmMgZnVuY3Rpb24gZGVsZXRlQWNjb3VudEJ5VG9rZW4oZW1haWwsdG9rZW4pe2NvbnN0IHVzZXI9YXdhaXQoMCx1c2VyVXRpbHNfMS5nZXRVc2VyQnlUb2tlbikoZW1haWwsdG9rZW4pO2lmKCF1c2VyKXtjb25zdCBlcnJvcj1uZXcgRXJyb3IoXCJFUlJPUjogaW52YWxpZCB0b2tlblwiKTt0aHJvdyBlcnJvci5jb2RlPWh0dHBDb2Rlc18xLmRlZmF1bHQuZXJyb3IuaW5jb3JyZWN0Q3JlZGVudGlhbHMsZXJyb3J9YXdhaXQgZGVsZXRlQWNjb3VudCh1c2VyLmNhcnRfaWQsZW1haWwsdXNlci5faWQpfWFzeW5jIGZ1bmN0aW9uIGdldEFjY291bnRCeVRva2VuKGVtYWlsLHRva2VuKXtjb25zdCB1c2VyPWF3YWl0KDAsdXNlclV0aWxzXzEuZ2V0VXNlckJ5VG9rZW4pKGVtYWlsLHRva2VuKSxhY2NvdW50PWF3YWl0IGdldEFjY291bnRCeUlkKHVzZXIuX2lkKTtyZXR1cm4gYWNjb3VudCYmKGFjY291bnQudG9rZW49dG9rZW4pLGFjY291bnR9YXN5bmMgZnVuY3Rpb24gZ2V0QWNjb3VudEJ5SWQodXNlcklEKXtjb25zdCBhY2NvdW50PWF3YWl0KDAsdXNlclV0aWxzXzEuZ2V0VXNlckJ5SWQpKHVzZXJJRCk7cmV0dXJuIGFjY291bnQuY2FydD1hd2FpdCgwLGNhcnRVdGlsc18xLmdldENhcnRCeUlkKShhY2NvdW50LmNhcnRfaWQpLGFjY291bnR9ZXhwb3J0cy5jcmVhdGVBY2NvdW50QnlQYXNzd29yZD1jcmVhdGVBY2NvdW50QnlQYXNzd29yZCxleHBvcnRzLmNyZWF0ZUFjY291bnRCeUdvb2dsZT1jcmVhdGVBY2NvdW50QnlHb29nbGUsZXhwb3J0cy5kZWxldGVBY2NvdW50QnlJZD1kZWxldGVBY2NvdW50QnlJZCxleHBvcnRzLmRlbGV0ZUFjY291bnRCeVBhc3N3b3JkPWRlbGV0ZUFjY291bnRCeVBhc3N3b3JkLGV4cG9ydHMuZGVsZXRlQWNjb3VudEJ5VG9rZW49ZGVsZXRlQWNjb3VudEJ5VG9rZW4sZXhwb3J0cy5nZXRBY2NvdW50QnlUb2tlbj1nZXRBY2NvdW50QnlUb2tlbixleHBvcnRzLmdldEFjY291bnRCeUlkPWdldEFjY291bnRCeUlkOyIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2NvbnN0IGh0dHBDb2Rlc18xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vdXRpbHMvaHR0cENvZGVzXCIpKSx1c2VyVXRpbHNfMT1yZXF1aXJlKFwiLi91c2VyVXRpbHNcIiksYXBpPXtwaW5nOnBpbmd9O2FzeW5jIGZ1bmN0aW9uIHBpbmcoX3JlcXVlc3QscmVzcG9uc2Upe3RyeXtjb25zdCBmYWtlSWQ9e307YXdhaXQoMCx1c2VyVXRpbHNfMS5nZXRVc2VyQnlJZCkoZmFrZUlkKSxyZXNwb25zZS5zZW5kKFwiQVBJIHJlYWR5XCIpfWNhdGNoKGFzeW5jRXJyb3Ipe2NvbnN0IGVycm9yPWF3YWl0IGFzeW5jRXJyb3I7ZXJyb3IubWVzc2FnZT1cIkVSUk9SOiBBUEkgbm90IHJlYWR5LiBUcnkgYWdhaW4uXCI7Y29uc3QgY29kZT1odHRwQ29kZXNfMS5kZWZhdWx0LmVycm9yLnNlcnZlckVycm9yO3Jlc3BvbnNlLnN0YXR1cyhjb2RlKS5zZW5kKGVycm9yKX19ZXhwb3J0cy5kZWZhdWx0PWFwaTsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTtjb25zdCBodHRwQ29kZXNfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL3V0aWxzL2h0dHBDb2Rlc1wiKSksbm9kZVV0aWxzXzE9cmVxdWlyZShcIi4uL3V0aWxzL25vZGVVdGlsc1wiKSx1dGlsaXR5RnVuY3Rpb25zXzE9cmVxdWlyZShcIi4uL3V0aWxzL3V0aWxpdHlGdW5jdGlvbnNcIiksbG9naW5fMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL21pY3Jvc2VydmljZXMvY3VzdG9tZXIvY29udHJvbGxlcnMvbG9naW5cIikpLGF1dGhlbnRpY2F0ZT17Y2FydDpjYXJ0LHBhc3N3b3JkOnBhc3N3b3JkLHRva2VuOnRva2VuLGdvb2dsZTpnb29nbGV9O2FzeW5jIGZ1bmN0aW9uIGNhcnQoY2FydF9pZCx1c2VyLHRva2VuKXtpZighY2FydF9pZCl0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogaW52YWxpZCBjYXJ0IGlkXCIpO2NvbnN0IHJlc3VsdD1hd2FpdCBhdXRoZW50aWNhdGUudG9rZW4odXNlci5lbWFpbCx0b2tlbikse3VzZXJfaWQ6dXNlcl9pZH09cmVzdWx0O2lmKHVzZXIuX2lkIT09dXNlcl9pZCl7Y29uc3QgZXJyb3I9bmV3IEVycm9yKFwiRVJST1I6IGZvcmJpZGRlbiBhY2Nlc3MgdG8gY2FydFwiKTt0aHJvdyBlcnJvci5jb2RlPWh0dHBDb2Rlc18xLmRlZmF1bHQuZXJyb3IuZm9yYmlkZGVuVXNlcixlcnJvcn19YXN5bmMgZnVuY3Rpb24gcGFzc3dvcmQoZW1haWwscGFzc3dvcmQpe2lmKCFlbWFpbHx8IXBhc3N3b3JkKXtjb25zdCBlcnJvcj1uZXcgRXJyb3IoXCJFUlJPUjogZW1haWwgYW5kIHBhc3N3b3JkIG11c3QgYmUgcHJvdmlkZWRcIik7dGhyb3cgZXJyb3IuY29kZT1odHRwQ29kZXNfMS5kZWZhdWx0LmVycm9yLnVuYXV0aGVudGljYXRlZCxlcnJvcn1jb25zdCBlbWFpbEhhc2g9KDAsbm9kZVV0aWxzXzEuaGFzaCkoZW1haWwpLHBhc3N3b3JkSGFzaD0oMCxub2RlVXRpbHNfMS5oYXNoKShwYXNzd29yZCkscmVzdWx0PWF3YWl0IGxvZ2luXzEuZGVmYXVsdC5nZXRPbmUoe2VtYWlsSGFzaDplbWFpbEhhc2gscGFzc3dvcmRIYXNoOnBhc3N3b3JkSGFzaH0pO2lmKCFyZXN1bHQpe2NvbnN0IGVycm9yPW5ldyBFcnJvcihcIkVSUk9SOiBJbmNvcnJlY3QgZW1haWwgb3IgcGFzc3dvcmRcIik7dGhyb3cgZXJyb3IuY29kZT1odHRwQ29kZXNfMS5kZWZhdWx0LmVycm9yLnVuYXV0aGVudGljYXRlZCxlcnJvcn1jb25zdHt1c2VyX2lkOnVzZXJfaWQsdG9rZW46dG9rZW59PXJlc3VsdDtyZXR1cm57dXNlcl9pZDp1c2VyX2lkLHRva2VuOnRva2VufX1hc3luYyBmdW5jdGlvbiB0b2tlbihlbWFpbCx0b2tlbil7aWYoKDAsdXRpbGl0eUZ1bmN0aW9uc18xLmlzRW1wdHkpKGVtYWlsKXx8KDAsdXRpbGl0eUZ1bmN0aW9uc18xLmlzRW1wdHkpKHRva2VuKSl7Y29uc3QgZXJyb3I9bmV3IEVycm9yKFwiRVJST1I6IGluY29ycmVjdCBlbWFpbCBvciB0b2tlblwiKTt0aHJvdyBlcnJvci5jb2RlPWh0dHBDb2Rlc18xLmRlZmF1bHQuZXJyb3IudW5hdXRoZW50aWNhdGVkLGVycm9yfWNvbnN0IGVtYWlsSGFzaD0oMCxub2RlVXRpbHNfMS5oYXNoKShlbWFpbCk7aWYoIWVtYWlsSGFzaCl7Y29uc3QgZXJyb3I9bmV3IEVycm9yKFwiRVJST1I6IEludmFsaWQgZW1haWwgb3IgdG9rZW5cIik7dGhyb3cgZXJyb3IuY29kZT1odHRwQ29kZXNfMS5kZWZhdWx0LmVycm9yLnVuYXV0aGVudGljYXRlZCxlcnJvcn1jb25zdCByZXN1bHQ9dW5kZWZpbmVkO3JldHVybiBhd2FpdCBsb2dpbl8xLmRlZmF1bHQuZ2V0T25lKHtlbWFpbEhhc2g6ZW1haWxIYXNoLHRva2VuOnRva2VufSl9YXN5bmMgZnVuY3Rpb24gZ29vZ2xlKGVtYWlsLGdvb2dsZUlkKXtpZigoMCx1dGlsaXR5RnVuY3Rpb25zXzEuaXNFbXB0eSkoZW1haWwpfHwoMCx1dGlsaXR5RnVuY3Rpb25zXzEuaXNFbXB0eSkoZ29vZ2xlSWQpKXtjb25zdCBlcnJvcj1uZXcgRXJyb3IoXCJFUlJPUjogaW5jb3JyZWN0IGVtYWlsIG9yIGlkXCIpO3Rocm93IGVycm9yLmNvZGU9aHR0cENvZGVzXzEuZGVmYXVsdC5lcnJvci51bmF1dGhlbnRpY2F0ZWQsZXJyb3J9Y29uc3QgZW1haWxIYXNoPSgwLG5vZGVVdGlsc18xLmhhc2gpKGVtYWlsKTtpZighZW1haWxIYXNoKXtjb25zdCBlcnJvcj1uZXcgRXJyb3IoXCJFUlJPUjogSW52YWxpZCBlbWFpbCBvciB0b2tlblwiKTt0aHJvdyBlcnJvci5jb2RlPWh0dHBDb2Rlc18xLmRlZmF1bHQuZXJyb3IudW5hdXRoZW50aWNhdGVkLGVycm9yfWNvbnN0IHJlc3VsdD1hd2FpdCBsb2dpbl8xLmRlZmF1bHQuZ2V0T25lKHtlbWFpbEhhc2g6ZW1haWxIYXNoLGdvb2dsZUlkOmdvb2dsZUlkfSk7aWYoIXJlc3VsdCl7Y29uc3QgZXJyb3I9bmV3IEVycm9yKFwiRVJST1I6IEFuIGFjY291bnQgd2l0aCB0aGF0IGVtYWlsIHdhcyBub3QgZm91bmQuXCIpO3Rocm93IGVycm9yLmNvZGU9aHR0cENvZGVzXzEuZGVmYXVsdC5lcnJvci51bmF1dGhlbnRpY2F0ZWQsZXJyb3J9cmV0dXJuIHJlc3VsdH1leHBvcnRzLmRlZmF1bHQ9YXV0aGVudGljYXRlOyIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGV4cG9ydHMudXBkYXRlQ2FydD1leHBvcnRzLnNldENhcnQ9ZXhwb3J0cy5yZW1vdmVJdGVtRnJvbUNhcnQ9ZXhwb3J0cy5nZXRJdGVtc0J5Q2FydD1leHBvcnRzLmNyZWF0ZUNhcnQ9ZXhwb3J0cy5kZWxldGVDYXJ0QnlJZD1leHBvcnRzLmdldENhcnRCeVVzZXI9ZXhwb3J0cy5nZXRDYXJ0QnlUb2tlbj1leHBvcnRzLmdldENhcnRCeUlkPXZvaWQgMDtjb25zdCB1c2VyVXRpbHNfMT1yZXF1aXJlKFwiLi91c2VyVXRpbHNcIiksY2FydF8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vbWljcm9zZXJ2aWNlcy9wcm9kdWN0L2NvbnRyb2xsZXJzL2NhcnRcIikpLGl0ZW1fMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL21pY3Jvc2VydmljZXMvcHJvZHVjdC9jb250cm9sbGVycy9pdGVtXCIpKSx2YWxpZGF0ZV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vbWljcm9zZXJ2aWNlcy9wcm9kdWN0L21pZGRsZXdhcmUvdmFsaWRhdGVcIikpLHV0aWxpdHlGdW5jdGlvbnNfMT1yZXF1aXJlKFwiLi4vdXRpbHMvdXRpbGl0eUZ1bmN0aW9uc1wiKTthc3luYyBmdW5jdGlvbiBnZXRDYXJ0QnlJZChpZCl7dmFsaWRhdGVfMS5kZWZhdWx0LmNhcnRfaWQoaWQpO2NvbnN0IHJlc3VsdD11bmRlZmluZWQsY2FydD1hd2FpdCBjYXJ0XzEuZGVmYXVsdC5nZXRPbmUoe19pZDppZH0pO2lmKCFjYXJ0KXRocm93IG5ldyBFcnJvcihcIkVSUk9SOiBVbmFibGUgdG8gZ2V0IGNhcnQgYnkgaWRcIik7cmV0dXJuIHZhbGlkYXRlXzEuZGVmYXVsdC5jYXJ0KGNhcnQpLGNhcnQuaXRlbXM9YXdhaXQgZ2V0SXRlbXNCeUNhcnQoY2FydCksY2FydH1hc3luYyBmdW5jdGlvbiBnZXRDYXJ0QnlUb2tlbihlbWFpbCx0b2tlbil7Y29uc3QgdXNlcj1hd2FpdCgwLHVzZXJVdGlsc18xLmdldFVzZXJCeVRva2VuKShlbWFpbCx0b2tlbik7cmV0dXJuIGF3YWl0IGdldENhcnRCeUlkKHVzZXIuY2FydF9pZCl9YXN5bmMgZnVuY3Rpb24gZ2V0Q2FydEJ5VXNlcih1c2VyKXtjb25zdCBmb3JlaWduS2V5PXVzZXIuY2FydF9pZDtpZighZm9yZWlnbktleSl0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogbWlzc2luZyB1c2VyIGNhcnQgaW5mb3JtYXRpb25cIik7Y29uc3QgY2FydD11bmRlZmluZWQ7cmV0dXJuIGF3YWl0IGdldENhcnRCeUlkKGZvcmVpZ25LZXkpfWFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUNhcnRCeUlkKGlkKXtjb25zdCBjYXJ0PWF3YWl0IGdldENhcnRCeUlkKGlkKSxyZXN1bHQ9dW5kZWZpbmVkO3JldHVybiBhd2FpdCBjYXJ0XzEuZGVmYXVsdC5kZWxldGVPbmUoe19pZDppZH0pfWFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUNhcnQoKXtjb25zdCByZXN1bHQ9dW5kZWZpbmVkLF9pZD11bmRlZmluZWQ7cmV0dXJuKGF3YWl0IGNhcnRfMS5kZWZhdWx0LmFkZE9uZSgpKS5pbnNlcnRlZElkfWFzeW5jIGZ1bmN0aW9uIGdldEl0ZW1zQnlDYXJ0KGNhcnQpe2NvbnN0e2l0ZW1faWRzOml0ZW1faWRzfT1jYXJ0O2lmKCgwLHV0aWxpdHlGdW5jdGlvbnNfMS5pc0VtcHR5KShpdGVtX2lkcykpcmV0dXJuW107Y29uc3QgcmVzdWx0PXVuZGVmaW5lZDtyZXR1cm4gYXdhaXQgaXRlbV8xLmRlZmF1bHQuZ2V0T25lKHtfaWQ6eyRhbGw6Y2FydC5pdGVtX2lkc319KX1hc3luYyBmdW5jdGlvbiByZW1vdmVJdGVtRnJvbUNhcnQoY2FydCxpdGVtKXt2YWxpZGF0ZV8xLmRlZmF1bHQuY2FydChjYXJ0KSx2YWxpZGF0ZV8xLmRlZmF1bHQuaXRlbShpdGVtKTtjb25zdCBxdWVyeT17X2lkOmNhcnQuX2lkLCRwdWxsOntpdGVtczppdGVtLl9pZH19LGNhcnRSZXN1bHQ9YXdhaXQgY2FydF8xLmRlZmF1bHQudXBkYXRlT25lKHF1ZXJ5KSxyZXN1bHQ9dW5kZWZpbmVkO3JldHVybiBhd2FpdCBnZXRDYXJ0QnlJZChudWxsPT1jYXJ0P3ZvaWQgMDpjYXJ0Ll9pZCl9YXN5bmMgZnVuY3Rpb24gc2V0Q2FydChjYXJ0LGl0ZW1faWRzKXtjb25zdCBxdWVyeT1PYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sY2FydCkse2l0ZW1faWRzOml0ZW1faWRzfSkscmVzdWx0PWF3YWl0IGNhcnRfMS5kZWZhdWx0LnVwZGF0ZU9uZShxdWVyeSk7cmV0dXJuXCJTVUNDRVNTOiBjYXJ0IHVwZGF0ZWRcIn1hc3luYyBmdW5jdGlvbiB1cGRhdGVDYXJ0KGNhcnQsaXRlbSl7Y29uc3R7aXRlbV9pZHM6aXRlbV9pZHN9PWNhcnQse19pZDpfaWR9PWl0ZW0scXVlcnk9T2JqZWN0LmFzc2lnbih7fSxjYXJ0KSxjYXJ0UmVzdWx0PWF3YWl0IGNhcnRfMS5kZWZhdWx0LnVwZGF0ZU9uZShxdWVyeSkscmVzdWx0PXVuZGVmaW5lZDtyZXR1cm4gYXdhaXQgZ2V0Q2FydEJ5SWQoY2FydC5faWQpfWV4cG9ydHMuZ2V0Q2FydEJ5SWQ9Z2V0Q2FydEJ5SWQsZXhwb3J0cy5nZXRDYXJ0QnlUb2tlbj1nZXRDYXJ0QnlUb2tlbixleHBvcnRzLmdldENhcnRCeVVzZXI9Z2V0Q2FydEJ5VXNlcixleHBvcnRzLmRlbGV0ZUNhcnRCeUlkPWRlbGV0ZUNhcnRCeUlkLGV4cG9ydHMuY3JlYXRlQ2FydD1jcmVhdGVDYXJ0LGV4cG9ydHMuZ2V0SXRlbXNCeUNhcnQ9Z2V0SXRlbXNCeUNhcnQsZXhwb3J0cy5yZW1vdmVJdGVtRnJvbUNhcnQ9cmVtb3ZlSXRlbUZyb21DYXJ0LGV4cG9ydHMuc2V0Q2FydD1zZXRDYXJ0LGV4cG9ydHMudXBkYXRlQ2FydD11cGRhdGVDYXJ0OyIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2NvbnN0IHV0aWxpdHlGdW5jdGlvbnNfMT1yZXF1aXJlKFwiLi4vdXRpbHMvdXRpbGl0eUZ1bmN0aW9uc1wiKSxub2RlVXRpbHNfMT1yZXF1aXJlKFwiLi4vdXRpbHMvbm9kZVV0aWxzXCIpLGxvZ2luXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9taWNyb3NlcnZpY2VzL2N1c3RvbWVyL2NvbnRyb2xsZXJzL2xvZ2luXCIpKSxkYlRva2VuPXtpbnZhbGlkYXRlOmludmFsaWRhdGUscmV2b2tlOmludmFsaWRhdGVHb29nbGUsZ2V0TmV3OmdldE5ldyxzYXZlOnNhdmV9O2FzeW5jIGZ1bmN0aW9uIGludmFsaWRhdGUobG9naW5JZCl7Y29uc3QgcXVlcnk9e19pZDpsb2dpbklkLHRva2VuOlwiXCJ9LHJlc3VsdD11bmRlZmluZWQ7cmV0dXJuIGF3YWl0IGxvZ2luXzEuZGVmYXVsdC51cGRhdGVPbmUocXVlcnkpfWFzeW5jIGZ1bmN0aW9uIGludmFsaWRhdGVHb29nbGUobG9naW5JZCl7Y29uc3QgcXVlcnk9e19pZDpsb2dpbklkLHRva2VuOlwiXCIsYWNjZXNzVG9rZW46XCJcIixyZXZva2VUb2tlbjpcIlwifSxyZXN1bHQ9dW5kZWZpbmVkO3JldHVybiBhd2FpdCBsb2dpbl8xLmRlZmF1bHQudXBkYXRlT25lKHF1ZXJ5KX1mdW5jdGlvbiBnZXROZXcoZW1haWwpe2NvbnN0IHRva2VuPXVuZGVmaW5lZDtyZXR1cm4oMCxub2RlVXRpbHNfMS5oYXNoKShlbWFpbCsoMCx1dGlsaXR5RnVuY3Rpb25zXzEuZ2VuZXJhdGVLZXkpKCkpfWFzeW5jIGZ1bmN0aW9uIHNhdmUoZW1haWwsdG9rZW4sYWNjZXNzVG9rZW4scmV2b2tlVG9rZW4pe2NvbnN0IGVtYWlsSGFzaD0oMCxub2RlVXRpbHNfMS5oYXNoKShlbWFpbCksbG9naW5SZXN1bHQ9YXdhaXQgbG9naW5fMS5kZWZhdWx0LmdldE9uZSh7ZW1haWxIYXNoOmVtYWlsSGFzaH0pLHtfaWQ6X2lkfT1sb2dpblJlc3VsdCx1cGRhdGVJbmZvPXtfaWQ6X2lkLHRva2VuOnRva2VufTthY2Nlc3NUb2tlbiYmKHVwZGF0ZUluZm8uYWNjZXNzVG9rZW49YWNjZXNzVG9rZW4pLHJldm9rZVRva2VuJiYodXBkYXRlSW5mby5yZXZva2VUb2tlbj1yZXZva2VUb2tlbik7Y29uc3QgcmVzdWx0PXVuZGVmaW5lZDtyZXR1cm4gYXdhaXQgbG9naW5fMS5kZWZhdWx0LnVwZGF0ZU9uZSh1cGRhdGVJbmZvKX1leHBvcnRzLmRlZmF1bHQ9ZGJUb2tlbjsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLnJlc3RvcmVEZXBlbmRlbmNpZXM9ZXhwb3J0cy5pbmplY3REZXBlbmRlbmNpZXM9ZXhwb3J0cy5nZXRJbnZlbnRvcnk9dm9pZCAwO2NvbnN0IGludmVudG9yeV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vbWljcm9zZXJ2aWNlcy9wcm9kdWN0L2NvbnRyb2xsZXJzL2ludmVudG9yeVwiKSksaXRlbVV0aWxzXzE9cmVxdWlyZShcIi4vaXRlbVV0aWxzXCIpO2xldCBpbnZlbnRvcmllcz1pbnZlbnRvcnlfMS5kZWZhdWx0O2FzeW5jIGZ1bmN0aW9uIGdldEludmVudG9yeSgpe2NvbnN0IGludmVudG9yeVJlc3VsdD11bmRlZmluZWQsaW52ZW50b3J5PWF3YWl0IGludmVudG9yaWVzLmdldE9uZSgpLGl0ZW1SZXN1bHRzPXVuZGVmaW5lZCxpdGVtTGlzdD1hd2FpdCgwLGl0ZW1VdGlsc18xLmdldEl0ZW1zQnlJZCkoaW52ZW50b3J5Lml0ZW1faWRzKSxpbnZlbnRvcnlFbmhhbmNlZD11bmRlZmluZWQ7cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSxpbnZlbnRvcnkpLHtpdGVtczppdGVtTGlzdH0pfWZ1bmN0aW9uIGluamVjdERlcGVuZGVuY2llcyhpbnZlbnRvcnlDb250cm9sbGVyLGl0ZW1Db250cm9sbGVyKXtpbnZlbnRvcmllcz1pbnZlbnRvcnlDb250cm9sbGVyLCgwLGl0ZW1VdGlsc18xLmluamVjdERlcGVuZGVuY3kpKGl0ZW1Db250cm9sbGVyKX1mdW5jdGlvbiByZXN0b3JlRGVwZW5kZW5jaWVzKCl7aW52ZW50b3JpZXM9aW52ZW50b3J5XzEuZGVmYXVsdCwoMCxpdGVtVXRpbHNfMS5yZXN0b3JlRGVwZW5kZW5jeSkoKX1leHBvcnRzLmdldEludmVudG9yeT1nZXRJbnZlbnRvcnksZXhwb3J0cy5pbmplY3REZXBlbmRlbmNpZXM9aW5qZWN0RGVwZW5kZW5jaWVzLGV4cG9ydHMucmVzdG9yZURlcGVuZGVuY2llcz1yZXN0b3JlRGVwZW5kZW5jaWVzOyIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGV4cG9ydHMucmVzdG9yZURlcGVuZGVuY3k9ZXhwb3J0cy5pbmplY3REZXBlbmRlbmN5PWV4cG9ydHMuZ2V0VmVyaWZpZWRJdGVtSWQ9ZXhwb3J0cy5nZXRJdGVtc0J5SWQ9ZXhwb3J0cy5nZXRJdGVtQnlJZD12b2lkIDA7Y29uc3QgdXRpbGl0eUZ1bmN0aW9uc18xPXJlcXVpcmUoXCIuLi91dGlscy91dGlsaXR5RnVuY3Rpb25zXCIpLGl0ZW1fMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL21pY3Jvc2VydmljZXMvcHJvZHVjdC9jb250cm9sbGVycy9pdGVtXCIpKTtsZXQgaXRlbXM9aXRlbV8xLmRlZmF1bHQ7YXN5bmMgZnVuY3Rpb24gZ2V0SXRlbUJ5SWQoaWQpe2xldCBxdWVyeTtjb25zdCBpdGVtPXVuZGVmaW5lZDtyZXR1cm4gYXdhaXQgaXRlbXMuZ2V0T25lKHtfaWQ6aWR9KX1hc3luYyBmdW5jdGlvbiBnZXRJdGVtc0J5SWQoaWRMaXN0KXtpZigoMCx1dGlsaXR5RnVuY3Rpb25zXzEuaXNFbXB0eSkoaWRMaXN0KSl0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogaXRlbSBpZHMgYXJlIHJlcXVpcmVkXCIpO2xldCBxdWVyeT17X2lkOnskaW46aWRMaXN0fX07Y29uc3QgaXRlbUxpc3Q9dW5kZWZpbmVkO3JldHVybiBhd2FpdCBpdGVtcy5nZXRNYW55KHF1ZXJ5KX1hc3luYyBmdW5jdGlvbiBnZXRWZXJpZmllZEl0ZW1JZCgpe2NvbnN0IGl0ZW09dW5kZWZpbmVkO3JldHVybihhd2FpdCBpdGVtcy5nZXRPbmUoKSkuX2lkfWZ1bmN0aW9uIGluamVjdERlcGVuZGVuY3koaXRlbUNvbnRyb2xsZXIpe2l0ZW1zPWl0ZW1Db250cm9sbGVyfWZ1bmN0aW9uIHJlc3RvcmVEZXBlbmRlbmN5KCl7aXRlbXM9aXRlbV8xLmRlZmF1bHR9ZXhwb3J0cy5nZXRJdGVtQnlJZD1nZXRJdGVtQnlJZCxleHBvcnRzLmdldEl0ZW1zQnlJZD1nZXRJdGVtc0J5SWQsZXhwb3J0cy5nZXRWZXJpZmllZEl0ZW1JZD1nZXRWZXJpZmllZEl0ZW1JZCxleHBvcnRzLmluamVjdERlcGVuZGVuY3k9aW5qZWN0RGVwZW5kZW5jeSxleHBvcnRzLnJlc3RvcmVEZXBlbmRlbmN5PXJlc3RvcmVEZXBlbmRlbmN5OyIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2NvbnN0IGF1dGhlbnRpY2F0ZV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9hdXRoZW50aWNhdGVcIikpLGRiVG9rZW5fMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZGJUb2tlblwiKSksZXJyb3JVdGlsc18xPXJlcXVpcmUoXCIuLi91dGlscy9lcnJvclV0aWxzXCIpLHZlcmlmeV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vbWljcm9zZXJ2aWNlcy9jdXN0b21lci9taWRkbGV3YXJlL3ZlcmlmeVwiKSksbG9naW49e3dpdGhUb2tlbjp3aXRoVG9rZW4sd2l0aFBhc3N3b3JkOndpdGhQYXNzd29yZCx3aXRoR29vZ2xlOndpdGhHb29nbGV9O2FzeW5jIGZ1bmN0aW9uIHdpdGhQYXNzd29yZChyZXF1ZXN0LHJlc3BvbnNlKXtjb25zdHtlbWFpbDplbWFpbCxwYXNzd29yZDpwYXNzd29yZH09cmVxdWVzdC5ib2R5O3RyeXt2ZXJpZnlfMS5kZWZhdWx0LmxvZ2luQXR0ZW1wdHMoZW1haWwpO2NvbnN0e3Rva2VuOnRva2VufT1hd2FpdCBhdXRoZW50aWNhdGVfMS5kZWZhdWx0LnBhc3N3b3JkKGVtYWlsLHBhc3N3b3JkKSxhdXRoSW5mbz17ZW1haWw6ZW1haWwsdG9rZW46dG9rZW4saXNUZW1wb3Jhcnk6ITF9O3Rva2VufHwoYXV0aEluZm8udG9rZW49ZGJUb2tlbl8xLmRlZmF1bHQuZ2V0TmV3KGVtYWlsKSxhd2FpdCBkYlRva2VuXzEuZGVmYXVsdC5zYXZlKGVtYWlsLGF1dGhJbmZvLnRva2VuKSkscmVzcG9uc2Uuc3RhdHVzKDIwMCkuc2VuZChhdXRoSW5mbyl9Y2F0Y2goYXN5bmNFcnJvcil7Y29uc3R7ZXJyb3I6ZXJyb3IsY29kZTpjb2RlLG1lc3NhZ2U6bWVzc2FnZX09YXdhaXQoMCxlcnJvclV0aWxzXzEuaGFuZGxlQXN5bmNFcnJvcikoYXN5bmNFcnJvcik7cmVzcG9uc2Uuc3RhdHVzKGNvZGUpLnNlbmQobWVzc2FnZSl9fWFzeW5jIGZ1bmN0aW9uIHdpdGhUb2tlbihyZXF1ZXN0LHJlc3BvbnNlLG5leHQpe2NvbnN0e2VtYWlsOmVtYWlsLHRva2VuOnRva2VufT1yZXF1ZXN0LmJvZHk7aWYoIXRva2VuKXJldHVybiBuZXh0KCk7dHJ5e2NvbnN0IGxvZ2luSW5mbz1hd2FpdCBhdXRoZW50aWNhdGVfMS5kZWZhdWx0LnRva2VuKGVtYWlsLHRva2VuKTtpZighbG9naW5JbmZvKXJldHVybiByZXNwb25zZS5zdGF0dXMoNDAxKS5zZW5kKFwiRVJST1I6IEludmFsaWQgZW1haWwgb3IgdG9rZW5cIik7Y29uc3QgZGF0YT17ZW1haWw6ZW1haWwsdG9rZW46dG9rZW4saXNUZW1wb3Jhcnk6ITEsZ29vZ2xlSWQ6bG9naW5JbmZvLmdvb2dsZUlkfTtyZXNwb25zZS5zdGF0dXMoMjAwKS5zZW5kKGRhdGEpfWNhdGNoKGFzeW5jRXJyb3Ipe2NvbnN0e2Vycm9yOmVycm9yLGNvZGU6Y29kZSxtZXNzYWdlOm1lc3NhZ2V9PWF3YWl0KDAsZXJyb3JVdGlsc18xLmhhbmRsZUFzeW5jRXJyb3IpKGFzeW5jRXJyb3IpO3Jlc3BvbnNlLnN0YXR1cyhjb2RlKS5zZW5kKG1lc3NhZ2UpfX1hc3luYyBmdW5jdGlvbiB3aXRoR29vZ2xlKHJlcXVlc3QscmVzcG9uc2UsbmV4dCl7dHJ5e2NvbnN0e2VtYWlsOmVtYWlsLGdvb2dsZUlkOmdvb2dsZUlkfT1yZXF1ZXN0LmJvZHk7aWYoIWdvb2dsZUlkKXJldHVybiBuZXh0KCk7Y29uc3R7dG9rZW46dG9rZW59PWF3YWl0IGF1dGhlbnRpY2F0ZV8xLmRlZmF1bHQuZ29vZ2xlKGVtYWlsLGdvb2dsZUlkKSxhdXRoSW5mbz17ZW1haWw6ZW1haWwsdG9rZW46dG9rZW4saXNUZW1wb3Jhcnk6ITF9O3Rva2VufHwoYXV0aEluZm8udG9rZW49ZGJUb2tlbl8xLmRlZmF1bHQuZ2V0TmV3KGVtYWlsKSxhd2FpdCBkYlRva2VuXzEuZGVmYXVsdC5zYXZlKGVtYWlsLGF1dGhJbmZvLnRva2VuKSkscmVzcG9uc2Uuc3RhdHVzKDIwMCkuc2VuZChhdXRoSW5mbyl9Y2F0Y2goYXN5bmNFcnJvcil7Y29uc3R7ZXJyb3I6ZXJyb3IsY29kZTpjb2RlLG1lc3NhZ2U6bWVzc2FnZX09YXdhaXQoMCxlcnJvclV0aWxzXzEuaGFuZGxlQXN5bmNFcnJvcikoYXN5bmNFcnJvcik7cmVzcG9uc2Uuc3RhdHVzKGNvZGUpLnNlbmQobWVzc2FnZSl9fWV4cG9ydHMuZGVmYXVsdD1sb2dpbjsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLmxvZ2luV2l0aFRva2VuPWV4cG9ydHMubG9naW5XaXRoUGFzc3dvcmQ9ZXhwb3J0cy5kZWxldGVMb2dpbkJ5RW1haWw9ZXhwb3J0cy5nZXRVc2VySWRCeVBhc3N3b3JkPWV4cG9ydHMuY3JlYXRlTG9naW5CeUdvb2dsZT1leHBvcnRzLmNyZWF0ZUxvZ2luQnlQYXNzd29yZD12b2lkIDA7Y29uc3Qgbm9kZVV0aWxzXzE9cmVxdWlyZShcIi4uL3V0aWxzL25vZGVVdGlsc1wiKSxkYlRva2VuXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2RiVG9rZW5cIikpLHZhbGlkYXRlXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9taWNyb3NlcnZpY2VzL2N1c3RvbWVyL21pZGRsZXdhcmUvdmFsaWRhdGVcIikpLHZlcmlmeV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vbWljcm9zZXJ2aWNlcy9jdXN0b21lci9taWRkbGV3YXJlL3ZlcmlmeVwiKSksbG9naW5fMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL21pY3Jvc2VydmljZXMvY3VzdG9tZXIvY29udHJvbGxlcnMvbG9naW5cIikpLHVzZXJfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL21pY3Jvc2VydmljZXMvY3VzdG9tZXIvY29udHJvbGxlcnMvdXNlclwiKSksdXNlclV0aWxzXzE9cmVxdWlyZShcIi4vdXNlclV0aWxzXCIpO2FzeW5jIGZ1bmN0aW9uIGNyZWF0ZUxvZ2luQnlQYXNzd29yZChlbWFpbCxwYXNzd29yZCx1c2VyKXt2YWxpZGF0ZV8xLmRlZmF1bHQuZW1haWwoZW1haWwpLHZhbGlkYXRlXzEuZGVmYXVsdC5wYXNzd29yZChwYXNzd29yZCksdmFsaWRhdGVfMS5kZWZhdWx0LnVzZXIodXNlcixcIkVSUk9SOiB1c2VyIGlzIHJlcXVpcmVkXCIpLGF3YWl0IHZlcmlmeV8xLmRlZmF1bHQuc2lnbnVwRW1haWwoZW1haWwpO2NvbnN0IGVtYWlsSGFzaD0oMCxub2RlVXRpbHNfMS5oYXNoKShlbWFpbCkscGFzc3dvcmRIYXNoPSgwLG5vZGVVdGlsc18xLmhhc2gpKHBhc3N3b3JkKSx1c2VyX2lkPXVzZXIuX2lkLGxvZ2luUmVzdWx0PXVuZGVmaW5lZDtyZXR1cm4gYXdhaXQgbG9naW5fMS5kZWZhdWx0LmFkZE9uZSh7ZW1haWxIYXNoOmVtYWlsSGFzaCxwYXNzd29yZEhhc2g6cGFzc3dvcmRIYXNoLHVzZXJfaWQ6dXNlcl9pZH0pfWFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUxvZ2luQnlHb29nbGUoZW1haWwsdXNlcl9pZCxnb29nbGVJZCl7dmFsaWRhdGVfMS5kZWZhdWx0LmVtYWlsKGVtYWlsKSx2YWxpZGF0ZV8xLmRlZmF1bHQudXNlcklkKHVzZXJfaWQsXCJFUlJPUjogdXNlcklkIGlzIHJlcXVpcmVkXCIpLGF3YWl0IHZlcmlmeV8xLmRlZmF1bHQuc2lnbnVwRW1haWwoZW1haWwpO2NvbnN0IGVtYWlsSGFzaD0oMCxub2RlVXRpbHNfMS5oYXNoKShlbWFpbCksbG9naW5SZXN1bHQ9dW5kZWZpbmVkO3JldHVybiBhd2FpdCBsb2dpbl8xLmRlZmF1bHQuYWRkT25lKHtlbWFpbEhhc2g6ZW1haWxIYXNoLHVzZXJfaWQ6dXNlcl9pZCxnb29nbGVJZDpnb29nbGVJZH0pfWFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxvZ2luQnlFbWFpbChlbWFpbCl7dmFsaWRhdGVfMS5kZWZhdWx0LmVtYWlsKGVtYWlsKTtjb25zdCBlbWFpbEhhc2g9KDAsbm9kZVV0aWxzXzEuaGFzaCkoZW1haWwpLHJlc3VsdD11bmRlZmluZWQ7cmV0dXJuIGF3YWl0IGxvZ2luXzEuZGVmYXVsdC5kZWxldGVPbmUoe2VtYWlsSGFzaDplbWFpbEhhc2h9KX1hc3luYyBmdW5jdGlvbiBnZXRVc2VySWRCeVBhc3N3b3JkKGVtYWlsLHBhc3N3b3JkKXt2YWxpZGF0ZV8xLmRlZmF1bHQuZW1haWwoZW1haWwpLHZhbGlkYXRlXzEuZGVmYXVsdC5wYXNzd29yZChwYXNzd29yZCk7Y29uc3QgZW1haWxIYXNoPSgwLG5vZGVVdGlsc18xLmhhc2gpKGVtYWlsKSxwYXNzd29yZEhhc2g9KDAsbm9kZVV0aWxzXzEuaGFzaCkocGFzc3dvcmQpLHJlc3VsdD1hd2FpdCBsb2dpbl8xLmRlZmF1bHQuZ2V0T25lKHtlbWFpbEhhc2g6ZW1haWxIYXNoLHBhc3N3b3JkSGFzaDpwYXNzd29yZEhhc2h9KSx1c2VyX2lkPXVuZGVmaW5lZDtyZXR1cm4gbnVsbD09cmVzdWx0P3ZvaWQgMDpyZXN1bHQudXNlcl9pZH1hc3luYyBmdW5jdGlvbiBsb2dpbldpdGhQYXNzd29yZChlbWFpbCxwYXNzd29yZCl7dmFsaWRhdGVfMS5kZWZhdWx0LmVtYWlsKGVtYWlsKSx2YWxpZGF0ZV8xLmRlZmF1bHQucGFzc3dvcmQocGFzc3dvcmQpO2NvbnN0IGVtYWlsSGFzaD0oMCxub2RlVXRpbHNfMS5oYXNoKShlbWFpbCkscGFzc3dvcmRIYXNoPSgwLG5vZGVVdGlsc18xLmhhc2gpKHBhc3N3b3JkKSxyZXN1bHQ9YXdhaXQgbG9naW5fMS5kZWZhdWx0LmdldE9uZSh7ZW1haWxIYXNoOmVtYWlsSGFzaCxwYXNzd29yZEhhc2g6cGFzc3dvcmRIYXNofSk7bGV0IHRva2VuPW51bGw9PXJlc3VsdD92b2lkIDA6cmVzdWx0LnRva2VuO3Rva2VufHwodG9rZW49ZGJUb2tlbl8xLmRlZmF1bHQuZ2V0TmV3KGVtYWlsKSxhd2FpdCBkYlRva2VuXzEuZGVmYXVsdC5zYXZlKGVtYWlsLHRva2VuKSk7Y29uc3QgdXNlclJlc3VsdD1hd2FpdCB1c2VyXzEuZGVmYXVsdC5nZXRPbmUoe19pZDpyZXN1bHQudXNlcl9pZH0pO2lmKCF1c2VyUmVzdWx0KXRocm93IG5ldyBFcnJvcihcIkVSUk9SOiBpbnZhbGlkIGxvZ2luXCIpO2NvbnN0IHVzZXI9dW5kZWZpbmVkO3JldHVybnt1c2VyOnVzZXJSZXN1bHQsdG9rZW46dG9rZW59fWFzeW5jIGZ1bmN0aW9uIGxvZ2luV2l0aFRva2VuKGVtYWlsLHRva2VuKXt2YWxpZGF0ZV8xLmRlZmF1bHQuZW1haWwoZW1haWwpLHZhbGlkYXRlXzEuZGVmYXVsdC50b2tlbih0b2tlbik7Y29uc3QgZW1haWxIYXNoPSgwLG5vZGVVdGlsc18xLmhhc2gpKGVtYWlsKSxsb2dpbj1hd2FpdCBsb2dpbl8xLmRlZmF1bHQuZ2V0T25lKHtlbWFpbEhhc2g6ZW1haWxIYXNoLHRva2VuOnRva2VufSk7aWYoIWxvZ2luKXRocm93IG5ldyBFcnJvcihcIkVSUk9SOiBpbnZhbGlkIGxvZ2luXCIpO2NvbnN0e3VzZXJfaWQ6dXNlcl9pZH09bG9naW4sdXNlcj11bmRlZmluZWQ7cmV0dXJuIGF3YWl0KDAsdXNlclV0aWxzXzEuZ2V0VXNlckJ5SWQpKHVzZXJfaWQpfWV4cG9ydHMuY3JlYXRlTG9naW5CeVBhc3N3b3JkPWNyZWF0ZUxvZ2luQnlQYXNzd29yZCxleHBvcnRzLmNyZWF0ZUxvZ2luQnlHb29nbGU9Y3JlYXRlTG9naW5CeUdvb2dsZSxleHBvcnRzLmRlbGV0ZUxvZ2luQnlFbWFpbD1kZWxldGVMb2dpbkJ5RW1haWwsZXhwb3J0cy5nZXRVc2VySWRCeVBhc3N3b3JkPWdldFVzZXJJZEJ5UGFzc3dvcmQsZXhwb3J0cy5sb2dpbldpdGhQYXNzd29yZD1sb2dpbldpdGhQYXNzd29yZCxleHBvcnRzLmxvZ2luV2l0aFRva2VuPWxvZ2luV2l0aFRva2VuOyIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2NvbnN0IGF1dGhlbnRpY2F0ZV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9hdXRoZW50aWNhdGVcIikpLGRiVG9rZW5fMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZGJUb2tlblwiKSksZXJyb3JVdGlsc18xPXJlcXVpcmUoXCIuLi91dGlscy9lcnJvclV0aWxzXCIpLGxvZ291dD17d2l0aFRva2VuOndpdGhUb2tlbn07YXN5bmMgZnVuY3Rpb24gd2l0aFRva2VuKHJlcXVlc3QscmVzcG9uc2Upe3RyeXtjb25zdHtlbWFpbDplbWFpbCx0b2tlbjp0b2tlbn09cmVxdWVzdC5ib2R5LHJlc3VsdD1hd2FpdCBhdXRoZW50aWNhdGVfMS5kZWZhdWx0LnRva2VuKGVtYWlsLHRva2VuKSx7X2lkOl9pZH09cmVzdWx0O2F3YWl0IGRiVG9rZW5fMS5kZWZhdWx0LmludmFsaWRhdGUoX2lkKSxyZXNwb25zZS5zdGF0dXMoMjAwKS5zZW5kKFwiU1VDQ0VTUzogbG9nZ2VkIG91dFwiKX1jYXRjaChhc3luY0Vycm9yKXtjb25zdHtlcnJvcjplcnJvcixjb2RlOmNvZGUsbWVzc2FnZTptZXNzYWdlfT1hd2FpdCgwLGVycm9yVXRpbHNfMS5oYW5kbGVBc3luY0Vycm9yKShhc3luY0Vycm9yKTtyZXNwb25zZS5zdGF0dXMoY29kZSkuc2VuZChtZXNzYWdlKX19ZXhwb3J0cy5kZWZhdWx0PWxvZ291dDsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTtjb25zdCBtYWlsXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJAc2VuZGdyaWQvbWFpbFwiKSksZG90ZW52XzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkb3RlbnZcIikpLGVycm9yVXRpbHNfMT1yZXF1aXJlKFwiLi4vdXRpbHMvZXJyb3JVdGlsc1wiKTtkb3RlbnZfMS5kZWZhdWx0LmNvbmZpZygpO2NvbnN0IHNlbmRFbWFpbD17c2lnbnVwQ29uZmlybWF0aW9uOnNpZ251cENvbmZpcm1hdGlvbixkZWxldGVDb25maXJtYXRpb246ZGVsZXRlQ29uZmlybWF0aW9ufTtmdW5jdGlvbiBzaWdudXBDb25maXJtYXRpb24oZW1haWwpe2lmKGlzVGVzdEVtYWlsKGVtYWlsKSlyZXR1cm47Y29uc3QgbWVzc2FnZT11bmRlZmluZWQ7c2VuZCh7ZnJvbTpcInJvbGF6YXJhYmVyaW4udGVzdEBnbWFpbC5jb21cIix0bzplbWFpbCxzdWJqZWN0OlwiU2lnbnVwIENvbmZpcm1hdGlvblwiLHRleHQ6YCR7ZW1haWx9IGhhcyBiZWVuIHNpZ25lZCB1cCBmb3IgT25saW5lIFN0b3JlYCxodG1sOmA8cD4ke2VtYWlsfSBoYXMgYmVlbiBzaWduZWQgdXAgZm9yIE9ubGluZSBTdG9yZTwvcD5gfSl9ZnVuY3Rpb24gZGVsZXRlQ29uZmlybWF0aW9uKGVtYWlsKXtpZihpc1Rlc3RFbWFpbChlbWFpbCkpcmV0dXJuO2NvbnN0IG1lc3NhZ2U9dW5kZWZpbmVkO3NlbmQoe2Zyb206XCJyb2xhemFyYWJlcmluLnRlc3RAZ21haWwuY29tXCIsdG86ZW1haWwsc3ViamVjdDpcIkRlbGV0ZSBDb25maXJtYXRpb25cIix0ZXh0OmAke2VtYWlsfSBoYXMgYmVlbiBkZWxldGVkIGZyb20gT25saW5lIFN0b3JlYCxodG1sOmA8cD4ke2VtYWlsfSBoYXMgYmVlbiBkZWxldGVkIGZyb20gT25saW5lIFN0b3JlPC9wPmB9KX1hc3luYyBmdW5jdGlvbiBzZW5kKG1lc3NhZ2Upe3RyeXtjb25zdCByZXN1bHQ9dW5kZWZpbmVkO3JldHVybihhd2FpdCBtYWlsXzEuZGVmYXVsdC5zZW5kKG1lc3NhZ2UpKVswXS5zdGF0dXNDb2RlfWNhdGNoKGFzeW5jRXJyb3Ipe2NvbnN0e2Vycm9yOmVycm9yLGNvZGU6Y29kZSxtZXNzYWdlOm1lc3NhZ2V9PWF3YWl0KDAsZXJyb3JVdGlsc18xLmhhbmRsZUFzeW5jRXJyb3IpKGFzeW5jRXJyb3IpO2NvbnNvbGUubG9nKGVycm9yKX19ZnVuY3Rpb24gaXNUZXN0RW1haWwoZW1haWwpe3N3aXRjaChlbWFpbCl7Y2FzZVwibmV3QGVtYWlsLmNvbVwiOmNhc2VcInRlbXBAZW1haWwuY29tXCI6Y2FzZVwidGVtcG9yYXJ5QGVtYWlsLmNvbVwiOmNhc2VcImNvcnJlY3RAZW1haWwuY29tXCI6Y2FzZVwicGVybWFuZW50QGVtYWlsLmNvbVwiOnJldHVybiEwfXJldHVybiExfWV4cG9ydHMuZGVmYXVsdD1zZW5kRW1haWwsbWFpbF8xLmRlZmF1bHQuc2V0QXBpS2V5KHByb2Nlc3MuZW52LnNlbmRHcmlkQXBpS2V5KTsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTtjb25zdCBzZW5kRW1haWxfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vc2VuZEVtYWlsXCIpKSxkb3RlbnZfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRvdGVudlwiKSksYWNjb3VudFV0aWxzXzE9cmVxdWlyZShcIi4vYWNjb3VudFV0aWxzXCIpLGVycm9yVXRpbHNfMT1yZXF1aXJlKFwiLi4vdXRpbHMvZXJyb3JVdGlsc1wiKSx2ZXJpZnlfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL21pY3Jvc2VydmljZXMvY3VzdG9tZXIvbWlkZGxld2FyZS92ZXJpZnlcIikpLHNpZ251cD17d2l0aFBhc3N3b3JkOndpdGhQYXNzd29yZCx3aXRoR29vZ2xlOndpdGhHb29nbGV9O2V4cG9ydHMuZGVmYXVsdD1zaWdudXAsZG90ZW52XzEuZGVmYXVsdC5jb25maWcoKTtjb25zdCBkaXNhYmxlRW1haWxzPXByb2Nlc3MuZW52LmRpc2FibGVFbWFpbHM7YXN5bmMgZnVuY3Rpb24gd2l0aFBhc3N3b3JkKHJlcXVlc3QscmVzcG9uc2UsX25leHQpe3RyeXtjb25zdHtlbWFpbDplbWFpbCxwYXNzd29yZDpwYXNzd29yZH09cmVxdWVzdC5ib2R5O2F3YWl0IHZlcmlmeV8xLmRlZmF1bHQuc2lnbnVwRW1haWwoZW1haWwpO2NvbnN0e3VzZXI6dXNlcix0b2tlbjp0b2tlbn09YXdhaXQoMCxhY2NvdW50VXRpbHNfMS5jcmVhdGVBY2NvdW50QnlQYXNzd29yZCkoZW1haWwscGFzc3dvcmQpO3Jlc3BvbnNlLnN0YXR1cygyMDApLnNlbmQoe2VtYWlsOnVzZXIuZW1haWwsdG9rZW46dG9rZW59KSxcInRydWVcIiE9PWRpc2FibGVFbWFpbHMmJnNlbmRFbWFpbF8xLmRlZmF1bHQuc2lnbnVwQ29uZmlybWF0aW9uKGVtYWlsKX1jYXRjaChhc3luY0Vycm9yKXtjb25zdHtlcnJvcjplcnJvcixjb2RlOmNvZGUsbWVzc2FnZTptZXNzYWdlfT1hd2FpdCgwLGVycm9yVXRpbHNfMS5oYW5kbGVBc3luY0Vycm9yKShhc3luY0Vycm9yKTtyZXNwb25zZS5zdGF0dXMoY29kZSkuc2VuZChtZXNzYWdlKX19YXN5bmMgZnVuY3Rpb24gd2l0aEdvb2dsZShyZXF1ZXN0LHJlc3BvbnNlLG5leHQpe3RyeXtjb25zdHtlbWFpbDplbWFpbCxuYW1lOm5hbWUsZ29vZ2xlSWQ6Z29vZ2xlSWR9PXJlcXVlc3QuYm9keTtpZighZ29vZ2xlSWQpcmV0dXJuIG5leHQoKTthd2FpdCB2ZXJpZnlfMS5kZWZhdWx0LnNpZ251cEVtYWlsKGVtYWlsKTtjb25zdHt1c2VyOnVzZXIsdG9rZW46dG9rZW59PWF3YWl0KDAsYWNjb3VudFV0aWxzXzEuY3JlYXRlQWNjb3VudEJ5R29vZ2xlKShlbWFpbCxuYW1lLGdvb2dsZUlkKTtyZXNwb25zZS5zdGF0dXMoMjAwKS5zZW5kKHtlbWFpbDp1c2VyLmVtYWlsLHRva2VuOnRva2VufSksXCJ0cnVlXCIhPT1kaXNhYmxlRW1haWxzJiZzZW5kRW1haWxfMS5kZWZhdWx0LnNpZ251cENvbmZpcm1hdGlvbihlbWFpbCl9Y2F0Y2goYXN5bmNFcnJvcil7Y29uc3R7ZXJyb3I6ZXJyb3IsY29kZTpjb2RlLG1lc3NhZ2U6bWVzc2FnZX09YXdhaXQoMCxlcnJvclV0aWxzXzEuaGFuZGxlQXN5bmNFcnJvcikoYXN5bmNFcnJvcik7cmVzcG9uc2Uuc3RhdHVzKGNvZGUpLnNlbmQobWVzc2FnZSl9fSIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2NvbnN0IHNlbmRFbWFpbF8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9zZW5kRW1haWxcIikpLGRvdGVudl8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZG90ZW52XCIpKSxlcnJvclV0aWxzXzE9cmVxdWlyZShcIi4uL3V0aWxzL2Vycm9yVXRpbHNcIiksYWNjb3VudFV0aWxzXzE9cmVxdWlyZShcIi4vYWNjb3VudFV0aWxzXCIpLHVzZXI9e2ZldGNoSW5mbzpmZXRjaEluZm8sZGVsZXRlOmRlbH07ZXhwb3J0cy5kZWZhdWx0PXVzZXIsZG90ZW52XzEuZGVmYXVsdC5jb25maWcoKTtjb25zdCBkaXNhYmxlRW1haWxzPXByb2Nlc3MuZW52LmRpc2FibGVFbWFpbHM7YXN5bmMgZnVuY3Rpb24gZmV0Y2hJbmZvKHJlcXVlc3QscmVzcG9uc2Upe3RyeXtjb25zdHtlbWFpbDplbWFpbCx0b2tlbjp0b2tlbn09cmVxdWVzdC5ib2R5LGFjY291bnQ9YXdhaXQoMCxhY2NvdW50VXRpbHNfMS5nZXRBY2NvdW50QnlUb2tlbikoZW1haWwsdG9rZW4pO2lmKCFhY2NvdW50KXJldHVybiByZXNwb25zZS5zdGF0dXMoNDAxKS5zZW5kKFwiRVJST1I6IENhbm5vdCByZXRyaWV2ZSBhY2NvdW50XCIpO3Jlc3BvbnNlLnN0YXR1cygyMDApLnNlbmQoYWNjb3VudCl9Y2F0Y2goYXN5bmNFcnJvcil7Y29uc3R7ZXJyb3I6ZXJyb3IsbWVzc2FnZTptZXNzYWdlLGNvZGU6Y29kZX09YXdhaXQoMCxlcnJvclV0aWxzXzEuaGFuZGxlQXN5bmNFcnJvcikoYXN5bmNFcnJvcik7cmVzcG9uc2Uuc3RhdHVzKGNvZGUpLnNlbmQobWVzc2FnZSl9fWFzeW5jIGZ1bmN0aW9uIGRlbChyZXF1ZXN0LHJlc3BvbnNlKXt0cnl7Y29uc3R7ZW1haWw6ZW1haWwscGFzc3dvcmQ6cGFzc3dvcmQsdG9rZW46dG9rZW59PXJlcXVlc3QuYm9keTtwYXNzd29yZD9hd2FpdCgwLGFjY291bnRVdGlsc18xLmRlbGV0ZUFjY291bnRCeVBhc3N3b3JkKShlbWFpbCxwYXNzd29yZCk6dG9rZW4mJmF3YWl0KDAsYWNjb3VudFV0aWxzXzEuZGVsZXRlQWNjb3VudEJ5VG9rZW4pKGVtYWlsLHRva2VuKSxyZXNwb25zZS5zdGF0dXMoMjAwKS5zZW5kKFwiU1VDQ0VTUzogQWNjb3VudCBkZWxldGVkXCIpLFwidHJ1ZVwiIT09ZGlzYWJsZUVtYWlscyYmc2VuZEVtYWlsXzEuZGVmYXVsdC5kZWxldGVDb25maXJtYXRpb24oZW1haWwpfWNhdGNoKGFzeW5jRXJyb3Ipe2NvbnN0e2Vycm9yOmVycm9yLG1lc3NhZ2U6bWVzc2FnZSxjb2RlOmNvZGV9PWF3YWl0KDAsZXJyb3JVdGlsc18xLmhhbmRsZUFzeW5jRXJyb3IpKGFzeW5jRXJyb3IpO3Jlc3BvbnNlLnN0YXR1cyhjb2RlKS5zZW5kKG1lc3NhZ2UpfX0iLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLmRlbGV0ZVVzZXJCeUlkPWV4cG9ydHMuZ2V0VXNlckJ5UGFzc3dvcmQ9ZXhwb3J0cy5nZXRVc2VyQnlUb2tlbj1leHBvcnRzLmdldFVzZXJCeUlkPWV4cG9ydHMuZ2V0Q2FydElkPWV4cG9ydHMuY3JlYXRlVXNlckJ5RW1haWw9dm9pZCAwO2NvbnN0IG5vZGVVdGlsc18xPXJlcXVpcmUoXCIuLi91dGlscy9ub2RlVXRpbHNcIiksbG9naW5VdGlsc18xPXJlcXVpcmUoXCIuL2xvZ2luVXRpbHNcIiksY2FydFV0aWxzXzE9cmVxdWlyZShcIi4vY2FydFV0aWxzXCIpLGh0dHBDb2Rlc18xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vdXRpbHMvaHR0cENvZGVzXCIpKSx2YWxpZGF0ZV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vbWljcm9zZXJ2aWNlcy9jdXN0b21lci9taWRkbGV3YXJlL3ZhbGlkYXRlXCIpKSx1c2VyXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9taWNyb3NlcnZpY2VzL2N1c3RvbWVyL2NvbnRyb2xsZXJzL3VzZXJcIikpLGxvZ2luXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9taWNyb3NlcnZpY2VzL2N1c3RvbWVyL2NvbnRyb2xsZXJzL2xvZ2luXCIpKTthc3luYyBmdW5jdGlvbiBnZXRDYXJ0SWQodXNlcix0b2tlbil7Y29uc3R7ZW1haWw6ZW1haWwsY2FydF9pZDpjYXJ0X2lkfT11c2VyO2lmKGNhcnRfaWQpcmV0dXJuIGNhcnRfaWQ7Y29uc3QgdXNlckluZm89YXdhaXQgZ2V0VXNlckJ5VG9rZW4oZW1haWwsdG9rZW4pO3JldHVybiBudWxsPT11c2VySW5mbz92b2lkIDA6dXNlckluZm8uY2FydF9pZH1hc3luYyBmdW5jdGlvbiBnZXRVc2VyQnlJZCh1c2VySUQpe3RyeXtpZighdXNlcklEKXRocm93IG5ldyBFcnJvcihcIkVSUk9SOiB1c2VyIGlkIGlzIHJlcXVpcmVkXCIpO2NvbnN0IHVzZXI9dW5kZWZpbmVkO3JldHVybiBhd2FpdCB1c2VyXzEuZGVmYXVsdC5nZXRPbmUoe19pZDp1c2VySUR9KX1jYXRjaChlcnJvcil7fX1hc3luYyBmdW5jdGlvbiBnZXRVc2VyQnlUb2tlbihlbWFpbCx0b2tlbil7dmFsaWRhdGVfMS5kZWZhdWx0LmVtYWlsKGVtYWlsKSx2YWxpZGF0ZV8xLmRlZmF1bHQudG9rZW4odG9rZW4pO2NvbnN0IGVtYWlsSGFzaD0oMCxub2RlVXRpbHNfMS5oYXNoKShlbWFpbCkscmVzdWx0PWF3YWl0IGxvZ2luXzEuZGVmYXVsdC5nZXRPbmUoe2VtYWlsSGFzaDplbWFpbEhhc2gsdG9rZW46dG9rZW59KSx1c2VyPWF3YWl0IHVzZXJfMS5kZWZhdWx0LmdldE9uZSh7X2lkOnJlc3VsdC51c2VyX2lkfSk7aWYoIXVzZXIpdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IFVuYWJsZSB0byBnZXQgdXNlciBieSB0b2tlblwiKTtyZXR1cm4gdXNlcn1hc3luYyBmdW5jdGlvbiBnZXRVc2VyQnlQYXNzd29yZChlbWFpbCxwYXNzd29yZCl7dmFsaWRhdGVfMS5kZWZhdWx0LmVtYWlsKGVtYWlsKSx2YWxpZGF0ZV8xLmRlZmF1bHQucGFzc3dvcmQocGFzc3dvcmQpO2NvbnN0IHVzZXJfaWQ9YXdhaXQoMCxsb2dpblV0aWxzXzEuZ2V0VXNlcklkQnlQYXNzd29yZCkoZW1haWwscGFzc3dvcmQpO2lmKCF1c2VyX2lkKXtjb25zdCBlcnJvcj1uZXcgRXJyb3IoXCJFUlJPUjogaW52YWxpZCBlbWFpbCBvciBwYXNzd29yZFwiKTt0aHJvdyBlcnJvci5jb2RlPWh0dHBDb2Rlc18xLmRlZmF1bHQuZXJyb3IuaW5jb3JyZWN0Q3JlZGVudGlhbHMsZXJyb3J9Y29uc3QgdXNlcj11bmRlZmluZWQ7cmV0dXJuIGF3YWl0IGdldFVzZXJCeUlkKHVzZXJfaWQpfWFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVVzZXJCeUlkKGlkKXt0cnl7aWYoIWlkKXRocm93IG5ldyBFcnJvcihcIkVSUk9SOiB1c2VyIGlkIGlzIHJlcXVpcmVkXCIpO2NvbnN0IHJlc3VsdHM9dW5kZWZpbmVkO3JldHVybiBhd2FpdCB1c2VyXzEuZGVmYXVsdC5kZWxldGVPbmUoe19pZDppZH0pfWNhdGNoKGZvcmVpZ25LZXlDb25zdHJhaW50KXt0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogbXVzdCBkZWxldGUgdXNlciBjYXJ0IGFuZCB1c2VyIGxvZ2luIGJlZm9yZSBkZWxldGluZyB1c2VyXCIpfX1hc3luYyBmdW5jdGlvbiBjcmVhdGVVc2VyQnlFbWFpbChlbWFpbCxuYW1lPVwiXCIpe3ZhbGlkYXRlXzEuZGVmYXVsdC5lbWFpbChlbWFpbCk7Y29uc3QgdXNlcj17fTt1c2VyLmVtYWlsPWVtYWlsLHVzZXIubmFtZT1uYW1lLHVzZXIuY2FydF9pZD1hd2FpdCgwLGNhcnRVdGlsc18xLmNyZWF0ZUNhcnQpKCk7Y29uc3QgcmVzdWx0PWF3YWl0IHVzZXJfMS5kZWZhdWx0LmFkZE9uZSh1c2VyKTtyZXR1cm4gdXNlci5faWQ9cmVzdWx0Lmluc2VydGVkSWQsdXNlcn1leHBvcnRzLmdldENhcnRJZD1nZXRDYXJ0SWQsZXhwb3J0cy5nZXRVc2VyQnlJZD1nZXRVc2VyQnlJZCxleHBvcnRzLmdldFVzZXJCeVRva2VuPWdldFVzZXJCeVRva2VuLGV4cG9ydHMuZ2V0VXNlckJ5UGFzc3dvcmQ9Z2V0VXNlckJ5UGFzc3dvcmQsZXhwb3J0cy5kZWxldGVVc2VyQnlJZD1kZWxldGVVc2VyQnlJZCxleHBvcnRzLmNyZWF0ZVVzZXJCeUVtYWlsPWNyZWF0ZVVzZXJCeUVtYWlsOyIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHJlcXVpcmUoXCJyZWZsZWN0LW1ldGFkYXRhXCIpO2NvbnN0IGV4cHJlc3NfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImV4cHJlc3NcIikpLGNvcnNfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImNvcnNcIikpLHJvdXRlcl8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yb3V0ZXMvcm91dGVyXCIpKSxpdGVtX2dyYXBocWxfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vbWljcm9zZXJ2aWNlcy9wcm9kdWN0L2NvbnRyb2xsZXJzL2l0ZW0uZ3JhcGhxbFwiKSksaW52ZW50b3J5X2dyYXBocWxfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vbWljcm9zZXJ2aWNlcy9wcm9kdWN0L2NvbnRyb2xsZXJzL2ludmVudG9yeS5ncmFwaHFsXCIpKSxpbnZlbnRvcnlVdGlsc18xPXJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL2ludmVudG9yeVV0aWxzXCIpLGlzRG9ja2VyRW52aXJvbm1lbnRfMT1yZXF1aXJlKFwiLi91dGlscy9nZW5lcmFsVXRpbHMvaXNEb2NrZXJFbnZpcm9ubWVudFwiKSxkb3RlbnZfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRvdGVudlwiKSk7ZG90ZW52XzEuZGVmYXVsdC5jb25maWcoKTtjb25zdCBzaG91bGRJbmplY3REZXBlbmRlbmN5PSExO2NvbnN0IGFwcD0oMCxleHByZXNzXzEuZGVmYXVsdCkoKSxob3N0PSgwLGlzRG9ja2VyRW52aXJvbm1lbnRfMS5pc0RvY2tlckVudmlyb25tZW50KSgpP1wiMC4wLjAuMFwiOnByb2Nlc3MuZW52Lmhvc3R8fFwibG9jYWxob3N0XCIscG9ydD1OdW1iZXIocHJvY2Vzcy5lbnYuUE9SVCl8fDhlMyxiYXNlVXJsPVwiL1wiLGhvc3RFbnZpcm9ubWVudD1wcm9jZXNzLmVudi5ob3N0RW52aXJvbm1lbnQ7ZnVuY3Rpb24gaGFuZGxlTGlzdGVuKCl7KDAsaXNEb2NrZXJFbnZpcm9ubWVudF8xLmlzRG9ja2VyRW52aXJvbm1lbnQpKCk/Y29uc29sZS5sb2coYExpc3RlbmluZyBvbiBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH1gKTpjb25zb2xlLmxvZyhgTGlzdGVuaW5nIG9uIGh0dHA6Ly8ke2hvc3R9OiR7cG9ydH1gKX1hcHAudXNlKCgwLGNvcnNfMS5kZWZhdWx0KSh7b3JpZ2luOlwiKlwifSkpLGFwcC51c2UoZXhwcmVzc18xLmRlZmF1bHQuc3RhdGljKFwicHVibGljXCIpKSxhcHAudXNlKGV4cHJlc3NfMS5kZWZhdWx0Lmpzb24oKSksYXBwLnVzZShcIi9cIixyb3V0ZXJfMS5kZWZhdWx0KSxcImxhbWJkYVwiIT09aG9zdEVudmlyb25tZW50JiYoY29uc29sZS5sb2coXCJTdGFydGluZyBzZXJ2ZXIuLi5cIiksYXBwLmxpc3Rlbihwb3J0LGhvc3QsaGFuZGxlTGlzdGVuKSksZXhwb3J0cy5kZWZhdWx0PWFwcDsiLCJcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLk1JQ1JPU0VSVklDRVM9dm9pZCAwO2NvbnN0IENPTlRST0xMRVJTXzE9cmVxdWlyZShcIi4vY3VzdG9tZXIvY29udHJvbGxlcnMvQ09OVFJPTExFUlNcIiksQ09OVFJPTExFUlNfMj1yZXF1aXJlKFwiLi9wcm9kdWN0L2NvbnRyb2xsZXJzL0NPTlRST0xMRVJTXCIpO2V4cG9ydHMuTUlDUk9TRVJWSUNFUz17Y3VzdG9tZXI6Q09OVFJPTExFUlNfMS5DT05UUk9MTEVSUyxwcm9kdWN0OkNPTlRST0xMRVJTXzIuQ09OVFJPTExFUlN9OyIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGV4cG9ydHMuQ09OVFJPTExFUlM9dm9pZCAwO2NvbnN0IGxvZ2luXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2xvZ2luXCIpKSx1c2VyXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3VzZXJcIikpO2V4cG9ydHMuQ09OVFJPTExFUlM9e2xvZ2luOmxvZ2luXzEuZGVmYXVsdCx1c2VyOnVzZXJfMS5kZWZhdWx0fTsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19yZXN0PXRoaXMmJnRoaXMuX19yZXN0fHxmdW5jdGlvbihzLGUpe3ZhciB0PXt9O2Zvcih2YXIgcCBpbiBzKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLHApJiZlLmluZGV4T2YocCk8MCYmKHRbcF09c1twXSk7aWYobnVsbCE9cyYmXCJmdW5jdGlvblwiPT10eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scylmb3IodmFyIGk9MCxwPU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7aTxwLmxlbmd0aDtpKyspZS5pbmRleE9mKHBbaV0pPDAmJk9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLHBbaV0pJiYodFtwW2ldXT1zW3BbaV1dKTtyZXR1cm4gdH07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7Y29uc3QgZGF0YWJhc2VfMT1yZXF1aXJlKFwiLi4vbW9kZWxzL2RhdGFiYXNlXCIpLHV0aWxpdHlGdW5jdGlvbnNfMT1yZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvdXRpbGl0eUZ1bmN0aW9uc1wiKSxsb2dpbnM9ZGF0YWJhc2VfMS5tb25nb2RiLmdldENvbGxlY3Rpb24oXCJsb2dpblwiKSxsb2dpbj17Z2V0T25lOmdldE9uZSxhZGRPbmU6YWRkT25lLHVwZGF0ZU9uZTp1cGRhdGVPbmUsZGVsZXRlT25lOmRlbGV0ZU9uZX07YXN5bmMgZnVuY3Rpb24gZ2V0T25lKHF1ZXJ5KXtpZihhd2FpdCBsb2dpbnMsKDAsdXRpbGl0eUZ1bmN0aW9uc18xLmlzRW1wdHkpKHF1ZXJ5KSlyZXR1cm4gbnVsbDtjb25zdCBsb2dpblJlc3VsdD1hd2FpdCBsb2dpbnMuZmluZE9uZShxdWVyeSk7cmV0dXJuIGxvZ2luUmVzdWx0fHxudWxsfWFzeW5jIGZ1bmN0aW9uIGFkZE9uZShxdWVyeSl7YXdhaXQgbG9naW5zO2NvbnN0IHJlc3VsdD11bmRlZmluZWQ7cmV0dXJuIGF3YWl0IGxvZ2lucy5pbnNlcnRPbmUocXVlcnkpfWFzeW5jIGZ1bmN0aW9uIHVwZGF0ZU9uZShxdWVyeSl7YXdhaXQgbG9naW5zO2xldHtfaWQ6X2lkfT1xdWVyeSxkYXRhPV9fcmVzdChxdWVyeSxbXCJfaWRcIl0pO2lmKCFfaWQpdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IF9pZCBpcyByZXF1aXJlZFwiKTtjb25zdCByZXN1bHQ9dW5kZWZpbmVkO3JldHVybiBhd2FpdCBsb2dpbnMudXBkYXRlT25lKHtfaWQ6X2lkfSx7JHNldDpkYXRhfSl9YXN5bmMgZnVuY3Rpb24gZGVsZXRlT25lKHF1ZXJ5KXtpZihhd2FpdCBsb2dpbnMsKDAsdXRpbGl0eUZ1bmN0aW9uc18xLmlzRW1wdHkpKHF1ZXJ5KSl0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogVW5hYmxlIHRvIGRlbGV0ZSBsb2dpblwiKTtjb25zdCByZXN1bHQ9dW5kZWZpbmVkO3JldHVybiBhd2FpdCBsb2dpbnMuZGVsZXRlT25lKHF1ZXJ5KX1leHBvcnRzLmRlZmF1bHQ9bG9naW47IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9fcmVzdD10aGlzJiZ0aGlzLl9fcmVzdHx8ZnVuY3Rpb24ocyxlKXt2YXIgdD17fTtmb3IodmFyIHAgaW4gcylPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocyxwKSYmZS5pbmRleE9mKHApPDAmJih0W3BdPXNbcF0pO2lmKG51bGwhPXMmJlwiZnVuY3Rpb25cIj09dHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpZm9yKHZhciBpPTAscD1PYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpO2k8cC5sZW5ndGg7aSsrKWUuaW5kZXhPZihwW2ldKTwwJiZPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocyxwW2ldKSYmKHRbcFtpXV09c1twW2ldXSk7cmV0dXJuIHR9LF9faW1wb3J0RGVmYXVsdD10aGlzJiZ0aGlzLl9faW1wb3J0RGVmYXVsdHx8ZnVuY3Rpb24obW9kKXtyZXR1cm4gbW9kJiZtb2QuX19lc01vZHVsZT9tb2Q6e2RlZmF1bHQ6bW9kfX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7Y29uc3QgZGF0YWJhc2VfMT1yZXF1aXJlKFwiLi4vbW9kZWxzL2RhdGFiYXNlXCIpLHZhbGlkYXRlXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9taWRkbGV3YXJlL3ZhbGlkYXRlXCIpKSx1dGlsaXR5RnVuY3Rpb25zXzE9cmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3V0aWxpdHlGdW5jdGlvbnNcIiksbW9uZ29kYl8xPXJlcXVpcmUoXCJtb25nb2RiXCIpLHVzZXI9e2dldE9uZTpnZXRPbmUsYWRkT25lOmFkZE9uZSxkZWxldGVPbmU6ZGVsZXRlT25lLHVwZGF0ZU9uZTp1cGRhdGVPbmV9O2V4cG9ydHMuZGVmYXVsdD11c2VyO2NvbnN0IHVzZXJzPWRhdGFiYXNlXzEubW9uZ29kYi5nZXRDb2xsZWN0aW9uKFwidXNlclwiKTthc3luYyBmdW5jdGlvbiBnZXRPbmUocXVlcnkpe2lmKGF3YWl0IHVzZXJzLCgwLHV0aWxpdHlGdW5jdGlvbnNfMS5pc0VtcHR5KShxdWVyeSkpcmV0dXJuIG51bGw7bGV0e19pZDpfaWR9PXF1ZXJ5O2lmKCFfaWQpdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IFVzZXIgSUQgaXMgcmVxdWlyZWRcIik7XCJzdHJpbmdcIj09dHlwZW9mIF9pZCYmKF9pZD1uZXcgbW9uZ29kYl8xLk9iamVjdElkKF9pZCkpO2NvbnN0IHVzZXI9dW5kZWZpbmVkO3JldHVybiBhd2FpdCB1c2Vycy5maW5kT25lKHtfaWQ6X2lkfSl9YXN5bmMgZnVuY3Rpb24gYWRkT25lKHF1ZXJ5KXthd2FpdCB1c2Vycztjb25zdHtlbWFpbDplbWFpbH09cXVlcnk7dmFsaWRhdGVfMS5kZWZhdWx0LmVtYWlsKGVtYWlsKTtjb25zdCByZXN1bHQ9dW5kZWZpbmVkO3JldHVybiBhd2FpdCB1c2Vycy5pbnNlcnRPbmUocXVlcnkpfWFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU9uZShxdWVyeSl7YXdhaXQgdXNlcnM7Y29uc3QgcmVzdWx0PXVuZGVmaW5lZDtyZXR1cm4gYXdhaXQgdXNlcnMuZGVsZXRlT25lKHF1ZXJ5KX1hc3luYyBmdW5jdGlvbiB1cGRhdGVPbmUocXVlcnkpe2F3YWl0IHVzZXJzO2xldHtfaWQ6X2lkfT1xdWVyeSxkYXRhPV9fcmVzdChxdWVyeSxbXCJfaWRcIl0pO2lmKCFfaWQpdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IF9pZCBpcyByZXF1aXJlZFwiKTtjb25zdCByZXN1bHQ9dW5kZWZpbmVkO3JldHVybiBhd2FpdCB1c2Vycy51cGRhdGVPbmUoe19pZDpfaWR9LHskc2V0OmRhdGF9KX0iLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTtjb25zdCBodHRwQ29kZXNfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL2h0dHBDb2Rlc1wiKSksdmFsaWRhdGU9e2VtYWlsOmVtYWlsLHBhc3N3b3JkOnBhc3N3b3JkLHVzZXI6dXNlcix1c2VySWQ6dXNlcklkLHRva2VuOnRva2VufTtmdW5jdGlvbiBlbWFpbChlbWFpbCl7aWYoIWVtYWlsKXRocm93IG5ldyBFcnJvcihcIkVSUk9SOiBlbWFpbCBpcyByZXF1aXJlZFwiKTtpZihcInN0cmluZ1wiIT10eXBlb2YgZW1haWwpdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IGludmFsaWQgZW1haWxcIil9ZnVuY3Rpb24gcGFzc3dvcmQocGFzc3dvcmQpe2lmKCFwYXNzd29yZCl0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogcGFzc3dvcmQgaXMgcmVxdWlyZWRcIik7aWYoXCJzdHJpbmdcIiE9dHlwZW9mIHBhc3N3b3JkKXRocm93IG5ldyBFcnJvcihcIkVSUk9SOiBpbnZhbGlkIHBhc3N3b3JkXCIpfWZ1bmN0aW9uIHVzZXIodXNlcixlcnJvck1lc3NhZ2U9XCJFUlJPUjogaW52YWxpZCB1c2VyXCIpe2lmKCF1c2VyfHwhdXNlci5faWQpe2NvbnN0IGVycm9yPW5ldyBFcnJvcihlcnJvck1lc3NhZ2UpO3Rocm93IGVycm9yLmNvZGU9aHR0cENvZGVzXzEuZGVmYXVsdC5lcnJvci5iYWRSZXF1ZXN0LGVycm9yfX1mdW5jdGlvbiB1c2VySWQodXNlcklkLGVycm9yTWVzc2FnZT1cIkVSUk9SOiBpbnZhbGlkIHVzZXIgaWRcIil7aWYoIXVzZXJJZCl7Y29uc3QgZXJyb3I9bmV3IEVycm9yKGVycm9yTWVzc2FnZSk7dGhyb3cgZXJyb3IuY29kZT1odHRwQ29kZXNfMS5kZWZhdWx0LmVycm9yLmJhZFJlcXVlc3QsZXJyb3J9fWZ1bmN0aW9uIHRva2VuKHRva2VuKXtpZighdG9rZW4pdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IHRva2VuIGlzIHJlcXVpcmVkXCIpO2lmKFwic3RyaW5nXCIhPXR5cGVvZiB0b2tlbil0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogaW52YWxpZCB0b2tlblwiKX1leHBvcnRzLmRlZmF1bHQ9dmFsaWRhdGU7IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9faW1wb3J0RGVmYXVsdD10aGlzJiZ0aGlzLl9faW1wb3J0RGVmYXVsdHx8ZnVuY3Rpb24obW9kKXtyZXR1cm4gbW9kJiZtb2QuX19lc01vZHVsZT9tb2Q6e2RlZmF1bHQ6bW9kfX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7Y29uc3Qgbm9kZVV0aWxzXzE9cmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL25vZGVVdGlsc1wiKSx2YWxpZGF0ZV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vbWlkZGxld2FyZS92YWxpZGF0ZVwiKSksbG9naW5fMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL2NvbnRyb2xsZXJzL2xvZ2luXCIpKSx2ZXJpZnk9e3NpZ251cEVtYWlsOnNpZ251cEVtYWlsLGxvZ2luQXR0ZW1wdHM6bG9naW5BdHRlbXB0c307YXN5bmMgZnVuY3Rpb24gc2lnbnVwRW1haWwoZW1haWwpe3ZhbGlkYXRlXzEuZGVmYXVsdC5lbWFpbChlbWFpbCk7Y29uc3QgZW1haWxIYXNoPSgwLG5vZGVVdGlsc18xLmhhc2gpKGVtYWlsKSxyZXN1bHQ9dW5kZWZpbmVkLGlzU2lnbnVwRW1haWxUYWtlbj11bmRlZmluZWQ7aWYoISFhd2FpdCBsb2dpbl8xLmRlZmF1bHQuZ2V0T25lKHtlbWFpbEhhc2g6ZW1haWxIYXNofSkpdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IEFuIGFjY291bnQgd2l0aCB0aGF0IGVtYWlsIGFscmVhZHkgZXhpc3RzXCIpfWV4cG9ydHMuZGVmYXVsdD12ZXJpZnk7Y29uc3QgbG9naW5BdHRlbXB0Q291bnQ9e30sdGltZW91dElkcz17fSxMT0dJTl9USU1FT1VUX0RVUkFUSU9OPTZlNDtmdW5jdGlvbiBsb2dpbkF0dGVtcHRzKGVtYWlsKXt2YXIgX2E7Y29uc3QgbnVtYmVyT2ZBdHRlbXB0cz1udWxsIT09KF9hPWxvZ2luQXR0ZW1wdENvdW50W2VtYWlsXSkmJnZvaWQgMCE9PV9hP19hOjA7aWYobnVtYmVyT2ZBdHRlbXB0cz4zKXRocm93IG5ldyBFcnJvcihcIkVSUk9SOiBUb28gbWFueSBsb2dpbiBhdHRlbXB0c1wiKTtsb2dpbkF0dGVtcHRDb3VudFtlbWFpbF09bnVtYmVyT2ZBdHRlbXB0cysxLHJlc2V0VGltZW91dChlbWFpbCl9ZnVuY3Rpb24gcmVzZXRUaW1lb3V0KGVtYWlsKXtjbGVhclRpbWVvdXQodGltZW91dElkc1tlbWFpbF0pLHRpbWVvdXRJZHNbZW1haWxdPXNldFRpbWVvdXQoKCgpPT57Y2xlYXJUaW1lb3V0KHRpbWVvdXRJZHNbZW1haWxdKSxsb2dpbkF0dGVtcHRDb3VudFtlbWFpbF09MH0pLExPR0lOX1RJTUVPVVRfRFVSQVRJT04pfSIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGV4cG9ydHMubW9uZ29kYj1leHBvcnRzLnNxbD1leHBvcnRzLnR5cGVvcm09ZXhwb3J0cy5rbmV4PXZvaWQgMDtjb25zdCBEYXRhYmFzZV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvRGF0YWJhc2UvdjEuMS9EYXRhYmFzZVwiKSksbW9uZ29kYl9jb25maWdfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL21vbmdvZGIuY29uZmlnXCIpKSxkYXRhYmFzZT1uZXcgRGF0YWJhc2VfMS5kZWZhdWx0O2RhdGFiYXNlLmNvbmZpZ3VyZU1vbmdvZGIobW9uZ29kYl9jb25maWdfMS5kZWZhdWx0KSxleHBvcnRzLmtuZXg9ZGF0YWJhc2Uua25leCxleHBvcnRzLnR5cGVvcm09ZGF0YWJhc2UudHlwZW9ybSxleHBvcnRzLnNxbD1kYXRhYmFzZS5zcWwsZXhwb3J0cy5tb25nb2RiPWRhdGFiYXNlLm1vbmdvZGI7IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9faW1wb3J0RGVmYXVsdD10aGlzJiZ0aGlzLl9faW1wb3J0RGVmYXVsdHx8ZnVuY3Rpb24obW9kKXtyZXR1cm4gbW9kJiZtb2QuX19lc01vZHVsZT9tb2Q6e2RlZmF1bHQ6bW9kfX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7Y29uc3QgZG90ZW52XzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkb3RlbnZcIikpO2RvdGVudl8xLmRlZmF1bHQuY29uZmlnKCk7Y29uc3QgY29ubmVjdGlvblN0cmluZz1wcm9jZXNzLmVudi5tb25nb2RiQ29ubmVjdGlvblN0cmluZyxkYXRhYmFzZT1wcm9jZXNzLmVudi5tb25nb2RiRGF0YWJhc2U7aWYoIWNvbm5lY3Rpb25TdHJpbmcpdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IE1vbmdvZGIgY29ubmVjdGlvbiBzdHJpbmcgaXMgcmVxdWlyZWRcIik7aWYoIWRhdGFiYXNlKXRocm93IG5ldyBFcnJvcihcIkVSUk9SOiBNb25nb2RiIGRhdGFiYXNlIGlzIHJlcXVpcmVkXCIpO2NvbnN0IG1vbmdvZGJDb25maWc9e2Nvbm5lY3Rpb25TdHJpbmc6Y29ubmVjdGlvblN0cmluZyxkYXRhYmFzZTpkYXRhYmFzZSx1c2VyOnByb2Nlc3MuZW52Lm1vbmdvZGJVc2VyLHBhc3N3b3JkOnByb2Nlc3MuZW52Lm1vbmdvZGJQYXNzd29yZH07ZXhwb3J0cy5kZWZhdWx0PW1vbmdvZGJDb25maWc7IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9faW1wb3J0RGVmYXVsdD10aGlzJiZ0aGlzLl9faW1wb3J0RGVmYXVsdHx8ZnVuY3Rpb24obW9kKXtyZXR1cm4gbW9kJiZtb2QuX19lc01vZHVsZT9tb2Q6e2RlZmF1bHQ6bW9kfX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy5DT05UUk9MTEVSUz12b2lkIDA7Y29uc3QgY2FydF8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jYXJ0XCIpKSxpdGVtXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2l0ZW1cIikpLGludmVudG9yeV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9pbnZlbnRvcnlcIikpO2V4cG9ydHMuQ09OVFJPTExFUlM9e2NhcnQ6Y2FydF8xLmRlZmF1bHQsaXRlbTppdGVtXzEuZGVmYXVsdCxpbnZlbnRvcnk6aW52ZW50b3J5XzEuZGVmYXVsdH07IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9fcmVzdD10aGlzJiZ0aGlzLl9fcmVzdHx8ZnVuY3Rpb24ocyxlKXt2YXIgdD17fTtmb3IodmFyIHAgaW4gcylPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocyxwKSYmZS5pbmRleE9mKHApPDAmJih0W3BdPXNbcF0pO2lmKG51bGwhPXMmJlwiZnVuY3Rpb25cIj09dHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpZm9yKHZhciBpPTAscD1PYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpO2k8cC5sZW5ndGg7aSsrKWUuaW5kZXhPZihwW2ldKTwwJiZPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocyxwW2ldKSYmKHRbcFtpXV09c1twW2ldXSk7cmV0dXJuIHR9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2NvbnN0IGRhdGFiYXNlXzE9cmVxdWlyZShcIi4uL21vZGVscy9kYXRhYmFzZVwiKSx1dGlsaXR5RnVuY3Rpb25zXzE9cmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3V0aWxpdHlGdW5jdGlvbnNcIiksbW9uZ29kYl8xPXJlcXVpcmUoXCJtb25nb2RiXCIpLGNhcnQ9e2FkZE9uZTphZGRPbmUsZ2V0T25lOmdldE9uZSxkZWxldGVPbmU6ZGVsZXRlT25lLHVwZGF0ZU9uZTp1cGRhdGVPbmV9O2V4cG9ydHMuZGVmYXVsdD1jYXJ0O2NvbnN0IGNhcnRzPWRhdGFiYXNlXzEubW9uZ29kYi5nZXRDb2xsZWN0aW9uKFwiY2FydFwiKTthc3luYyBmdW5jdGlvbiBhZGRPbmUocXVlcnkpe2F3YWl0IGNhcnRzLHF1ZXJ5fHwocXVlcnk9e30pO2NvbnN0IHJlc3VsdD11bmRlZmluZWQ7cmV0dXJuIGF3YWl0IGNhcnRzLmluc2VydE9uZShxdWVyeSl9YXN5bmMgZnVuY3Rpb24gZ2V0T25lKHF1ZXJ5KXtpZihhd2FpdCBjYXJ0cywoMCx1dGlsaXR5RnVuY3Rpb25zXzEuaXNFbXB0eSkocXVlcnkpKXJldHVybiBudWxsO2NvbnN0e19pZDpfaWR9PXF1ZXJ5O2lmKCFfaWQpdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IENhcnQgaWQgaXMgcmVxdWlyZWRcIik7Y29uc3QgcmVzdWx0PXVuZGVmaW5lZDtyZXR1cm4gYXdhaXQgY2FydHMuZmluZE9uZSh7X2lkOm5ldyBtb25nb2RiXzEuT2JqZWN0SWQoX2lkKX0pfWFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU9uZShxdWVyeSl7aWYoYXdhaXQgY2FydHMsKDAsdXRpbGl0eUZ1bmN0aW9uc18xLmlzRW1wdHkpKHF1ZXJ5KSl0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogVW5hYmxlIHRvIGRlbGV0ZSBjYXJ0XCIpO2NvbnN0IHJlc3VsdD11bmRlZmluZWQ7cmV0dXJuIGF3YWl0IGNhcnRzLmRlbGV0ZU9uZShxdWVyeSl9YXN5bmMgZnVuY3Rpb24gdXBkYXRlT25lKHF1ZXJ5KXthd2FpdCBjYXJ0cztsZXR7X2lkOl9pZH09cXVlcnksZGF0YT1fX3Jlc3QocXVlcnksW1wiX2lkXCJdKTtpZighX2lkKXRocm93IG5ldyBFcnJvcihcIkVSUk9SOiBfaWQgaXMgcmVxdWlyZWRcIik7Y29uc3QgcmVzdWx0PXVuZGVmaW5lZDtyZXR1cm4gYXdhaXQgY2FydHMudXBkYXRlT25lKHtfaWQ6X2lkfSx7JHNldDpkYXRhfSl9IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9faW1wb3J0RGVmYXVsdD10aGlzJiZ0aGlzLl9faW1wb3J0RGVmYXVsdHx8ZnVuY3Rpb24obW9kKXtyZXR1cm4gbW9kJiZtb2QuX19lc01vZHVsZT9tb2Q6e2RlZmF1bHQ6bW9kfX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7Y29uc3QgZ3JhcGhxbF8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vbW9kZWxzL2dyYXBocWxcIikpLEl0ZW1fMT1yZXF1aXJlKFwiLi4vbW9kZWxzL2VudGl0aWVzL0l0ZW1cIiksaW52ZW50b3J5PXtnZXRPbmU6Z2V0T25lfTthc3luYyBmdW5jdGlvbiBnZXRPbmUocXVlcnkpe3ZhciBfYSxfYixfYztjb25zdCBncmFwaHFsUXVlcnk9J1xcbiAgICBxdWVyeSB7XFxuICAgICAgYW1hem9uUHJvZHVjdENhdGVnb3J5KGlucHV0OiB7Y2F0ZWdvcnlJZDogXCIxMDg0MTI4XCJ9KSB7XFxuICAgICAgICBwcm9kdWN0UmVzdWx0cyB7XFxuICAgICAgICAgIHJlc3VsdHN7XFxuICAgICAgICAgICAgYXNpblxcbiAgICAgICAgICAgIHRpdGxlXFxuICAgICAgICAgICAgbWFpbkltYWdlVXJsXFxuICAgICAgICAgICAgcHJpY2Uge1xcbiAgICAgICAgICAgICAgdmFsdWVcXG4gICAgICAgICAgICB9XFxuICAgICAgICAgIH1cXG4gICAgICAgIH1cXG4gICAgICB9XFxuICAgIH0nLHJlc3BvbnNlPWF3YWl0IGdyYXBocWxfMS5kZWZhdWx0LnNlbmQoZ3JhcGhxbFF1ZXJ5KSxwcm9kdWN0c0FycmF5PXVuZGVmaW5lZCxpdGVtcz0obnVsbD09PShfYz1udWxsPT09KF9iPW51bGw9PT0oX2E9bnVsbD09cmVzcG9uc2U/dm9pZCAwOnJlc3BvbnNlLmRhdGEpfHx2b2lkIDA9PT1fYT92b2lkIDA6X2EuYW1hem9uUHJvZHVjdENhdGVnb3J5KXx8dm9pZCAwPT09X2I/dm9pZCAwOl9iLnByb2R1Y3RSZXN1bHRzKXx8dm9pZCAwPT09X2M/dm9pZCAwOl9jLnJlc3VsdHMpLm1hcCh0b0l0ZW0pLGl0ZW1faWRzPXVuZGVmaW5lZCxpbnZlbnRvcnk9dW5kZWZpbmVkO3JldHVybntpdGVtX2lkczppdGVtcy5tYXAodG9JdGVtSWQpLGl0ZW1zOml0ZW1zfX1mdW5jdGlvbiB0b0l0ZW0oaXRlbSl7Y29uc3QgX2lkPWl0ZW0uYXNpbix7bmFtZTpuYW1lLGRlc2NyaXB0aW9uOmRlc2NyaXB0aW9ufT1leHRyYWN0SW5mbyhpdGVtLnRpdGxlKSxwcmljZT1pdGVtLnByaWNlLnZhbHVlLGltYWdlPWl0ZW0ubWFpbkltYWdlVXJsO3JldHVybigwLEl0ZW1fMS5JdGVtKSh7X2lkOl9pZCxuYW1lOm5hbWUsZGVzY3JpcHRpb246ZGVzY3JpcHRpb24scHJpY2U6cHJpY2UsaW1hZ2U6aW1hZ2V9KX1mdW5jdGlvbiB0b0l0ZW1JZChpdGVtKXtjb25zdHtfaWQ6X2lkfT1pdGVtO3JldHVybiBfaWR9ZnVuY3Rpb24gZXh0cmFjdEluZm8oaW5mbyl7Y29uc3RbbmFtZSwuLi5fb3RoZXJJbmZvXT1pbmZvLnNwbGl0KFwiLFwiKTtyZXR1cm57bmFtZTpuYW1lLGRlc2NyaXB0aW9uOmluZm99fWV4cG9ydHMuZGVmYXVsdD1pbnZlbnRvcnk7IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9fcmVzdD10aGlzJiZ0aGlzLl9fcmVzdHx8ZnVuY3Rpb24ocyxlKXt2YXIgdD17fTtmb3IodmFyIHAgaW4gcylPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocyxwKSYmZS5pbmRleE9mKHApPDAmJih0W3BdPXNbcF0pO2lmKG51bGwhPXMmJlwiZnVuY3Rpb25cIj09dHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpZm9yKHZhciBpPTAscD1PYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpO2k8cC5sZW5ndGg7aSsrKWUuaW5kZXhPZihwW2ldKTwwJiZPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocyxwW2ldKSYmKHRbcFtpXV09c1twW2ldXSk7cmV0dXJuIHR9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2NvbnN0IGRhdGFiYXNlXzE9cmVxdWlyZShcIi4uL21vZGVscy9kYXRhYmFzZVwiKSxpbnZlbnRvcnk9e2dldE9uZTpnZXRPbmUsdXBkYXRlT25lOnVwZGF0ZU9uZX07ZXhwb3J0cy5kZWZhdWx0PWludmVudG9yeTtjb25zdCBpbnZlbnRvcmllcz1kYXRhYmFzZV8xLm1vbmdvZGIuZ2V0Q29sbGVjdGlvbihcImludmVudG9yeVwiKTthc3luYyBmdW5jdGlvbiBnZXRPbmUocXVlcnkpe2F3YWl0IGludmVudG9yaWVzO2NvbnN0IHJlc3VsdD11bmRlZmluZWQ7cmV0dXJuIGF3YWl0IGludmVudG9yaWVzLmZpbmRPbmUocXVlcnkpfWFzeW5jIGZ1bmN0aW9uIHVwZGF0ZU9uZShxdWVyeSl7YXdhaXQgaW52ZW50b3JpZXM7bGV0e19pZDpfaWR9PXF1ZXJ5LGRhdGE9X19yZXN0KHF1ZXJ5LFtcIl9pZFwiXSk7aWYoIV9pZCl0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogX2lkIGlzIHJlcXVpcmVkXCIpO2NvbnN0IHJlc3VsdD11bmRlZmluZWQ7cmV0dXJuIGF3YWl0IGludmVudG9yaWVzLnVwZGF0ZU9uZSh7X2lkOl9pZH0seyRzZXQ6ZGF0YX0pfSIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2NvbnN0IGdyYXBocWxfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL21vZGVscy9ncmFwaHFsXCIpKSxJdGVtXzE9cmVxdWlyZShcIi4uL21vZGVscy9lbnRpdGllcy9JdGVtXCIpLGludmVudG9yeV9ncmFwaHFsXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2ludmVudG9yeS5ncmFwaHFsXCIpKSxpdGVtPXtnZXRPbmU6Z2V0T25lLGdldE1hbnk6Z2V0TWFueX07YXN5bmMgZnVuY3Rpb24gZ2V0T25lKHF1ZXJ5KXt2YXIgX2E7bGV0e19pZDpfaWR9PXF1ZXJ5fHx7fTtfaWR8fChfaWQ9XCJCMEJESFdEUjEyXCIpO2NvbnN0IGdyYXBocWxRdWVyeT1gXFxuICAgIHF1ZXJ5IGFtYXpvblByb2R1Y3Qge1xcbiAgICAgIGFtYXpvblByb2R1Y3QoaW5wdXQ6IHsgYXNpbkxvb2t1cDogeyBhc2luOiBcIiR7X2lkfVwiIH0gfSkge1xcbiAgICAgICAgYXNpblxcbiAgICAgICAgdGl0bGVcXG4gICAgICAgIG1haW5JbWFnZVVybFxcbiAgICAgICAgcHJpY2Uge1xcbiAgICAgICAgICB2YWx1ZVxcbiAgICAgICAgfVxcbiAgICAgIH1cXG4gICAgfWAscmVzcG9uc2U9YXdhaXQgZ3JhcGhxbF8xLmRlZmF1bHQuc2VuZChncmFwaHFsUXVlcnkpLHByb2R1Y3RSZXN1bHQ9bnVsbD09PShfYT1udWxsPT1yZXNwb25zZT92b2lkIDA6cmVzcG9uc2UuZGF0YSl8fHZvaWQgMD09PV9hP3ZvaWQgMDpfYS5hbWF6b25Qcm9kdWN0O2lmKCFwcm9kdWN0UmVzdWx0KXJldHVybiBudWxsO3Byb2R1Y3RSZXN1bHQuYXNpbj1faWQ7Y29uc3QgaXRlbT11bmRlZmluZWQ7cmV0dXJuIHRvSXRlbShwcm9kdWN0UmVzdWx0KX1hc3luYyBmdW5jdGlvbiBnZXRNYW55KHF1ZXJ5KXt2YXIgX2E7Y29uc3QgaW52ZW50b3J5PWF3YWl0IGludmVudG9yeV9ncmFwaHFsXzEuZGVmYXVsdC5nZXRPbmUoKSx7aXRlbXM6aXRlbXN9PWludmVudG9yeSxpZHM9KG51bGw9PT0oX2E9bnVsbD09cXVlcnk/dm9pZCAwOnF1ZXJ5Ll9pZCl8fHZvaWQgMD09PV9hP3ZvaWQgMDpfYS4kaW4pfHxbXSxtYXRjaGluZ0l0ZW1zPXVuZGVmaW5lZDtyZXR1cm4gaXRlbXMuZmlsdGVyKG1hdGNoSXRlbUlkcyhpZHMpKX1mdW5jdGlvbiB0b0l0ZW0ocHJvZHVjdCl7Y29uc3QgX2lkPXByb2R1Y3QuYXNpbix7bmFtZTpuYW1lLGRlc2NyaXB0aW9uOmRlc2NyaXB0aW9ufT1leHRyYWN0SW5mbyhwcm9kdWN0LnRpdGxlKSxwcmljZT1wcm9kdWN0LnByaWNlLnZhbHVlLGltYWdlPXByb2R1Y3QubWFpbkltYWdlVXJsO3JldHVybigwLEl0ZW1fMS5JdGVtKSh7X2lkOl9pZCxuYW1lOm5hbWUsZGVzY3JpcHRpb246ZGVzY3JpcHRpb24scHJpY2U6cHJpY2UsaW1hZ2U6aW1hZ2V9KX1mdW5jdGlvbiBleHRyYWN0SW5mbyhpbmZvKXtjb25zdFtuYW1lLC4uLl9vdGhlckluZm9dPWluZm8uc3BsaXQoXCIsXCIpO3JldHVybntuYW1lOm5hbWUsZGVzY3JpcHRpb246aW5mb319ZnVuY3Rpb24gbWF0Y2hJdGVtSWRzKGl0ZW1JZHMpe3JldHVybiBmdW5jdGlvbihpdGVtKXtjb25zdCBpZD1gJHtpdGVtLl9pZH1gLGRvZXNNYXRjaD11bmRlZmluZWQ7cmV0dXJuIGl0ZW1JZHMuaW5jbHVkZXMoaWQpfX1leHBvcnRzLmRlZmF1bHQ9aXRlbTsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19yZXN0PXRoaXMmJnRoaXMuX19yZXN0fHxmdW5jdGlvbihzLGUpe3ZhciB0PXt9O2Zvcih2YXIgcCBpbiBzKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLHApJiZlLmluZGV4T2YocCk8MCYmKHRbcF09c1twXSk7aWYobnVsbCE9cyYmXCJmdW5jdGlvblwiPT10eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scylmb3IodmFyIGk9MCxwPU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7aTxwLmxlbmd0aDtpKyspZS5pbmRleE9mKHBbaV0pPDAmJk9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLHBbaV0pJiYodFtwW2ldXT1zW3BbaV1dKTtyZXR1cm4gdH07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7Y29uc3QgZGF0YWJhc2VfMT1yZXF1aXJlKFwiLi4vbW9kZWxzL2RhdGFiYXNlXCIpLGl0ZW09e2dldE9uZTpnZXRPbmUsZ2V0TWFueTpnZXRNYW55LHVwZGF0ZU9uZTp1cGRhdGVPbmV9O2V4cG9ydHMuZGVmYXVsdD1pdGVtO2NvbnN0IGl0ZW1zPWRhdGFiYXNlXzEubW9uZ29kYi5nZXRDb2xsZWN0aW9uKFwiaXRlbVwiKTthc3luYyBmdW5jdGlvbiBnZXRPbmUocXVlcnkpe2F3YWl0IGl0ZW1zO2NvbnN0IHJlc3VsdD11bmRlZmluZWQ7cmV0dXJuIGF3YWl0IGl0ZW1zLmZpbmRPbmUocXVlcnkpfWFzeW5jIGZ1bmN0aW9uIGdldE1hbnkocXVlcnkpe2F3YWl0IGl0ZW1zO2NvbnN0IHJlc3VsdD11bmRlZmluZWQ7cmV0dXJuIGF3YWl0IGl0ZW1zLmZpbmQocXVlcnkpLnRvQXJyYXkoKX1hc3luYyBmdW5jdGlvbiB1cGRhdGVPbmUocXVlcnkpe2F3YWl0IGl0ZW1zO2xldHtfaWQ6X2lkfT1xdWVyeSxkYXRhPV9fcmVzdChxdWVyeSxbXCJfaWRcIl0pO2lmKCFfaWQpdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IF9pZCBpcyByZXF1aXJlZFwiKTtjb25zdCByZXN1bHQ9dW5kZWZpbmVkO3JldHVybiBhd2FpdCBpdGVtcy51cGRhdGVPbmUoe19pZDpfaWR9LHskc2V0OmRhdGF9KX0iLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTtjb25zdCBodHRwQ29kZXNfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL2h0dHBDb2Rlc1wiKSksdmFsaWRhdGU9e2NhcnQ6Y2FydCxjYXJ0X2lkOmNhcnRfaWQsaXRlbTppdGVtfTtmdW5jdGlvbiBjYXJ0KGNhcnQpe2lmKCFjYXJ0fHwhY2FydC5faWQpe2NvbnN0IGVycm9yPW5ldyBFcnJvcihcIkVSUk9SOiBpbnZhbGlkIGNhcnRcIik7dGhyb3cgZXJyb3IuY29kZT1odHRwQ29kZXNfMS5kZWZhdWx0LmVycm9yLmJhZFJlcXVlc3QsZXJyb3J9fWZ1bmN0aW9uIGNhcnRfaWQoaWQpe2lmKCFpZCl7Y29uc3QgZXJyb3I9bmV3IEVycm9yKFwiRVJST1I6IGludmFsaWQgY2FydFwiKTt0aHJvdyBlcnJvci5jb2RlPWh0dHBDb2Rlc18xLmRlZmF1bHQuZXJyb3IuYmFkUmVxdWVzdCxlcnJvcn19ZnVuY3Rpb24gaXRlbShpdGVtKXtpZighaXRlbXx8IWl0ZW0uX2lkKXtjb25zdCBlcnJvcj1uZXcgRXJyb3IoXCJFUlJPUjogaW52YWxpZCBpdGVtXCIpO3Rocm93IGVycm9yLmNvZGU9aHR0cENvZGVzXzEuZGVmYXVsdC5lcnJvci5iYWRSZXF1ZXN0LGVycm9yfX1leHBvcnRzLmRlZmF1bHQ9dmFsaWRhdGU7IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9faW1wb3J0RGVmYXVsdD10aGlzJiZ0aGlzLl9faW1wb3J0RGVmYXVsdHx8ZnVuY3Rpb24obW9kKXtyZXR1cm4gbW9kJiZtb2QuX19lc01vZHVsZT9tb2Q6e2RlZmF1bHQ6bW9kfX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy5tb25nb2RiPWV4cG9ydHMuc3FsPWV4cG9ydHMudHlwZW9ybT1leHBvcnRzLmtuZXg9dm9pZCAwO2NvbnN0IERhdGFiYXNlXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9EYXRhYmFzZS92MS4xL0RhdGFiYXNlXCIpKSxtb25nb2RiX2NvbmZpZ18xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vbW9uZ29kYi5jb25maWdcIikpLGRhdGFiYXNlPW5ldyBEYXRhYmFzZV8xLmRlZmF1bHQ7ZGF0YWJhc2UuY29uZmlndXJlTW9uZ29kYihtb25nb2RiX2NvbmZpZ18xLmRlZmF1bHQpO2NvbnN0e2tuZXg6a25leCx0eXBlb3JtOnR5cGVvcm0sc3FsOnNxbCxtb25nb2RiOm1vbmdvZGJ9PWRhdGFiYXNlO2V4cG9ydHMua25leD1rbmV4LGV4cG9ydHMudHlwZW9ybT10eXBlb3JtLGV4cG9ydHMuc3FsPXNxbCxleHBvcnRzLm1vbmdvZGI9bW9uZ29kYjsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLkl0ZW09dm9pZCAwO2NvbnN0IHV0aWxpdHlGdW5jdGlvbnNfMT1yZXF1aXJlKFwiLi4vLi4vLi4vLi4vdXRpbHMvdXRpbGl0eUZ1bmN0aW9uc1wiKSx2YWxpZGF0ZV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vLi4vLi4vbWlkZGxld2FyZS92YWxpZGF0ZVwiKSksSXRlbT1vYmplY3Q9PntpZigoMCx1dGlsaXR5RnVuY3Rpb25zXzEuaXNFbXB0eSkob2JqZWN0KSlyZXR1cm4gbnVsbDtjb25zdCBpdGVtPU9iamVjdC5hc3NpZ24oe30sb2JqZWN0KSx7X2lkOl9pZCxuYW1lOm5hbWUscHJpY2U6cHJpY2UsaW1hZ2U6aW1hZ2UsZGVzY3JpcHRpb246ZGVzY3JpcHRpb259PWl0ZW07cmV0dXJuIF9pZCYmKGl0ZW0uX2lkPXZhbGlkYXRlXzEuZGVmYXVsdC5vYmplY3RJZChfaWQpKSxuYW1lJiYoaXRlbS5uYW1lPXZhbGlkYXRlXzEuZGVmYXVsdC5zdHJpbmcobmFtZSkpLHByaWNlJiYoaXRlbS5wcmljZT12YWxpZGF0ZV8xLmRlZmF1bHQubnVtYmVyKHByaWNlKSksaW1hZ2UmJihpdGVtLmltYWdlPXZhbGlkYXRlXzEuZGVmYXVsdC5zdHJpbmcoaW1hZ2UpKSxkZXNjcmlwdGlvbiYmKGl0ZW0uZGVzY3JpcHRpb249dmFsaWRhdGVfMS5kZWZhdWx0LnN0cmluZyhkZXNjcmlwdGlvbikpLGl0ZW19O2V4cG9ydHMuSXRlbT1JdGVtOyIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2NvbnN0IGRvdGVudl8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZG90ZW52XCIpKTtkb3RlbnZfMS5kZWZhdWx0LmNvbmZpZygpO2NvbnN0IGdyYXBocWw9e3NlbmQ6c2VuZH07ZXhwb3J0cy5kZWZhdWx0PWdyYXBocWw7Y29uc3R7Y2Fub3B5QXBpS2V5OmNhbm9weUFwaUtleX09cHJvY2Vzcy5lbnY7YXN5bmMgZnVuY3Rpb24gc2VuZChxdWVyeSl7Y29uc3QgcmVzcG9uc2U9dW5kZWZpbmVkO3JldHVybihhd2FpdCBmZXRjaChcImh0dHBzOi8vZ3JhcGhxbC5jYW5vcHlhcGkuY28vXCIse21ldGhvZDpcIlBPU1RcIixtb2RlOlwiY29yc1wiLGhlYWRlcnM6e1wiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi9qc29uXCIsXCJBUEktS0VZXCI6Y2Fub3B5QXBpS2V5fSxib2R5OkpTT04uc3RyaW5naWZ5KHtxdWVyeTpxdWVyeX0pfSkpLmpzb24oKX0iLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTtjb25zdCBkb3RlbnZfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRvdGVudlwiKSk7ZG90ZW52XzEuZGVmYXVsdC5jb25maWcoKTtjb25zdCBjb25uZWN0aW9uU3RyaW5nPXByb2Nlc3MuZW52Lm1vbmdvZGJDb25uZWN0aW9uU3RyaW5nLGRhdGFiYXNlPXByb2Nlc3MuZW52Lm1vbmdvZGJEYXRhYmFzZTtpZighY29ubmVjdGlvblN0cmluZyl0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogTW9uZ29kYiBjb25uZWN0aW9uIHN0cmluZyBpcyByZXF1aXJlZFwiKTtpZighZGF0YWJhc2UpdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IE1vbmdvZGIgZGF0YWJhc2UgaXMgcmVxdWlyZWRcIik7Y29uc3QgbW9uZ29kYkNvbmZpZz17Y29ubmVjdGlvblN0cmluZzpjb25uZWN0aW9uU3RyaW5nLGRhdGFiYXNlOmRhdGFiYXNlLHVzZXI6cHJvY2Vzcy5lbnYubW9uZ29kYlVzZXIscGFzc3dvcmQ6cHJvY2Vzcy5lbnYubW9uZ29kYlBhc3N3b3JkfTtleHBvcnRzLmRlZmF1bHQ9bW9uZ29kYkNvbmZpZzsiLCJcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLlZhbGlkYXRlZFF1ZXJ5PXZvaWQgMDtjb25zdCByZW1vdmVFbXB0eVZhbHVlc18xPXJlcXVpcmUoXCIuLi91dGlscy9yZW1vdmVFbXB0eVZhbHVlc1wiKSx1dGlsaXR5RnVuY3Rpb25zXzE9cmVxdWlyZShcIi4uL3V0aWxzL3V0aWxpdHlGdW5jdGlvbnNcIik7ZnVuY3Rpb24gVmFsaWRhdGVkUXVlcnkocXVlcnkpe2NvbnN0IHdpdGhvdXRFbXB0eVZhbHVlcz11bmRlZmluZWQsd2l0aG91dFVubWF0Y2hlZE9wdGlvbnM9dW5kZWZpbmVkO3JldHVybiByZW1vdmVVbm1hdGNoZWRPcHRpb25zKCgwLHJlbW92ZUVtcHR5VmFsdWVzXzEucmVtb3ZlRW1wdHlWYWx1ZXMpKHF1ZXJ5KSl9ZnVuY3Rpb24gcmVtb3ZlVW5tYXRjaGVkT3B0aW9ucyhxdWVyeSl7aWYoKDAsdXRpbGl0eUZ1bmN0aW9uc18xLmlzRW1wdHkpKHF1ZXJ5KSlyZXR1cm4gbnVsbDtjb25zdCBuZXdRdWVyeT1PYmplY3QuYXNzaWduKHt9LHF1ZXJ5KSxwcm9wZXJ0aWVzPU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHF1ZXJ5KSxmaWVsZHM9cHJvcGVydGllcy5maWx0ZXIoKHByb3BlcnR5PT4hcHJvcGVydHkuaW5jbHVkZXMoXCJfb3B0aW9uXCIpKSksb3B0aW9ucz1wcm9wZXJ0aWVzLmZpbHRlcigocHJvcGVydHk9PnByb3BlcnR5LmluY2x1ZGVzKFwiX29wdGlvblwiKSkpO2ZvcihsZXQgb3B0aW9uIG9mIG9wdGlvbnMpe2NvbnN0IGZpZWxkPW9wdGlvbi5zcGxpdChcIl9cIilbMF0saGFzTWF0Y2hpbmdGaWVsZD11bmRlZmluZWQ7ZmllbGRzLmZpbmQoKHZhbHVlPT52YWx1ZT09PWZpZWxkKSl8fGRlbGV0ZSBuZXdRdWVyeVtvcHRpb25dfXJldHVybiBuZXdRdWVyeX1leHBvcnRzLlZhbGlkYXRlZFF1ZXJ5PVZhbGlkYXRlZFF1ZXJ5OyIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2NvbnN0IGVycm9yVXRpbHNfMT1yZXF1aXJlKFwiLi4vdXRpbHMvZXJyb3JVdGlsc1wiKSxhdXRoZW50aWNhdGVfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL2NvbnRyb2xsZXJzL2F1dGhlbnRpY2F0ZVwiKSksdmFsaWRhdGU9e3Rva2VuOnRva2VufTthc3luYyBmdW5jdGlvbiB0b2tlbihyZXF1ZXN0LHJlc3BvbnNlLG5leHQpe3RyeXtjb25zdHtlbWFpbDplbWFpbCx0b2tlbjp0b2tlbn09cmVxdWVzdC5ib2R5LnVzZXI7cmV0dXJuIGF3YWl0IGF1dGhlbnRpY2F0ZV8xLmRlZmF1bHQudG9rZW4oZW1haWwsdG9rZW4pLG5leHQoKX1jYXRjaChhc3luY0Vycm9yKXtjb25zdHtlcnJvcjplcnJvcixjb2RlOmNvZGUsbWVzc2FnZTptZXNzYWdlfT1hd2FpdCgwLGVycm9yVXRpbHNfMS5oYW5kbGVBc3luY0Vycm9yKShhc3luY0Vycm9yKTtyZXNwb25zZS5zdGF0dXMoY29kZSkuc2VuZChtZXNzYWdlKX19ZXhwb3J0cy5kZWZhdWx0PXZhbGlkYXRlOyIsIlwidXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2NvbnN0IFZhbGlkYXRlZFF1ZXJ5XzE9cmVxdWlyZShcIi4vVmFsaWRhdGVkUXVlcnlcIiksbW9uZ29kYl8xPXJlcXVpcmUoXCJtb25nb2RiXCIpLHZhbGlkYXRlPXtxdWVyeTpxdWVyeSxudW1iZXI6bnVtYmVyLG9iamVjdElkOm9iamVjdElkLHN0cmluZzpzdHJpbmcsYXJyYXk6YXJyYXl9O2Z1bmN0aW9uIHF1ZXJ5KHF1ZXJ5KXtjb25zdCB2YWxpZGF0ZWRRdWVyeT11bmRlZmluZWQ7cmV0dXJuKDAsVmFsaWRhdGVkUXVlcnlfMS5WYWxpZGF0ZWRRdWVyeSkocXVlcnkpfWZ1bmN0aW9uIG51bWJlcih2YWx1ZSl7Y29uc3QgbnVtYmVyPU51bWJlcih2YWx1ZSk7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIG51bWJlcj9udW1iZXI6dmFsdWV9ZnVuY3Rpb24gb2JqZWN0SWQoaWQpe2lmKGlkIGluc3RhbmNlb2YgbW9uZ29kYl8xLk9iamVjdElkKXJldHVybiBpZDt0cnl7Y29uc3Qgb2JqZWN0SWQ9dW5kZWZpbmVkO3JldHVybiBuZXcgbW9uZ29kYl8xLk9iamVjdElkKGlkKX1jYXRjaChpbnZhbGlkT2JqZWN0SWQpe3JldHVybiBpZH19ZnVuY3Rpb24gc3RyaW5nKHZhbHVlKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdmFsdWU/dmFsdWU6YCR7dmFsdWV9YH1mdW5jdGlvbiBhcnJheSh2YWx1ZSl7cmV0dXJuIHZhbHVlfWV4cG9ydHMuZGVmYXVsdD12YWxpZGF0ZTsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTtjb25zdCB1dGlsaXR5RnVuY3Rpb25zU2VydmVyXzE9cmVxdWlyZShcIi4uL3V0aWxpdHlGdW5jdGlvbnNTZXJ2ZXJcIiksY2FydFV0aWxzXzE9cmVxdWlyZShcIi4uL2NvbnRyb2xsZXJzL2NhcnRVdGlsc1wiKSxlcnJvclV0aWxzXzE9cmVxdWlyZShcIi4uL3V0aWxzL2Vycm9yVXRpbHNcIiksdXNlclV0aWxzXzE9cmVxdWlyZShcIi4uL2NvbnRyb2xsZXJzL3VzZXJVdGlsc1wiKSx2YWxpZGF0ZV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vbWljcm9zZXJ2aWNlcy9wcm9kdWN0L21pZGRsZXdhcmUvdmFsaWRhdGVcIikpO2FzeW5jIGZ1bmN0aW9uIGNhcnREYXRhKHJlcXVlc3QscmVzcG9uc2Upe3RyeXtjb25zdCB2YWxpZFZhbHVlcz0oMCx1dGlsaXR5RnVuY3Rpb25zU2VydmVyXzEuZ2V0VmFsaWRWYWx1ZXMpKHJlcXVlc3QuYm9keSksY2FydD12YWxpZFZhbHVlcy5jYXJ0LGl0ZW09dmFsaWRWYWx1ZXMuaXRlbSx1c2VyPXZhbGlkVmFsdWVzLnVzZXIsdG9rZW49dmFsaWRWYWx1ZXMudG9rZW47dmFsaWRhdGVfMS5kZWZhdWx0LmNhcnQoY2FydCksdmFsaWRhdGVfMS5kZWZhdWx0Lml0ZW0oaXRlbSksY2FydC5faWQ9YXdhaXQoMCx1c2VyVXRpbHNfMS5nZXRDYXJ0SWQpKHVzZXIsdG9rZW4pO2NvbnN0IHJlc3VsdD1hd2FpdCgwLGNhcnRVdGlsc18xLnJlbW92ZUl0ZW1Gcm9tQ2FydCkoY2FydCxpdGVtKTtyZXNwb25zZS5zdGF0dXMoMjAwKS5zZW5kKHJlc3VsdCl9Y2F0Y2goYXN5bmNFcnJvcil7Y29uc3R7ZXJyb3I6ZXJyb3IsbWVzc2FnZTptZXNzYWdlLGNvZGU6Y29kZX09YXdhaXQoMCxlcnJvclV0aWxzXzEuaGFuZGxlQXN5bmNFcnJvcikoYXN5bmNFcnJvcik7cmVzcG9uc2Uuc3RhdHVzKGNvZGUpLnNlbmQobWVzc2FnZSl9fWV4cG9ydHMuZGVmYXVsdD17Y2FydERhdGE6Y2FydERhdGF9OyIsIlwidXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGV4cG9ydHMudXJscz1leHBvcnRzLmhvc3RVcmw9ZXhwb3J0cy5lbmRwb2ludHM9dm9pZCAwLGV4cG9ydHMuZW5kcG9pbnRzPXtiYXNlVXJsOlwiL1wiLGFwaTpcIi9hcGlcIixjYXJ0OlwiL2FwaS9jYXJ0XCIsaW52ZW50b3J5OlwiL2FwaS9pbnZlbnRvcnlcIixsb2dpbjpcIi9hcGkvbG9naW5cIixsb2dvdXQ6XCIvYXBpL2xvZ291dFwiLHNpZ251cDpcIi9hcGkvc2lnbnVwXCIsdXNlcjpcIi9hcGkvdXNlclwiLHRlc3Q6XCIvdGVzdFwiLHJlZGlyZWN0OlwiL2FwaS9hdXRoL3JlZGlyZWN0XCIsY2FsbGJhY2s6XCIvYXBpL2F1dGgvY2FsbGJhY2tcIixyZWZyZXNoOlwiL2FwaS9hdXRoL3JlZnJlc2hcIixyZXZva2U6XCIvYXBpL2F1dGgvcmV2b2tlXCIsZHluYW1pYzpcIi9hcGkvOm1pY3Jvc2VydmljZS86ZW5kcG9pbnQvOmNvbW1hbmRcIn0sZXhwb3J0cy5ob3N0VXJsPXByb2Nlc3MuZW52Lmhvc3QsZXhwb3J0cy51cmxzPXtob3N0OmV4cG9ydHMuaG9zdFVybCxyb290OmV4cG9ydHMuaG9zdFVybCtleHBvcnRzLmVuZHBvaW50cy5iYXNlVXJsLGFwaTpleHBvcnRzLmhvc3RVcmwrZXhwb3J0cy5lbmRwb2ludHMuYXBpLGNhcnQ6ZXhwb3J0cy5ob3N0VXJsK2V4cG9ydHMuZW5kcG9pbnRzLmNhcnQsaW52ZW50b3J5OmV4cG9ydHMuaG9zdFVybCtleHBvcnRzLmVuZHBvaW50cy5pbnZlbnRvcnksbG9naW46ZXhwb3J0cy5ob3N0VXJsK2V4cG9ydHMuZW5kcG9pbnRzLmxvZ2luLGxvZ291dDpleHBvcnRzLmhvc3RVcmwrZXhwb3J0cy5lbmRwb2ludHMubG9nb3V0LHNpZ251cDpleHBvcnRzLmhvc3RVcmwrZXhwb3J0cy5lbmRwb2ludHMuc2lnbnVwLGFjY291bnQ6ZXhwb3J0cy5ob3N0VXJsK2V4cG9ydHMuZW5kcG9pbnRzLnVzZXIsdGVzdDpleHBvcnRzLmhvc3RVcmwrZXhwb3J0cy5lbmRwb2ludHMudGVzdH07IiwiXCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy5nZXREYk9wZXJhdGlvbj12b2lkIDA7Y29uc3QgTUlDUk9TRVJWSUNFU18xPXJlcXVpcmUoXCIuLi9taWNyb3NlcnZpY2VzL01JQ1JPU0VSVklDRVNcIik7ZnVuY3Rpb24gZ2V0RGJPcGVyYXRpb24obWljcm9zZXJ2aWNlLGVuZHBvaW50LGNvbW1hbmQpe2NvbnN0IGNvbnRyb2xsZXJzPU1JQ1JPU0VSVklDRVNfMS5NSUNST1NFUlZJQ0VTW21pY3Jvc2VydmljZV07aWYoIWNvbnRyb2xsZXJzKXRocm93IG5ldyBFcnJvcihcIkVSUk9SOiBJbnZhbGlkIG1pY3Jvc2VydmljZVwiKTtjb25zdCBjb250cm9sbGVyPWNvbnRyb2xsZXJzW2VuZHBvaW50XTtpZighY29udHJvbGxlcil0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogSW52YWxpZCBlbmRwb2ludFwiKTtjb25zdCBkYk9wZXJhdGlvbj1jb250cm9sbGVyW2NvbW1hbmRdO2lmKCFkYk9wZXJhdGlvbil0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogSW52YWxpZCBjb21tYW5kXCIpO3JldHVybiBkYk9wZXJhdGlvbn1leHBvcnRzLmdldERiT3BlcmF0aW9uPWdldERiT3BlcmF0aW9uOyIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGV4cG9ydHMuaGFuZGxlUm91dGU9dm9pZCAwO2NvbnN0IHZhbGlkYXRlXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9taWRkbGV3YXJlL3ZhbGlkYXRlXCIpKSxnZXREYk9wZXJhdGlvbl8xPXJlcXVpcmUoXCIuL2dldERiT3BlcmF0aW9uXCIpO2FzeW5jIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKHJlcXVlc3QscmVzcG9uc2Upe2NvbnN0e21pY3Jvc2VydmljZTptaWNyb3NlcnZpY2UsZW5kcG9pbnQ6ZW5kcG9pbnQsY29tbWFuZDpjb21tYW5kfT1yZXF1ZXN0LnBhcmFtcyx7cXVlcnk6cXVlcnksYm9keTpib2R5fT1yZXF1ZXN0LG5ld1F1ZXJ5PU9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSxxdWVyeSksYm9keSksdmFsaWRhdGVkUXVlcnk9dmFsaWRhdGVfMS5kZWZhdWx0LnF1ZXJ5KG5ld1F1ZXJ5KTt0cnl7Y29uc3QgZGJPcGVyYXRpb249KDAsZ2V0RGJPcGVyYXRpb25fMS5nZXREYk9wZXJhdGlvbikobWljcm9zZXJ2aWNlLGVuZHBvaW50LGNvbW1hbmQpLHJlc3VsdD1hd2FpdCBkYk9wZXJhdGlvbih2YWxpZGF0ZWRRdWVyeSk7cmVzcG9uc2UuanNvbihyZXN1bHQpfWNhdGNoKGFzeW5jRXJyb3Ipe2F3YWl0IGFzeW5jRXJyb3IscmVzcG9uc2Uuc3RhdHVzKDQwNCkuanNvbihhc3luY0Vycm9yLm1lc3NhZ2UpfX1leHBvcnRzLmhhbmRsZVJvdXRlPWhhbmRsZVJvdXRlOyIsIlwidXNlIHN0cmljdFwiO2Z1bmN0aW9uIHVybEhvbWUoX3JlcXVlc3QscmVzcG9uc2Upe3Jlc3BvbnNlLnNlbmRGaWxlKFwiaW5kZXguaHRtbFwiLHtyb290OlwicHVibGljXCJ9KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLmRlZmF1bHQ9dXJsSG9tZTsiLCJcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTtjb25zdCBjYXJ0VXRpbHNfMT1yZXF1aXJlKFwiLi4vY29udHJvbGxlcnMvY2FydFV0aWxzXCIpLGludmVudG9yeVV0aWxzXzE9cmVxdWlyZShcIi4uL2NvbnRyb2xsZXJzL2ludmVudG9yeVV0aWxzXCIpO2FzeW5jIGZ1bmN0aW9uIGludmVudG9yeURhdGEoX3JlcXVlc3QscmVzcG9uc2Upe3RyeXtjb25zdCBpbnZlbnRvcnk9YXdhaXQoMCxpbnZlbnRvcnlVdGlsc18xLmdldEludmVudG9yeSkoKTtyZXNwb25zZS5zdGF0dXMoMjAwKS5zZW5kKGludmVudG9yeSl9Y2F0Y2goZXJyb3Ipe3Jlc3BvbnNlLnN0YXR1cyg0MDApLnNlbmQoZXJyb3IpfX1hc3luYyBmdW5jdGlvbiBjYXJ0RGF0YShyZXF1ZXN0LHJlc3BvbnNlKXt0cnl7Y29uc3R7ZW1haWw6ZW1haWwsdG9rZW46dG9rZW59PXJlcXVlc3QuYm9keS51c2VyLGNhcnQ9YXdhaXQoMCxjYXJ0VXRpbHNfMS5nZXRDYXJ0QnlUb2tlbikoZW1haWwsdG9rZW4pO3Jlc3BvbnNlLnN0YXR1cygyMDApLnNlbmQoY2FydCl9Y2F0Y2goZXJyb3Ipe3Jlc3BvbnNlLnN0YXR1cyg0MDApLnNlbmQoZXJyb3IpfX1leHBvcnRzLmRlZmF1bHQ9e2NhcnREYXRhOmNhcnREYXRhLGludmVudG9yeURhdGE6aW52ZW50b3J5RGF0YX07IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9faW1wb3J0RGVmYXVsdD10aGlzJiZ0aGlzLl9faW1wb3J0RGVmYXVsdHx8ZnVuY3Rpb24obW9kKXtyZXR1cm4gbW9kJiZtb2QuX19lc01vZHVsZT9tb2Q6e2RlZmF1bHQ6bW9kfX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7Y29uc3QgZXhwcmVzc18xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZXhwcmVzc1wiKSksaG9tZV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9ob21lXCIpKSx0ZXN0UGFnZV8xPXJlcXVpcmUoXCIuL3Rlc3RQYWdlXCIpLHJlYWRfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVhZFwiKSksdXBkYXRlXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3VwZGF0ZVwiKSksZGVsZXRlXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2RlbGV0ZVwiKSksbG9nb3V0XzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9jb250cm9sbGVycy9sb2dvdXRcIikpLHNpZ251cF8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vY29udHJvbGxlcnMvc2lnbnVwXCIpKSxsb2dpbl8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vY29udHJvbGxlcnMvbG9naW5cIikpLHVzZXJfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL2NvbnRyb2xsZXJzL3VzZXJcIikpLGFzc2VydF8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vbWlkZGxld2FyZS9hc3NlcnRcIikpLGFwaV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vY29udHJvbGxlcnMvYXBpXCIpKSxlbmRwb2ludHNfMT1yZXF1aXJlKFwiLi9lbmRwb2ludHNcIiksaGFuZGxlUm91dGVfMT1yZXF1aXJlKFwiLi9oYW5kbGVSb3V0ZVwiKSxkb3RlbnZfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRvdGVudlwiKSk7ZG90ZW52XzEuZGVmYXVsdC5jb25maWcoKTtjb25zdCByb3V0ZXI9ZXhwcmVzc18xLmRlZmF1bHQuUm91dGVyKCk7cm91dGVyLnBvc3QoZW5kcG9pbnRzXzEuZW5kcG9pbnRzLmxvZ2luLGxvZ2luXzEuZGVmYXVsdC53aXRoR29vZ2xlLGxvZ2luXzEuZGVmYXVsdC53aXRoVG9rZW4sbG9naW5fMS5kZWZhdWx0LndpdGhQYXNzd29yZCkscm91dGVyLnBvc3QoZW5kcG9pbnRzXzEuZW5kcG9pbnRzLmxvZ291dCxsb2dvdXRfMS5kZWZhdWx0LndpdGhUb2tlbikscm91dGVyLnBvc3QoZW5kcG9pbnRzXzEuZW5kcG9pbnRzLnNpZ251cCxzaWdudXBfMS5kZWZhdWx0LndpdGhHb29nbGUsc2lnbnVwXzEuZGVmYXVsdC53aXRoUGFzc3dvcmQpLHJvdXRlci5wb3N0KGVuZHBvaW50c18xLmVuZHBvaW50cy51c2VyLHVzZXJfMS5kZWZhdWx0LmZldGNoSW5mbykscm91dGVyLmRlbGV0ZShlbmRwb2ludHNfMS5lbmRwb2ludHMudXNlcix1c2VyXzEuZGVmYXVsdC5kZWxldGUpLHJvdXRlci5wb3N0KGVuZHBvaW50c18xLmVuZHBvaW50cy5jYXJ0LGFzc2VydF8xLmRlZmF1bHQudG9rZW4scmVhZF8xLmRlZmF1bHQuY2FydERhdGEpLHJvdXRlci5wdXQoZW5kcG9pbnRzXzEuZW5kcG9pbnRzLmNhcnQsYXNzZXJ0XzEuZGVmYXVsdC50b2tlbix1cGRhdGVfMS5kZWZhdWx0LmNhcnREYXRhKSxyb3V0ZXIuZGVsZXRlKGVuZHBvaW50c18xLmVuZHBvaW50cy5jYXJ0LGFzc2VydF8xLmRlZmF1bHQudG9rZW4sZGVsZXRlXzEuZGVmYXVsdC5jYXJ0RGF0YSkscm91dGVyLmdldChlbmRwb2ludHNfMS5lbmRwb2ludHMuaW52ZW50b3J5LHJlYWRfMS5kZWZhdWx0LmludmVudG9yeURhdGEpLHJvdXRlci5nZXQoZW5kcG9pbnRzXzEuZW5kcG9pbnRzLmJhc2VVcmwsaG9tZV8xLmRlZmF1bHQpLHJvdXRlci5nZXQoZW5kcG9pbnRzXzEuZW5kcG9pbnRzLnRlc3QsdGVzdFBhZ2VfMS50ZXN0UGFnZSkscm91dGVyLnBvc3QoZW5kcG9pbnRzXzEuZW5kcG9pbnRzLnRlc3QsdGVzdFBhZ2VfMS50ZXN0UGFnZSkscm91dGVyLmdldChlbmRwb2ludHNfMS5lbmRwb2ludHMuYXBpLGFwaV8xLmRlZmF1bHQucGluZykscm91dGVyLmdldChlbmRwb2ludHNfMS5lbmRwb2ludHMuZHluYW1pYyxoYW5kbGVSb3V0ZV8xLmhhbmRsZVJvdXRlKSxyb3V0ZXIucG9zdChlbmRwb2ludHNfMS5lbmRwb2ludHMuZHluYW1pYyxoYW5kbGVSb3V0ZV8xLmhhbmRsZVJvdXRlKSxyb3V0ZXIucHV0KGVuZHBvaW50c18xLmVuZHBvaW50cy5keW5hbWljLGhhbmRsZVJvdXRlXzEuaGFuZGxlUm91dGUpLHJvdXRlci5kZWxldGUoZW5kcG9pbnRzXzEuZW5kcG9pbnRzLmR5bmFtaWMsaGFuZGxlUm91dGVfMS5oYW5kbGVSb3V0ZSksZXhwb3J0cy5kZWZhdWx0PXJvdXRlcjsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLnRlc3RQYWdlPXZvaWQgMDtjb25zdCBkb3RlbnZfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRvdGVudlwiKSk7ZnVuY3Rpb24gdGVzdFBhZ2UocmVxdWVzdCxyZXNwb25zZSl7Y29uc3QgbWVzc2FnZT1KU09OLnN0cmluZ2lmeSh7bWV0aG9kOnJlcXVlc3QubWV0aG9kLG1vZGU6cHJvY2Vzcy5lbnYubW9kZSxob3N0RW52aXJvbm1lbnQ6cHJvY2Vzcy5lbnYuaG9zdEVudmlyb25tZW50fSk7cmVzcG9uc2Uuc2VuZChtZXNzYWdlKX1kb3RlbnZfMS5kZWZhdWx0LmNvbmZpZygpLGV4cG9ydHMudGVzdFBhZ2U9dGVzdFBhZ2U7IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9faW1wb3J0RGVmYXVsdD10aGlzJiZ0aGlzLl9faW1wb3J0RGVmYXVsdHx8ZnVuY3Rpb24obW9kKXtyZXR1cm4gbW9kJiZtb2QuX19lc01vZHVsZT9tb2Q6e2RlZmF1bHQ6bW9kfX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7Y29uc3QgdXRpbGl0eUZ1bmN0aW9uc1NlcnZlcl8xPXJlcXVpcmUoXCIuLi91dGlsaXR5RnVuY3Rpb25zU2VydmVyXCIpLGNhcnRVdGlsc18xPXJlcXVpcmUoXCIuLi9jb250cm9sbGVycy9jYXJ0VXRpbHNcIiksZXJyb3JVdGlsc18xPXJlcXVpcmUoXCIuLi91dGlscy9lcnJvclV0aWxzXCIpLHVzZXJVdGlsc18xPXJlcXVpcmUoXCIuLi9jb250cm9sbGVycy91c2VyVXRpbHNcIiksdmFsaWRhdGVfMT1fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL21pY3Jvc2VydmljZXMvcHJvZHVjdC9taWRkbGV3YXJlL3ZhbGlkYXRlXCIpKTthc3luYyBmdW5jdGlvbiBjYXJ0RGF0YShyZXF1ZXN0LHJlc3BvbnNlKXt2YXIgX2EsX2I7dHJ5e2NvbnN0IHZhbGlkVmFsdWVzPSgwLHV0aWxpdHlGdW5jdGlvbnNTZXJ2ZXJfMS5nZXRWYWxpZFZhbHVlcykocmVxdWVzdC5ib2R5KSx1c2VyPXZhbGlkVmFsdWVzLnVzZXIsY2FydD12YWxpZFZhbHVlcy5jYXJ0LHRva2VuPXZhbGlkVmFsdWVzLnRva2VuO2xldCByZXN1bHQ7dmFsaWRhdGVfMS5kZWZhdWx0LmNhcnQoY2FydCksY2FydC5faWQ9YXdhaXQoMCx1c2VyVXRpbHNfMS5nZXRDYXJ0SWQpKHVzZXIsdG9rZW4pO2NvbnN0IGl0ZW09dmFsaWRWYWx1ZXMuaXRlbSxpdGVtX2lkcz1udWxsPT09KF9iPW51bGw9PT0oX2E9bnVsbD09cmVxdWVzdD92b2lkIDA6cmVxdWVzdC5ib2R5KXx8dm9pZCAwPT09X2E/dm9pZCAwOl9hLmNhcnQpfHx2b2lkIDA9PT1fYj92b2lkIDA6X2IuaXRlbV9pZHM7aXRlbT9yZXN1bHQ9YXdhaXQoMCxjYXJ0VXRpbHNfMS51cGRhdGVDYXJ0KShjYXJ0LGl0ZW0pOml0ZW1faWRzJiYocmVzdWx0PWF3YWl0KDAsY2FydFV0aWxzXzEuc2V0Q2FydCkoY2FydCxpdGVtX2lkcykpLHJlc3BvbnNlLnN0YXR1cygyMDApLnNlbmQocmVzdWx0KX1jYXRjaChhc3luY0Vycm9yKXtjb25zdHtlcnJvcjplcnJvcixtZXNzYWdlOm1lc3NhZ2UsY29kZTpjb2RlfT1hd2FpdCgwLGVycm9yVXRpbHNfMS5oYW5kbGVBc3luY0Vycm9yKShhc3luY0Vycm9yKTtyZXNwb25zZS5zdGF0dXMoY29kZSkuc2VuZChtZXNzYWdlKX19ZXhwb3J0cy5kZWZhdWx0PXtjYXJ0RGF0YTpjYXJ0RGF0YX07IiwiXCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy50b1VzZWRQcm9wZXJ0aWVzPWV4cG9ydHMuZ2V0VmFsaWRWYWx1ZXM9dm9pZCAwO2NvbnN0IHV0aWxpdHlGdW5jdGlvbnNfMT1yZXF1aXJlKFwiLi91dGlscy91dGlsaXR5RnVuY3Rpb25zXCIpLHZhbGlkVmFsdWVzPVt7dGFibGU6XCJjYXJ0XCIscHJvcGVydGllczpbXCJfaWRcIixcIml0ZW1faWRzXCIsXCJ0b3RhbFF1YW50aXR5XCIsXCJ0b3RhbFByaWNlXCJdfSx7dGFibGU6XCJpdGVtXCIscHJvcGVydGllczpbXCJfaWRcIixcInF1YW50aXR5XCIsXCJzdWJ0b3RhbFwiXX0se3RhYmxlOlwiaW52ZW50b3J5XCIscHJvcGVydGllczpbXCJfaWRcIixcIml0ZW1faWRzXCIsXCJ0b3RhbFF1YW50aXR5XCIsXCJ0b3RhbFByaWNlXCJdfSx7dGFibGU6XCJ1c2VyXCIscHJvcGVydGllczpbXCJfaWRcIixcIm5hbWVcIixcImVtYWlsXCIsXCJ0b2tlblwiXX1dO2Z1bmN0aW9uIGdldFZhbGlkVmFsdWVzKG9iamVjdCx2YWxpZFRhYmxlc0FuZFByb3BlcnRpZXM9dmFsaWRWYWx1ZXMpe3ZhbGlkVGFibGVzQW5kUHJvcGVydGllcyBpbnN0YW5jZW9mIEFycmF5fHwodmFsaWRUYWJsZXNBbmRQcm9wZXJ0aWVzPVt2YWxpZFRhYmxlc0FuZFByb3BlcnRpZXNdKTtsZXQgdmFsaWRWYWx1ZXM9e307Zm9yKGxldCB2YWxpZE9iamVjdCBvZiB2YWxpZFRhYmxlc0FuZFByb3BlcnRpZXMpe2NvbnN0IHRhYmxlPXZhbGlkT2JqZWN0LnRhYmxlO2xldCB2YWxpZFByb3BlcnRpZXM9dmFsaWRPYmplY3QucHJvcGVydGllczt2YWxpZFByb3BlcnRpZXMgaW5zdGFuY2VvZiBBcnJheXx8KHZhbGlkUHJvcGVydGllcz1bdmFsaWRQcm9wZXJ0aWVzXSk7Y29uc3QgdmFsaWRQcm9wZXJ0aWVzQW5kVmFsdWVzPSgwLHV0aWxpdHlGdW5jdGlvbnNfMS5yZWR1Y2UpKG9iamVjdFt0YWJsZV0sdG9Vc2VkUHJvcGVydGllcyh2YWxpZFByb3BlcnRpZXMpKTsoMCx1dGlsaXR5RnVuY3Rpb25zXzEuaXNFbXB0eSkodmFsaWRQcm9wZXJ0aWVzQW5kVmFsdWVzKXx8KHZhbGlkVmFsdWVzW3RhYmxlXT12YWxpZFByb3BlcnRpZXNBbmRWYWx1ZXMpfXJldHVybigwLHV0aWxpdHlGdW5jdGlvbnNfMS5pc0VtcHR5KSh2YWxpZFZhbHVlcyk/bnVsbDp2YWxpZFZhbHVlc31mdW5jdGlvbiB0b1VzZWRQcm9wZXJ0aWVzKHByb3BlcnRpZXNBcnJheSl7cmV0dXJuIGZ1bmN0aW9uKHVzZWRQcm9wZXJ0aWVzPXt9LHZhbHVlLHByb3BlcnR5LF9vYmplY3Qpe3JldHVybiB2b2lkIDA9PT12YWx1ZXx8dmFsdWU8MHx8cHJvcGVydGllc0FycmF5LmluY2x1ZGVzKHByb3BlcnR5KSYmKHVzZWRQcm9wZXJ0aWVzW3Byb3BlcnR5XT12YWx1ZSksdXNlZFByb3BlcnRpZXN9fWV4cG9ydHMuZ2V0VmFsaWRWYWx1ZXM9Z2V0VmFsaWRWYWx1ZXMsZXhwb3J0cy50b1VzZWRQcm9wZXJ0aWVzPXRvVXNlZFByb3BlcnRpZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7Y29uc3QgY29uZmlndXJlS25leF8xPXJlcXVpcmUoXCIuL2NvbmZpZ3VyZUtuZXhcIiksY29uZmlndXJlTXlzcWxfMT1yZXF1aXJlKFwiLi9jb25maWd1cmVNeXNxbFwiKSxjb25maWd1cmVUeXBlb3JtXzE9cmVxdWlyZShcIi4vY29uZmlndXJlVHlwZW9ybVwiKSxjb25maWd1cmVTcWxpdGVfMT1yZXF1aXJlKFwiLi9jb25maWd1cmVTcWxpdGVcIiksY29uZmlndXJlU3FsS25leF8xPXJlcXVpcmUoXCIuL2NvbmZpZ3VyZVNxbEtuZXhcIiksY29uZmlndXJlU3FsTXlzcWxfMT1yZXF1aXJlKFwiLi9jb25maWd1cmVTcWxNeXNxbFwiKSxjb25maWd1cmVTcWxUeXBlb3JtXzE9cmVxdWlyZShcIi4vY29uZmlndXJlU3FsVHlwZW9ybVwiKSxzcWxLbmV4XzE9cmVxdWlyZShcIi4vc3FsS25leFwiKSxzcWxUeXBlb3JtXzE9cmVxdWlyZShcIi4vc3FsVHlwZW9ybVwiKSxzcWxTcWxpdGVfMT1yZXF1aXJlKFwiLi9zcWxTcWxpdGVcIiksc3FsU3FsaXRlRmlsZV8xPXJlcXVpcmUoXCIuL3NxbFNxbGl0ZUZpbGVcIiksc3FsTXlzcWxfMT1yZXF1aXJlKFwiLi9zcWxNeXNxbFwiKTtjbGFzcyBEYXRhYmFzZXtjb25zdHJ1Y3Rvcigpe3RoaXMuY29uZmlndXJlS25leD1jb25maWd1cmVLbmV4XzEuY29uZmlndXJlS25leC5iaW5kKHRoaXMpLHRoaXMuY29uZmlndXJlTXlzcWw9Y29uZmlndXJlTXlzcWxfMS5jb25maWd1cmVNeXNxbC5iaW5kKHRoaXMpLHRoaXMuY29uZmlndXJlVHlwZW9ybT1jb25maWd1cmVUeXBlb3JtXzEuY29uZmlndXJlVHlwZW9ybS5iaW5kKHRoaXMpLHRoaXMuY29uZmlndXJlU3FsaXRlPWNvbmZpZ3VyZVNxbGl0ZV8xLmNvbmZpZ3VyZVNxbGl0ZS5iaW5kKHRoaXMpLHRoaXMuY29uZmlndXJlU3FsS25leD1jb25maWd1cmVTcWxLbmV4XzEuY29uZmlndXJlU3FsS25leC5iaW5kKHRoaXMpLHRoaXMuY29uZmlndXJlU3FsTXlzcWw9Y29uZmlndXJlU3FsTXlzcWxfMS5jb25maWd1cmVTcWxNeXNxbC5iaW5kKHRoaXMpLHRoaXMuY29uZmlndXJlU3FsVHlwZW9ybT1jb25maWd1cmVTcWxUeXBlb3JtXzEuY29uZmlndXJlU3FsVHlwZW9ybS5iaW5kKHRoaXMpLHRoaXMuc3FsS25leD1zcWxLbmV4XzEuc3FsS25leC5iaW5kKHRoaXMpLHRoaXMuc3FsVHlwZW9ybT1zcWxUeXBlb3JtXzEuc3FsVHlwZW9ybS5iaW5kKHRoaXMpLHRoaXMuc3FsU3FsaXRlPXNxbFNxbGl0ZV8xLnNxbFNxbGl0ZS5iaW5kKHRoaXMpLHRoaXMuc3FsU3FsaXRlRmlsZT1zcWxTcWxpdGVGaWxlXzEuc3FsU3FsaXRlRmlsZS5iaW5kKHRoaXMpLHRoaXMuc3FsTXlzcWw9c3FsTXlzcWxfMS5zcWxNeXNxbC5iaW5kKHRoaXMpfX1leHBvcnRzLmRlZmF1bHQ9RGF0YWJhc2U7IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9faW1wb3J0RGVmYXVsdD10aGlzJiZ0aGlzLl9faW1wb3J0RGVmYXVsdHx8ZnVuY3Rpb24obW9kKXtyZXR1cm4gbW9kJiZtb2QuX19lc01vZHVsZT9tb2Q6e2RlZmF1bHQ6bW9kfX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy5jb25maWd1cmVLbmV4PXZvaWQgMDtjb25zdCBrbmV4XzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJrbmV4XCIpKTtmdW5jdGlvbiBjb25maWd1cmVLbmV4KGtuZXhmaWxlQ29uZmlnKXtpZigha25leGZpbGVDb25maWcpdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IGtuZXhmaWxlIGlzIHJlcXVpcmVkXCIpO2NvbnN0IGtuZXg9KDAsa25leF8xLmRlZmF1bHQpKGtuZXhmaWxlQ29uZmlnKTt0aGlzLmtuZXg9a25leH1leHBvcnRzLmNvbmZpZ3VyZUtuZXg9Y29uZmlndXJlS25leDsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLmNvbmZpZ3VyZU15c3FsPXZvaWQgMDtjb25zdCBteXNxbF8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwibXlzcWxcIikpO2Z1bmN0aW9uIGNvbmZpZ3VyZU15c3FsKG15c3FsQ29uZmlnKXtjb25zdCBteXNxbD1teXNxbF8xLmRlZmF1bHQuY3JlYXRlQ29ubmVjdGlvbih7aG9zdDpteXNxbENvbmZpZy5ob3N0LHVzZXI6bXlzcWxDb25maWcudXNlcixwYXNzd29yZDpteXNxbENvbmZpZy5wYXNzd29yZH0pO3RoaXMubXlzcWw9bXlzcWx9ZXhwb3J0cy5jb25maWd1cmVNeXNxbD1jb25maWd1cmVNeXNxbDsiLCJcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBjb25maWd1cmVTcWxLbmV4KCl7aWYoIXRoaXMua25leCl0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjoga25leCBtdXN0IGJlIGNvbmZpZ3VyZWRcIik7dGhpcy5zcWw9dGhpcy5zcWxLbmV4LmJpbmQodGhpcyl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy5jb25maWd1cmVTcWxLbmV4PXZvaWQgMCxleHBvcnRzLmNvbmZpZ3VyZVNxbEtuZXg9Y29uZmlndXJlU3FsS25leDsiLCJcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBjb25maWd1cmVTcWxNeXNxbCgpe2lmKCF0aGlzLnR5cGVvcm0pdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IG15c3FsIG11c3QgYmUgY29uZmlndXJlZFwiKTt0aGlzLnNxbD10aGlzLnNxbE15c3FsLmJpbmQodGhpcyl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy5jb25maWd1cmVTcWxNeXNxbD12b2lkIDAsZXhwb3J0cy5jb25maWd1cmVTcWxNeXNxbD1jb25maWd1cmVTcWxNeXNxbDsiLCJcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBjb25maWd1cmVTcWxUeXBlb3JtKCl7aWYoIXRoaXMudHlwZW9ybSl0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogdHlwZW9ybSBtdXN0IGJlIGNvbmZpZ3VyZWRcIik7dGhpcy5zcWw9dGhpcy5zcWxUeXBlb3JtLmJpbmQodGhpcyksdGhpcy5zcWwuaW5pdGlhbGl6ZWQ9YXN5bmMgZnVuY3Rpb24oKXt0aGlzLnR5cGVvcm0uaXNJbml0aWFsaXplZHx8YXdhaXQgdGhpcy50eXBlb3JtLmluaXRpYWxpemUoKX0uYmluZCh0aGlzKX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLmNvbmZpZ3VyZVNxbFR5cGVvcm09dm9pZCAwLGV4cG9ydHMuY29uZmlndXJlU3FsVHlwZW9ybT1jb25maWd1cmVTcWxUeXBlb3JtOyIsIlwidXNlIHN0cmljdFwiO3ZhciBfX2ltcG9ydERlZmF1bHQ9dGhpcyYmdGhpcy5fX2ltcG9ydERlZmF1bHR8fGZ1bmN0aW9uKG1vZCl7cmV0dXJuIG1vZCYmbW9kLl9fZXNNb2R1bGU/bW9kOntkZWZhdWx0Om1vZH19O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGV4cG9ydHMuY29uZmlndXJlU3FsaXRlPXZvaWQgMDtjb25zdCBiZXR0ZXJfc3FsaXRlM18xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYmV0dGVyLXNxbGl0ZTNcIikpO2Z1bmN0aW9uIGNvbmZpZ3VyZVNxbGl0ZShjd2QsZmlsZW5hbWUpe2lmKCFjd2QpdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkgaXMgcmVxdWlyZWRcIik7aWYoIWZpbGVuYW1lKXRocm93IG5ldyBFcnJvcihcIkVSUk9SOiBmaWxlbmFtZSBpcyByZXF1aXJlZFwiKTt0aGlzLnNxbGl0ZT1uZXcgYmV0dGVyX3NxbGl0ZTNfMS5kZWZhdWx0KGN3ZCtcIi9cIitmaWxlbmFtZSksdGhpcy5zcWxpdGUuY3dkPWN3ZH1leHBvcnRzLmNvbmZpZ3VyZVNxbGl0ZT1jb25maWd1cmVTcWxpdGU7IiwiXCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gY29uZmlndXJlVHlwZW9ybShhcHBEYXRhU291cmNlKXtpZighYXBwRGF0YVNvdXJjZSl0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogQXBwRGF0YVNvdXJjZSBpcyByZXF1aXJlZFwiKTt0aGlzLnR5cGVvcm09YXBwRGF0YVNvdXJjZSx0aGlzLnR5cGVvcm0uaW5pdGlhbGl6ZSgpLHRoaXMudHlwZW9ybS5pbml0aWFsaXplZD1hc3luYyBmdW5jdGlvbigpe3JldHVybiB0aGlzLnR5cGVvcm0uaXNJbml0aWFsaXplZD92b2lkIDA6YXdhaXQgdGhpcy50eXBlb3JtLmluaXRpYWxpemUoKX0uYmluZCh0aGlzKX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLmNvbmZpZ3VyZVR5cGVvcm09dm9pZCAwLGV4cG9ydHMuY29uZmlndXJlVHlwZW9ybT1jb25maWd1cmVUeXBlb3JtOyIsIlwidXNlIHN0cmljdFwiO2FzeW5jIGZ1bmN0aW9uIHNxbEtuZXgoc3FsQ29tbWFuZCxwYXJhbWV0ZXJzKXtjb25zdCByZXN1bHRzPXVuZGVmaW5lZDtyZXR1cm4oYXdhaXQgdGhpcy5rbmV4LnJhdyhzcWxDb21tYW5kLHBhcmFtZXRlcnMpKVswXX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLnNxbEtuZXg9dm9pZCAwLGV4cG9ydHMuc3FsS25leD1zcWxLbmV4OyIsIlwidXNlIHN0cmljdFwiO2FzeW5jIGZ1bmN0aW9uIHNxbE15c3FsKHNxbENvbW1hbmQscGFyYW1ldGVycyl7cmV0dXJuIHRoaXMubXlzcWwucmF3KHNxbENvbW1hbmQscGFyYW1ldGVycyl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy5zcWxNeXNxbD12b2lkIDAsZXhwb3J0cy5zcWxNeXNxbD1zcWxNeXNxbDsiLCJcInVzZSBzdHJpY3RcIjthc3luYyBmdW5jdGlvbiBzcWxTcWxpdGUoc3FsQ29tbWFuZCxsYWJlbD1cIlwiKXtjb25zdCByZXN1bHRzPXRoaXMuc3FsaXRlLnByZXBhcmUoc3FsQ29tbWFuZCkuYWxsKCk7cmV0dXJuIGNvbnNvbGUubG9nKGxhYmVsLFwiXFxuXCIscmVzdWx0cyxcIlxcblwiKSxyZXN1bHRzfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGV4cG9ydHMuc3FsU3FsaXRlPXZvaWQgMCxleHBvcnRzLnNxbFNxbGl0ZT1zcWxTcWxpdGU7IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9faW1wb3J0RGVmYXVsdD10aGlzJiZ0aGlzLl9faW1wb3J0RGVmYXVsdHx8ZnVuY3Rpb24obW9kKXtyZXR1cm4gbW9kJiZtb2QuX19lc01vZHVsZT9tb2Q6e2RlZmF1bHQ6bW9kfX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy5zcWxTcWxpdGVGaWxlPXZvaWQgMDtjb25zdCBmc18xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZnNcIikpO2FzeW5jIGZ1bmN0aW9uIHNxbFNxbGl0ZUZpbGUoZmlsZW5hbWUsY3dkPXRoaXMuc3FsaXRlLmN3ZCl7aWYoIWN3ZCl0aHJvdyBuZXcgRXJyb3IoXCJFUlJPUjogc3FsaXRlIGlzIG5vdCBjb25maWd1cmVkXCIpO2NvbnN0IFNRTGNvbW1hbmRzPWZzXzEuZGVmYXVsdC5yZWFkRmlsZVN5bmMoY3dkK1wiL1wiK2ZpbGVuYW1lKTt0aGlzLnNxbGl0ZS5leGVjKFNRTGNvbW1hbmRzLnRvU3RyaW5nKCkpfWV4cG9ydHMuc3FsU3FsaXRlRmlsZT1zcWxTcWxpdGVGaWxlOyIsIlwidXNlIHN0cmljdFwiO2FzeW5jIGZ1bmN0aW9uIHNxbFR5cGVvcm0oc3FsQ29tbWFuZCxwYXJhbWV0ZXJzKXtjb25zdCByZXN1bHRzPXVuZGVmaW5lZDtyZXR1cm4gYXdhaXQgdGhpcy50eXBlb3JtLnF1ZXJ5KHNxbENvbW1hbmQscGFyYW1ldGVycyl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy5zcWxUeXBlb3JtPXZvaWQgMCxleHBvcnRzLnNxbFR5cGVvcm09c3FsVHlwZW9ybTsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTtjb25zdCBEYXRhYmFzZV8xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vdjEuMC9EYXRhYmFzZVwiKSksY29uZmlndXJlTW9uZ29kYl8xPXJlcXVpcmUoXCIuL2NvbmZpZ3VyZU1vbmdvZGJcIik7Y2xhc3MgRGF0YWJhc2UgZXh0ZW5kcyBEYXRhYmFzZV8xLmRlZmF1bHR7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLHRoaXMuY29uZmlndXJlTW9uZ29kYj1jb25maWd1cmVNb25nb2RiXzEuY29uZmlndXJlTW9uZ29kYi5iaW5kKHRoaXMpfX1leHBvcnRzLmRlZmF1bHQ9RGF0YWJhc2U7IiwiXCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy5jb25maWd1cmVNb25nb2RiPXZvaWQgMDtjb25zdCBQcm9taXNlRXh0ZW5kc18xPXJlcXVpcmUoXCIuLi8uLi9Qcm9taXNlRXh0ZW5kc1wiKSxtb25nb2RiXzE9cmVxdWlyZShcIm1vbmdvZGJcIiksaXNEb2NrZXJFbnZpcm9ubWVudF8xPXJlcXVpcmUoXCIuLi8uLi9nZW5lcmFsVXRpbHMvaXNEb2NrZXJFbnZpcm9ubWVudFwiKTtmdW5jdGlvbiBjb25maWd1cmVNb25nb2RiKHtjb25uZWN0aW9uU3RyaW5nOmNvbm5lY3Rpb25TdHJpbmcsZGF0YWJhc2U6ZGF0YWJhc2V9KXtjb25zdHtwcm90b2NvbDpwcm90b2NvbCxwb3J0OnBvcnR9PW5ldyBVUkwoY29ubmVjdGlvblN0cmluZyk7YXN5bmMgZnVuY3Rpb24gZ2V0Q2xpZW50QW5kRGIocmVzb2x2ZSxyZWplY3Qpe3RyeXtjb25zdCBjbGllbnQ9bmV3IG1vbmdvZGJfMS5Nb25nb0NsaWVudChjb25uZWN0aW9uU3RyaW5nKTthd2FpdCBjbGllbnQuY29ubmVjdCgpO2NvbnN0IGRiPWNsaWVudC5kYihkYXRhYmFzZSk7cmVzb2x2ZSh7Y2xpZW50OmNsaWVudCxkYjpkYn0pfWNhdGNoKGFzeW5jRXJyb3Ipe2NvbnNvbGUuZXJyb3IoXCJFUlJPUjogVW5hYmxlIHRvIGNvbm5lY3QgdG8gbW9uZ29kYlwiKSxhd2FpdCBhc3luY0Vycm9yLHJlamVjdChhc3luY0Vycm9yKX19Y29ubmVjdGlvblN0cmluZz0oMCxpc0RvY2tlckVudmlyb25tZW50XzEuaXNEb2NrZXJFbnZpcm9ubWVudCkoKSYmY29ubmVjdGlvblN0cmluZy5pbmNsdWRlcyhcImxvY2FsaG9zdFwiKT9gJHtwcm90b2NvbH0vL2hvc3QuZG9ja2VyLmludGVybmFsOiR7cG9ydH1gOmNvbm5lY3Rpb25TdHJpbmcsdGhpcy5tb25nb2RiPSgwLFByb21pc2VFeHRlbmRzXzEuUHJvbWlzZUV4dGVuZHMpKGdldENsaWVudEFuZERiLmJpbmQodGhpcykpLHRoaXMubW9uZ29kYi5nZXRDb2xsZWN0aW9uPWNvbGxlY3Rpb25OYW1lPT57cmV0dXJuKDAsUHJvbWlzZUV4dGVuZHNfMS5Qcm9taXNlRXh0ZW5kcykoZ2V0Q29sbGVjdGlvbi5iaW5kKHRoaXMpKTthc3luYyBmdW5jdGlvbiBnZXRDb2xsZWN0aW9uKHJlc29sdmUpe2F3YWl0IHRoaXMubW9uZ29kYjtjb25zdHtkYjpkYn09dGhpcy5tb25nb2RiLGNvbGxlY3Rpb249dW5kZWZpbmVkO3Jlc29sdmUoZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSkpfX19ZXhwb3J0cy5jb25maWd1cmVNb25nb2RiPWNvbmZpZ3VyZU1vbmdvZGI7IiwiXCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gUHJvbWlzZUV4dGVuZHMocHJvbWlzZUNhbGxiYWNrKXtjb25zdCBleHRlbmRlZFByb21pc2U9bmV3IFByb21pc2UoZXh0ZW5kZWRDYWxsYmFjayk7cmV0dXJuIGV4dGVuZGVkUHJvbWlzZTtmdW5jdGlvbiBleHRlbmRlZENhbGxiYWNrKHJlc29sdmUscmVqZWN0KXtmdW5jdGlvbiBleHRlbmRlZFJlc29sdmUocmVzb2x2ZWRWYWx1ZSl7XCJvYmplY3RcIj09dHlwZW9mIHJlc29sdmVkVmFsdWU/KE9iamVjdC5hc3NpZ24oZXh0ZW5kZWRQcm9taXNlLHJlc29sdmVkVmFsdWUpLE9iamVjdC5zZXRQcm90b3R5cGVPZihleHRlbmRlZFByb21pc2UscmVzb2x2ZWRWYWx1ZSkpOk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHRlbmRlZFByb21pc2UsXCJ2YWx1ZVwiLHt2YWx1ZTpyZXNvbHZlZFZhbHVlfSkscmVzb2x2ZShcIlByb21pc2UgaGFzIGJlZW4gZXh0ZW5kZWQgd2l0aCBuZXcgcHJvcGVydGllc1wiKX1tYWtlQXN5bmNocm9ub3VzKCgoKT0+cHJvbWlzZUNhbGxiYWNrKGV4dGVuZGVkUmVzb2x2ZSxyZWplY3QpKSl9fWZ1bmN0aW9uIG1ha2VBc3luY2hyb25vdXMoY2FsbGJhY2spe3NldFRpbWVvdXQoY2FsbGJhY2ssMCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy5Qcm9taXNlRXh0ZW5kcz12b2lkIDAsZXhwb3J0cy5Qcm9taXNlRXh0ZW5kcz1Qcm9taXNlRXh0ZW5kczsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLmhhbmRsZUFzeW5jRXJyb3I9dm9pZCAwO2NvbnN0IGh0dHBDb2Rlc18xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9odHRwQ29kZXNcIikpO2FzeW5jIGZ1bmN0aW9uIGhhbmRsZUFzeW5jRXJyb3IoYXN5bmNFcnJvcil7Y29uc3QgZXJyb3I9YXdhaXQgYXN5bmNFcnJvcixtZXNzYWdlPWVycm9yLm1lc3NhZ2U7bGV0IGNvZGU9ZXJyb3IuY29kZTtyZXR1cm4oXCJudW1iZXJcIiE9dHlwZW9mIGNvZGV8fGNvZGU+PTYwMCkmJihjb2RlPWh0dHBDb2Rlc18xLmRlZmF1bHQuZXJyb3Iuc2VydmVyRXJyb3IpLHtlcnJvcjplcnJvcixjb2RlOmNvZGUsbWVzc2FnZTptZXNzYWdlfX1leHBvcnRzLmhhbmRsZUFzeW5jRXJyb3I9aGFuZGxlQXN5bmNFcnJvcjsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLmlzRG9ja2VyRW52aXJvbm1lbnQ9dm9pZCAwO2NvbnN0IGZzXzE9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJmc1wiKSk7ZnVuY3Rpb24gaXNEb2NrZXJFbnZpcm9ubWVudCgpe3JldHVybiBmc18xLmRlZmF1bHQuZXhpc3RzU3luYyhcIi8uZG9ja2VyZW52XCIpfWV4cG9ydHMuaXNEb2NrZXJFbnZpcm9ubWVudD1pc0RvY2tlckVudmlyb25tZW50OyIsIlwidXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2NvbnN0IGh0dHBDb2Rlcz17c3VjY2Vzczp7Y3JlYXRlZDoyMDEsZ2VuZXJhbDoyMDAsb2s6MjAwfSxlcnJvcjp7YmFkUmVxdWVzdDo0MDAsY29uZmxpY3Q6NDA5LGZvcmJpZGRlblVzZXI6NDAzLGdlbmVyYWw6NDAwLHVuYXV0aG9yaXplZDo0MDEsdW5hdXRoZW50aWNhdGVkOjQwMSxpbmNvcnJlY3RQYXNzd29yZDo0MDEsaW5jb3JyZWN0Q3JlZGVudGlhbHM6NDAxLHNlcnZlckVycm9yOjUwMH0scmVkaXJlY3Q6e2dlbmVyYWw6MzAwfX07ZXhwb3J0cy5kZWZhdWx0PWh0dHBDb2RlczsiLCJcInVzZSBzdHJpY3RcIjt2YXIgX19pbXBvcnREZWZhdWx0PXRoaXMmJnRoaXMuX19pbXBvcnREZWZhdWx0fHxmdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ZGVmYXVsdDptb2R9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxleHBvcnRzLmhhc2g9dm9pZCAwO2NvbnN0IGNyeXB0b18xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiY3J5cHRvXCIpKTtmdW5jdGlvbiBoYXNoKHN0cmluZyxhbGdvcml0aG09XCJzaGEyNTZcIil7dHJ5e2NvbnN0IGhhc2hDb2RlPXVuZGVmaW5lZDtyZXR1cm4gY3J5cHRvXzEuZGVmYXVsdC5jcmVhdGVIYXNoKGFsZ29yaXRobSkudXBkYXRlKHN0cmluZykuZGlnZXN0KFwiaGV4XCIpfWNhdGNoKGVycm9yKXtyZXR1cm59fWV4cG9ydHMuaGFzaD1oYXNoOyIsIlwidXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGV4cG9ydHMucmVtb3ZlRW1wdHlWYWx1ZXM9dm9pZCAwO2NvbnN0IHV0aWxpdHlGdW5jdGlvbnNfMT1yZXF1aXJlKFwiLi91dGlsaXR5RnVuY3Rpb25zXCIpO2Z1bmN0aW9uIHJlbW92ZUVtcHR5VmFsdWVzKG9iamVjdCl7aWYoKDAsdXRpbGl0eUZ1bmN0aW9uc18xLmlzRW1wdHkpKG9iamVjdCkpcmV0dXJuIG51bGw7bGV0IG9iamVjdFdpdGhvdXRFbXB0eVZhbHVlcz1udWxsO2ZvcihsZXQgcHJvcGVydHkgaW4gb2JqZWN0KXtjb25zdCB2YWx1ZT1vYmplY3RbcHJvcGVydHldOygwLHV0aWxpdHlGdW5jdGlvbnNfMS5pc0VtcHR5KSh2YWx1ZSl8fChvYmplY3RXaXRob3V0RW1wdHlWYWx1ZXM/b2JqZWN0V2l0aG91dEVtcHR5VmFsdWVzW3Byb3BlcnR5XT12YWx1ZTpvYmplY3RXaXRob3V0RW1wdHlWYWx1ZXM9e1twcm9wZXJ0eV06dmFsdWV9KX1yZXR1cm4gb2JqZWN0V2l0aG91dEVtcHR5VmFsdWVzfWV4cG9ydHMucmVtb3ZlRW1wdHlWYWx1ZXM9cmVtb3ZlRW1wdHlWYWx1ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9faW1wb3J0RGVmYXVsdD10aGlzJiZ0aGlzLl9faW1wb3J0RGVmYXVsdHx8ZnVuY3Rpb24obW9kKXtyZXR1cm4gbW9kJiZtb2QuX19lc01vZHVsZT9tb2Q6e2RlZmF1bHQ6bW9kfX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZXhwb3J0cy50b0Nsb25lRGVlcD1leHBvcnRzLnRvQ2xvbmU9ZXhwb3J0cy50b0Zvcm1FbnRyaWVzPWV4cG9ydHMudG9GaWVsZHM9ZXhwb3J0cy50b0FycmF5aXNoPWV4cG9ydHMudGltZW91dD1leHBvcnRzLnRlbXBvcmFyaWx5U2hyaW5rPWV4cG9ydHMuc3RyaW5naWZ5PWV4cG9ydHMuc2VyaWFsaXplPWV4cG9ydHMucnVuQ2FsbGJhY2s9ZXhwb3J0cy5yZW1vdmVGaWxlRXh0ZW5zaW9uPWV4cG9ydHMucmVtb3ZlRWxlbWVudD1leHBvcnRzLnJlZHVjZU9iamVjdD1leHBvcnRzLnJlZHVjZUFycmF5PWV4cG9ydHMucmVkdWNlPWV4cG9ydHMucXVvdGVWYWx1ZXM9ZXhwb3J0cy5wcmVzc0VudGVyPWV4cG9ydHMub3V0VmFsdWU9ZXhwb3J0cy5vdXRQcm9wZXJ0eT1leHBvcnRzLm91dEluZGV4PWV4cG9ydHMubm9IYW5kbGVyPWV4cG9ydHMubWF0Y2hWYWx1ZT1leHBvcnRzLm1hdGNoQWxsUHJvcGVydGllcz1leHBvcnRzLm1hdGNoUHJvcGVydHk9ZXhwb3J0cy5tYXRjaEluZGV4PWV4cG9ydHMubWF0Y2hJc0VxdWFsPWV4cG9ydHMubWFwUHJvcGVydGllcz1leHBvcnRzLm1hcD1leHBvcnRzLmlzVVJMPWV4cG9ydHMuaXNPYmplY3RFbXB0eT1leHBvcnRzLmlzQXJyYXlFbXB0eT1leHBvcnRzLmlzRW1wdHk9ZXhwb3J0cy5pc0NoYXI9ZXhwb3J0cy5pc0hUTUxmaWxlPWV4cG9ydHMuaXNET01vYmplY3RSZWFkeT1leHBvcnRzLmlzVW5pcXVlVmFsdWU9ZXhwb3J0cy5oYXNoPWV4cG9ydHMuZ2V0T2JqZWN0UHJvcGVydGllcz1leHBvcnRzLmdldFVuaXF1ZVZhbHVlcz1leHBvcnRzLmdldE11bHRpQXJyYXlWYWx1ZT1leHBvcnRzLmdldEZvcm1FbnRyaWVzPWV4cG9ydHMuZ2V0Q29tbWFuZExpbmVQYXJhbWV0ZXJzPWV4cG9ydHMuZ2VuZXJhdGVLZXk9ZXhwb3J0cy5mbG9vck9mPWV4cG9ydHMuZmlsdGVyU29ydD1leHBvcnRzLmZpbmQ9ZXhwb3J0cy5jb252ZXJ0VG9UZXh0RG9jdW1lbnQ9ZXhwb3J0cy5jb252ZXJ0VG9IdG1sRG9jdW1lbnQ9ZXhwb3J0cy5jb21iaW5lPWV4cG9ydHMuY29weVZhbHVlc09mPXZvaWQgMDtjb25zdCBsb2Rhc2hfMT1yZXF1aXJlKFwibG9kYXNoXCIpLGNyeXB0b19qc18xPV9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiY3J5cHRvLWpzXCIpKTtmdW5jdGlvbiBjb3B5VmFsdWVzT2Yoc291cmNlLGNvcHkpe2xldCBwcm9wZXJ0eSx2YWx1ZTtmb3IocHJvcGVydHkgaW4gc291cmNlKXRyeXt2YWx1ZT1zb3VyY2VbcHJvcGVydHldLGNvcHlbcHJvcGVydHldPXZhbHVlfWNhdGNoKGNvdWxkbnRDb3B5VmFsdWUpe2NvbnNvbGUubG9nKGBDb3VsZG4ndCBjb3B5ICR7cHJvcGVydHl9OiR7dmFsdWV9YCl9fWZ1bmN0aW9uIGNvbWJpbmUodmFsdWUxLHZhbHVlMil7aWYodHlwZW9mIHZhbHVlMSE9dHlwZW9mIHZhbHVlMil0aHJvdyBFcnJvcihcIkNhbm5vdCBjb21iaW5lIGRpZmZlcmVudCB0eXBlc1wiKTtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdmFsdWUxP2Ake3ZhbHVlMX0gJHt2YWx1ZTJ9YDp2YWx1ZTEgaW5zdGFuY2VvZiBBcnJheT9bLi4udmFsdWUxLC4uLnZhbHVlMl06XCJvYmplY3RcIj09dHlwZW9mIHZhbHVlMT9PYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sdmFsdWUxKSx2YWx1ZTIpOnZvaWQgMH1mdW5jdGlvbiByZW1vdmVFbGVtZW50KGVsZW1lbnQsX2luZGV4LF9hcnJheSl7ZWxlbWVudC5yZW1vdmUoKX1hc3luYyBmdW5jdGlvbiBjb252ZXJ0VG9IdG1sRG9jdW1lbnQoZmlsZVN0cmluZyl7bGV0IGh0bWxDb250ZW50PWF3YWl0IGNvbnZlcnRUb1RleHREb2N1bWVudChmaWxlU3RyaW5nKSxodG1sRG9jdW1lbnQ9KG5ldyBET01QYXJzZXIpLnBhcnNlRnJvbVN0cmluZyhodG1sQ29udGVudCxcInRleHQvaHRtbFwiKTtyZXR1cm4gaXNIVE1MZmlsZShmaWxlU3RyaW5nKT9Qcm9taXNlLnJlc29sdmUoaHRtbERvY3VtZW50KTpQcm9taXNlLnJlamVjdChodG1sRG9jdW1lbnQpfWFzeW5jIGZ1bmN0aW9uIGNvbnZlcnRUb1RleHREb2N1bWVudChmaWxlU3RyaW5nKXtsZXQgZmlsZUNvbnRlbnQ9YXdhaXQgZmV0Y2goZmlsZVN0cmluZyksdGV4dENvbnRlbnQ7cmV0dXJuIGF3YWl0IGZpbGVDb250ZW50LnRleHQoKX1mdW5jdGlvbiBmaWx0ZXJTb3J0KGFycmF5LGlzTWF0Y2gpe2NvbnN0IG1hdGNoPXVuZGVmaW5lZCxub3RNYXRjaD11bmRlZmluZWQ7cmV0dXJuIHJlZHVjZShhcnJheSx0b0ZpbHRlclNvcnQsW1tdLFtdXSk7ZnVuY3Rpb24gdG9GaWx0ZXJTb3J0KGZpbHRlcmVkPVtbXSxbXV0sdmFsdWUsX2luZGV4LF9hcnJheSl7Y29uc3QgbWF0Y2g9ZmlsdGVyZWRbMF0sbm90TWF0Y2g9ZmlsdGVyZWRbMV07cmV0dXJuIGlzTWF0Y2godmFsdWUpP21hdGNoLnB1c2godmFsdWUpOm5vdE1hdGNoLnB1c2godmFsdWUpLGZpbHRlcmVkfX1mdW5jdGlvbiBmaW5kKGNvbGxlY3Rpb24sY2FsbGJhY2ssc3RhcnRpbmdJbmRleD0wKXtpZigwIT09c3RhcnRpbmdJbmRleCl0aHJvdyBuZXcgRXJyb3IoXCJmaW5kKCkgc3RhcnRpbmdJbmRleCBub3QgeWV0IGltcGxlbWVudGVkXCIpO2NvbGxlY3Rpb24gaW5zdGFuY2VvZiBBcnJheXx8KGNvbGxlY3Rpb249W2NvbGxlY3Rpb25dKSxjb2xsZWN0aW9uLmZpbmQoY2FsbGJhY2spfWZ1bmN0aW9uIGZsb29yT2YobnVtYmVyLGRlY2ltYWxQbGFjZXMpe2NvbnN0IHNoaWZ0ZWQ9bnVtYmVyKmRlY2ltYWxQbGFjZXMqMTAsdHJ1bmNhdGVkPXVuZGVmaW5lZCx1bnNoaWZ0ZWQ9dW5kZWZpbmVkO3JldHVybiBNYXRoLnRydW5jKHNoaWZ0ZWQpLygxMCpkZWNpbWFsUGxhY2VzKX1leHBvcnRzLmNvcHlWYWx1ZXNPZj1jb3B5VmFsdWVzT2YsZXhwb3J0cy5jb21iaW5lPWNvbWJpbmUsZXhwb3J0cy5yZW1vdmVFbGVtZW50PXJlbW92ZUVsZW1lbnQsZXhwb3J0cy5jb252ZXJ0VG9IdG1sRG9jdW1lbnQ9Y29udmVydFRvSHRtbERvY3VtZW50LGV4cG9ydHMuY29udmVydFRvVGV4dERvY3VtZW50PWNvbnZlcnRUb1RleHREb2N1bWVudCxleHBvcnRzLmZpbHRlclNvcnQ9ZmlsdGVyU29ydCxleHBvcnRzLmZpbmQ9ZmluZCxleHBvcnRzLmZsb29yT2Y9Zmxvb3JPZjtsZXQgbnVtYmVyT2ZLZXlzR2VuZXJhdGVkPTA7ZnVuY3Rpb24gZ2VuZXJhdGVLZXkoKXtyZXR1cm4obmV3IERhdGUpLmdldFRpbWUoKStcIi1cIitudW1iZXJPZktleXNHZW5lcmF0ZWQrK31mdW5jdGlvbiBnZXRDb21tYW5kTGluZVBhcmFtZXRlcnMoKXtjb25zdCBjb21tYW5kTGluZT11bmRlZmluZWQscGFyYW1ldGVycz11bmRlZmluZWQ7cmV0dXJuIHByb2Nlc3MuYXJndi5zbGljZSgyKX1mdW5jdGlvbiBnZXRGb3JtRW50cmllcyhmb3JtRWxlbWVudCl7Y29uc3QgZmllbGRzPXVuZGVmaW5lZDtsZXQgZW50cmllcztyZXR1cm4gcmVkdWNlKGZvcm1FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbbmFtZV1cIiksdG9Gb3JtRW50cmllcyl9ZnVuY3Rpb24gZ2V0TXVsdGlBcnJheVZhbHVlKGluZGV4QXJyYXksYXJyYXkpe2lmKGlzRW1wdHkoaW5kZXhBcnJheSkpe2NvbnN0IHZhbHVlPXVuZGVmaW5lZDtyZXR1cm4gYXJyYXl9Y29uc3QgaW5kZXg9aW5kZXhBcnJheS5zaGlmdCgpO3JldHVybiBnZXRNdWx0aUFycmF5VmFsdWUoaW5kZXhBcnJheSxhcnJheVtpbmRleF0pfWZ1bmN0aW9uIGdldFVuaXF1ZVZhbHVlcyhhcnJheSl7Y29uc3QgYXJyYXlXaXRoVW5pcXVlVmFsdWVzPXVuZGVmaW5lZDtyZXR1cm4gYXJyYXkuZmlsdGVyKGlzVW5pcXVlVmFsdWUpfWZ1bmN0aW9uIGdldE9iamVjdFByb3BlcnRpZXMob2JqZWN0KXtsZXQgcHJvcGVydHk7Y29uc3QgcHJvcGVydGllcz1bXTtmb3IocHJvcGVydHkgaW4gb2JqZWN0KXByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSk7cmV0dXJuIHByb3BlcnRpZXN9ZnVuY3Rpb24gaGFzaChzdHJpbmcpe3RyeXtpZighc3RyaW5nKXJldHVybjtjb25zdCBoYXNoT2JqZWN0PWNyeXB0b19qc18xLmRlZmF1bHQuU0hBMjU2KHN0cmluZyksaGFzaENvZGU9dW5kZWZpbmVkO3JldHVybiBoYXNoT2JqZWN0LnRvU3RyaW5nKGNyeXB0b19qc18xLmRlZmF1bHQuZW5jLkhleCl9Y2F0Y2goZXJyb3Ipe3JldHVybn19ZnVuY3Rpb24gaXNDaGFyKHN0cmluZyl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIHN0cmluZyYmMT09PXN0cmluZy5sZW5ndGh9ZnVuY3Rpb24gaXNVbmlxdWVWYWx1ZSh2YWx1ZSxpbmRleCxhcnJheSl7cmV0dXJuIGFycmF5LmluZGV4T2YodmFsdWUpPT09aW5kZXh9ZnVuY3Rpb24gaXNET01vYmplY3RSZWFkeShET01vYmplY3Qpe2lmKFwibG9hZGluZ1wiIT09RE9Nb2JqZWN0LnJlYWR5U3RhdGUpcmV0dXJuIERPTW9iamVjdC5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVhZHlzdGF0ZWNoYW5nZVwiLF9saXN0ZW5lciksUHJvbWlzZS5yZXNvbHZlKGAke0RPTW9iamVjdH0gaXMgcmVhZHlgKTtmdW5jdGlvbiBfbGlzdGVuZXIoZXZlbnQpe2lzRE9Nb2JqZWN0UmVhZHkoZXZlbnQudGFyZ2V0KX1ET01vYmplY3QuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIixfbGlzdGVuZXIpfWZ1bmN0aW9uIGlzSFRNTGZpbGUoZmlsZW5hbWVTdHJpbmcpe2xldCBodG1sUmVnZXg7cmV0dXJuL1xcLmh0bWwkLy50ZXN0KGZpbGVuYW1lU3RyaW5nKX1mdW5jdGlvbiBpc0VtcHR5KG9iamVjdCl7cmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIEFycmF5P2lzQXJyYXlFbXB0eShvYmplY3QpOm9iamVjdCBpbnN0YW5jZW9mIE9iamVjdD9pc09iamVjdEVtcHR5KG9iamVjdCk6bnVsbD09b2JqZWN0fHxcIlwiPT09b2JqZWN0fWZ1bmN0aW9uIGlzQXJyYXlFbXB0eShhcnJheSl7aWYoIWFycmF5KXJldHVybiBhcnJheTtjb25zdCBudW1iZXJPZlZhbHVlcz11bmRlZmluZWQ7cmV0dXJuIDA9PT1hcnJheS5sZW5ndGh9ZnVuY3Rpb24gaXNPYmplY3RFbXB0eShvYmplY3Qpe2NvbnN0IG51bWJlck9mVmFsdWVzPXVuZGVmaW5lZDtyZXR1cm4gMD09PU9iamVjdC5rZXlzKG9iamVjdCkubGVuZ3RofWZ1bmN0aW9uIGlzVVJMKHVybFN0cmluZyl7bGV0IHVybFJlZ2V4O3JldHVybi9eaHR0cChzKTpcXC9cXC8vaS50ZXN0KHVybFN0cmluZyl9ZnVuY3Rpb24gbWFwKGNvbGxlY3Rpb24sY2FsbGJhY2spe3JldHVybiBjb2xsZWN0aW9uIGluc3RhbmNlb2YgQXJyYXl8fChjb2xsZWN0aW9uPVtjb2xsZWN0aW9uXSksY29sbGVjdGlvbi5tYXAoY2FsbGJhY2spfWZ1bmN0aW9uIG1hcFByb3BlcnRpZXMob2JqZWN0LGNhbGxiYWNrKXtpZighb2JqZWN0KXJldHVybltdO2NvbnN0IHByb3BlcnRpZXM9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtpZighcHJvcGVydGllcylyZXR1cm5bXTtjb25zdCByZXN1bHRzPVtdO3JldHVybiBwcm9wZXJ0aWVzLmZvckVhY2goKHByb3BlcnR5PT57Y29uc3QgcmVzdWx0PWNhbGxiYWNrKG9iamVjdFtwcm9wZXJ0eV0scHJvcGVydHksb2JqZWN0KTtyZXN1bHRzLnB1c2gocmVzdWx0KX0pKSxyZXN1bHRzfWZ1bmN0aW9uIG1hdGNoSXNFcXVhbCh2YWx1ZSl7cmV0dXJuIGZ1bmN0aW9uKHZhbHVlMixfaW5kZXgsX2FycmF5KXtyZXR1cm4oMCxsb2Rhc2hfMS5pc0VxdWFsKSh2YWx1ZSx2YWx1ZTIpfX1mdW5jdGlvbiBtYXRjaEluZGV4KGluZGV4VG9NYXRjaCl7cmV0dXJuIGZ1bmN0aW9uKF92YWx1ZSxpbmRleCxfYXJyYXkpe3JldHVybiBpbmRleD09PWluZGV4VG9NYXRjaH19ZnVuY3Rpb24gbWF0Y2hQcm9wZXJ0eShwcm9wZXJ0eSx2YWx1ZVRvTWF0Y2gpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBwcm9wZXJ0eSYmKHByb3BlcnR5PVtwcm9wZXJ0eV0pLGZ1bmN0aW9uKG9iamVjdCxfaW5kZXgsX2FycmF5KXtsZXQgdmFsdWU9b2JqZWN0O3RyeXtmb3IobGV0IHN0cmluZ0luZGV4IG9mIHByb3BlcnR5KXZhbHVlPXZhbHVlW3N0cmluZ0luZGV4XTtyZXR1cm4gdmFsdWU9PT12YWx1ZVRvTWF0Y2h9Y2F0Y2goaW52YWxpZFByb3BlcnR5KXtyZXR1cm4hMX19fWZ1bmN0aW9uIG1hdGNoQWxsUHJvcGVydGllcyhwcm9wZXJ0aWVzQW5kVmFsdWVzKXtyZXR1cm4gZnVuY3Rpb24ob2JqZWN0LF9pbmRleCxfYXJyYXkpe2xldCBpc01hdGNoaW5nPSEwO2ZvcihsZXQgcHJvcGVydHkgaW4gcHJvcGVydGllc0FuZFZhbHVlcyl7Y29uc3QgdmFsdWU9cHJvcGVydGllc0FuZFZhbHVlc1twcm9wZXJ0eV07aWYoaXNNYXRjaGluZz1pc01hdGNoaW5nJiZvYmplY3RbcHJvcGVydHldPT09dmFsdWUsIWlzTWF0Y2hpbmcpcmV0dXJuITF9cmV0dXJuITB9fWZ1bmN0aW9uIG1hdGNoVmFsdWUodmFsdWVUb01hdGNoKXtyZXR1cm4gZnVuY3Rpb24odmFsdWUsX2luZGV4LF9hcnJheSl7cmV0dXJuIHZhbHVlPT09dmFsdWVUb01hdGNofX1mdW5jdGlvbiBub0hhbmRsZXIoKXt9ZnVuY3Rpb24gb3V0SW5kZXgoaW5kZXhUb1JlbW92ZSl7cmV0dXJuIGZ1bmN0aW9uKF92YWx1ZSxpbmRleCxfYXJyYXkpe3JldHVybiBpbmRleCE9PWluZGV4VG9SZW1vdmV9fWZ1bmN0aW9uIG91dFByb3BlcnR5KHByb3BlcnR5LHZhbHVlVG9NYXRjaCl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIHByb3BlcnR5JiYocHJvcGVydHk9W3Byb3BlcnR5XSksZnVuY3Rpb24ob2JqZWN0LF9pbmRleCxfYXJyYXkpe2xldCB2YWx1ZT1vYmplY3Q7Zm9yKGxldCBzdHJpbmdJbmRleCBvZiBwcm9wZXJ0eSl2YWx1ZT12YWx1ZVtzdHJpbmdJbmRleF07cmV0dXJuIHZhbHVlIT09dmFsdWVUb01hdGNofX1mdW5jdGlvbiBvdXRWYWx1ZSh2YWx1ZVRvUmVtb3ZlKXtyZXR1cm4gZnVuY3Rpb24odmFsdWUsX2luZGV4LF9hcnJheSl7cmV0dXJuIHZhbHVlIT09dmFsdWVUb1JlbW92ZX19ZnVuY3Rpb24gcHJlc3NFbnRlcigpe3JldHVybiBuZXcgUHJvbWlzZShfcHJlc3NFbnRlcik7ZnVuY3Rpb24gX3ByZXNzRW50ZXIocmVzb2x2ZSxfcmVqZWN0KXtwcm9jZXNzLnN0ZGluLnJlc3VtZSgpLHByb2Nlc3Muc3RkaW4ub25jZShcImRhdGFcIiwoKCk9Pihwcm9jZXNzLnN0ZGluLnBhdXNlKCkscmVzb2x2ZSgpKSkpfX1mdW5jdGlvbiBxdW90ZVZhbHVlcyhhcnJheSl7aWYoIWFycmF5KXJldHVybiBhcnJheTtjb25zdCBxdW90ZWRBcnJheT11bmRlZmluZWQ7cmV0dXJuIGFycmF5Lm1hcCgodmFsdWU9PmBcIiR7dmFsdWV9XCJgKSl9ZnVuY3Rpb24gc2VyaWFsaXplKG9iamVjdCl7Y29uc3Qgc2VyaWFsaXplZD17fTtmb3IobGV0IHByb3BlcnR5IGluIG9iamVjdCl7Y29uc3QgdmFsdWU9b2JqZWN0W3Byb3BlcnR5XTtzZXJpYWxpemVkW3Byb3BlcnR5XT12YWx1ZX1yZXR1cm4gc2VyaWFsaXplZH1mdW5jdGlvbiBzdHJpbmdpZnkob2JqZWN0KXtjb25zdCByZXBsYWNlcj12b2lkIDAsc3BhY2VyPVwiIFwiLHN0cmluZz11bmRlZmluZWQ7cmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iamVjdCx1bmRlZmluZWQsXCIgXCIpfWZ1bmN0aW9uIHRlbXBvcmFyaWx5U2hyaW5rKGh0bWxFbGVtZW50KXtsZXQgY29udGFpbmVyPWh0bWxFbGVtZW50LnBhcmVudEVsZW1lbnQse29mZnNldEhlaWdodDpjb250YWluZXJIZWlnaHQsb2Zmc2V0V2lkdGg6Y29udGFpbmVyV2lkdGh9PWNvbnRhaW5lcnx8e307Y29uc3Qgb3JpZ2luYWxDb250YWluZXJTaXplPWZvcmNlU3R5bGVTaXplKGNvbnRhaW5lcixjb250YWluZXJIZWlnaHQsY29udGFpbmVyV2lkdGgpLGN1cnJlbnRIZWlnaHQ9aHRtbEVsZW1lbnQub2Zmc2V0SGVpZ2h0LGN1cnJlbnRXaWR0aD1odG1sRWxlbWVudC5vZmZzZXRXaWR0aCxzaHJpbmtQZXJjZW50PS4wNSx0ZW1wSGVpZ2h0PXVuZGVmaW5lZCx0ZW1wV2lkdGg9dW5kZWZpbmVkLG9yaWdpbmFsRWxlbWVudFNpemU9Zm9yY2VTdHlsZVNpemUoaHRtbEVsZW1lbnQsY3VycmVudEhlaWdodC0uMDUqY3VycmVudEhlaWdodCxjdXJyZW50V2lkdGgtLjA1KmN1cnJlbnRXaWR0aCksZGVsYXk9MTAwO2Z1bmN0aW9uIHJlc3RvcmVTaXplcygpe2NvbnN0IG9yaWdpbmFsSGVpZ2h0PW9yaWdpbmFsRWxlbWVudFNpemUub2Zmc2V0SGVpZ2h0LG9yaWdpbmFsV2lkdGg9b3JpZ2luYWxFbGVtZW50U2l6ZS5vZmZzZXRXaWR0aDtmb3JjZVN0eWxlU2l6ZShodG1sRWxlbWVudCxvcmlnaW5hbEhlaWdodCxvcmlnaW5hbFdpZHRoKSxyZXN0b3JlU3R5bGVTaXplKGh0bWxFbGVtZW50LG9yaWdpbmFsRWxlbWVudFNpemUpLHJlc3RvcmVTdHlsZVNpemUoY29udGFpbmVyLG9yaWdpbmFsQ29udGFpbmVyU2l6ZSl9c2V0VGltZW91dChyZXN0b3JlU2l6ZXMsMTAwKX1mdW5jdGlvbiByZWR1Y2UoY29sbGVjdGlvbixjYWxsYmFjayxpbml0aWFsVmFsdWUpe3JldHVybiBjb2xsZWN0aW9uP2NvbGxlY3Rpb24gaW5zdGFuY2VvZiBBcnJheT9yZWR1Y2VBcnJheShjb2xsZWN0aW9uLGNhbGxiYWNrLGluaXRpYWxWYWx1ZSk6cmVkdWNlT2JqZWN0KGNvbGxlY3Rpb24sY2FsbGJhY2ssaW5pdGlhbFZhbHVlKTppbml0aWFsVmFsdWV9ZnVuY3Rpb24gcmVkdWNlQXJyYXkoYXJyYXksY2FsbGJhY2ssaW5pdGlhbFZhbHVlKXtpZighKGFycmF5IGluc3RhbmNlb2YgQXJyYXkpKXRocm93IG5ldyBFcnJvcihcIkFuIGFycmF5IHdhcyBub3QgcGFzc2VkIHRvIHJlZHVjZUFycmF5KClcIik7bGV0IHJlZHVjZWRWYWx1ZT1pbml0aWFsVmFsdWU7cmV0dXJuIGFycmF5LmZvckVhY2goKGZ1bmN0aW9uKGN1cnJlbnRWYWx1ZSxpbmRleCxhcnJheUNvcHkpe3JlZHVjZWRWYWx1ZT1jYWxsYmFjayhyZWR1Y2VkVmFsdWUsY3VycmVudFZhbHVlLGluZGV4LGFycmF5Q29weSl9KSksMD09PWFycmF5Lmxlbmd0aCYmKHJlZHVjZWRWYWx1ZT1jYWxsYmFjayhyZWR1Y2VkVmFsdWUpKSxyZWR1Y2VkVmFsdWV9ZnVuY3Rpb24gcmVkdWNlT2JqZWN0KG9iamVjdCxjYWxsYmFjayxpbml0aWFsVmFsdWUpe2lmKG9iamVjdCBpbnN0YW5jZW9mIEFycmF5fHxcInN0cmluZ1wiPT10eXBlb2Ygb2JqZWN0fHxcIm51bWJlclwiPT10eXBlb2Ygb2JqZWN0KXRocm93IG5ldyBFcnJvcihcIkFuIG9iamVjdCB3YXMgbm90IHBhc3NlZCB0byByZWR1Y2VPYmplY3QoKVwiKTtsZXQgcmVkdWNlZFZhbHVlPWluaXRpYWxWYWx1ZTtmb3IobGV0IHByb3BlcnR5IGluIG9iamVjdCl7Y29uc3QgdmFsdWU9dW5kZWZpbmVkO3JlZHVjZWRWYWx1ZT1jYWxsYmFjayhyZWR1Y2VkVmFsdWUsb2JqZWN0W3Byb3BlcnR5XSxwcm9wZXJ0eSxvYmplY3QpfXJldHVybiBpc0VtcHR5KG9iamVjdCkmJihyZWR1Y2VkVmFsdWU9Y2FsbGJhY2socmVkdWNlZFZhbHVlKSkscmVkdWNlZFZhbHVlfWZ1bmN0aW9uIHJlbW92ZUZpbGVFeHRlbnNpb24oZmlsZW5hbWUpe2NvbnN0IHNwbGl0RmlsZW5hbWU9ZmlsZW5hbWUuc3BsaXQoXCIuXCIpO3NwbGl0RmlsZW5hbWUubGVuZ3RoPjImJnNwbGl0RmlsZW5hbWUucG9wKCk7Y29uc3QgZXh0ZW5zaW9uUmVtb3ZlZD11bmRlZmluZWQ7cmV0dXJuIHNwbGl0RmlsZW5hbWUuam9pbihcIi5cIil9ZnVuY3Rpb24gcmVzdG9yZVN0eWxlU2l6ZShodG1sRWxlbWVudCxvcmlnaW5hbFNpemVPYmplY3Qpe2NvbnN0IG9yaWdpbmFsPW9yaWdpbmFsU2l6ZU9iamVjdDtodG1sRWxlbWVudC5zdHlsZS5oZWlnaHQ9b3JpZ2luYWwuc3R5bGUuaGVpZ2h0LGh0bWxFbGVtZW50LnN0eWxlLndpZHRoPW9yaWdpbmFsLnN0eWxlLndpZHRofWZ1bmN0aW9uIHJ1bkNhbGxiYWNrKGNhbGxiYWNrLF9pbmRleCxfYXJyYXkpe2NhbGxiYWNrKCl9ZnVuY3Rpb24gZm9yY2VTdHlsZVNpemUoaHRtbEVsZW1lbnQsaGVpZ2h0LHdpZHRoKXtjb25zdCBvcmlnaW5hbFNpemU9e3N0eWxlOntoZWlnaHQ6aHRtbEVsZW1lbnQuc3R5bGUuaGVpZ2h0LHdpZHRoOmh0bWxFbGVtZW50LnN0eWxlLndpZHRofSxvZmZzZXRIZWlnaHQ6aHRtbEVsZW1lbnQub2Zmc2V0SGVpZ2h0LG9mZnNldFdpZHRoOmh0bWxFbGVtZW50Lm9mZnNldFdpZHRofTtyZXR1cm4gaHRtbEVsZW1lbnQuc3R5bGUuaGVpZ2h0PWAke2hlaWdodH1weGAsaHRtbEVsZW1lbnQuc3R5bGUud2lkdGg9YCR7d2lkdGh9cHhgLG9yaWdpbmFsU2l6ZX1mdW5jdGlvbiB0aW1lb3V0KG1pbGxpc2Vjb25kcyl7cmV0dXJuIG5ldyBQcm9taXNlKChmdW5jdGlvbihyZXNvbHZlUHJvbWlzZSl7c2V0VGltZW91dCgoKCk9PnJlc29sdmVQcm9taXNlKFwiVGltZW91dCBjb21wbGV0ZVwiKSksbWlsbGlzZWNvbmRzKX0pKX1mdW5jdGlvbiB0b0FycmF5aXNoKGFycmF5aXNoPXt9LHZhbHVlLGluZGV4LF9hcnJheSl7cmV0dXJuIGFycmF5aXNoW2luZGV4XT12YWx1ZSxhcnJheWlzaH1mdW5jdGlvbiB0b0ZpZWxkcyhmaWVsZExpc3Qsb2JqZWN0LGluZGV4LF9hcnJheSl7ZmllbGRMaXN0IGluc3RhbmNlb2YgQXJyYXl8fChmaWVsZExpc3Q9W10pO2NvbnN0IGZpZWxkcz1PYmplY3Qua2V5cyhvYmplY3QpLG5ld0ZpZWxkcz0oMCxsb2Rhc2hfMS5kaWZmZXJlbmNlKShmaWVsZHMsZmllbGRMaXN0KTtyZXR1cm4gZmllbGRMaXN0PWZpZWxkTGlzdC5jb25jYXQobmV3RmllbGRzKX1mdW5jdGlvbiB0b0Zvcm1FbnRyaWVzKGVudHJpZXM9e30sZWxlbWVudCxpbmRleCxfYXJyYXkpe2NvbnN0IG5hbWU9ZWxlbWVudC5uYW1lLHZhbHVlPWVsZW1lbnQudmFsdWU7cmV0dXJuIG5hbWUmJihlbnRyaWVzW25hbWVdPXZhbHVlKSxlbnRyaWVzfWZ1bmN0aW9uIHRvQ2xvbmUodmFsdWUsX2luZGV4LF9hcnJheSl7cmV0dXJuIHZhbHVlfWZ1bmN0aW9uIHRvQ2xvbmVEZWVwKHZhbHVlLF9pbmRleCxfYXJyYXkpe3JldHVybigwLGxvZGFzaF8xLmNsb25lRGVlcCkodmFsdWUpfWV4cG9ydHMuZ2VuZXJhdGVLZXk9Z2VuZXJhdGVLZXksZXhwb3J0cy5nZXRDb21tYW5kTGluZVBhcmFtZXRlcnM9Z2V0Q29tbWFuZExpbmVQYXJhbWV0ZXJzLGV4cG9ydHMuZ2V0Rm9ybUVudHJpZXM9Z2V0Rm9ybUVudHJpZXMsZXhwb3J0cy5nZXRNdWx0aUFycmF5VmFsdWU9Z2V0TXVsdGlBcnJheVZhbHVlLGV4cG9ydHMuZ2V0VW5pcXVlVmFsdWVzPWdldFVuaXF1ZVZhbHVlcyxleHBvcnRzLmdldE9iamVjdFByb3BlcnRpZXM9Z2V0T2JqZWN0UHJvcGVydGllcyxleHBvcnRzLmhhc2g9aGFzaCxleHBvcnRzLmlzQ2hhcj1pc0NoYXIsZXhwb3J0cy5pc1VuaXF1ZVZhbHVlPWlzVW5pcXVlVmFsdWUsZXhwb3J0cy5pc0RPTW9iamVjdFJlYWR5PWlzRE9Nb2JqZWN0UmVhZHksZXhwb3J0cy5pc0hUTUxmaWxlPWlzSFRNTGZpbGUsZXhwb3J0cy5pc0VtcHR5PWlzRW1wdHksZXhwb3J0cy5pc0FycmF5RW1wdHk9aXNBcnJheUVtcHR5LGV4cG9ydHMuaXNPYmplY3RFbXB0eT1pc09iamVjdEVtcHR5LGV4cG9ydHMuaXNVUkw9aXNVUkwsZXhwb3J0cy5tYXA9bWFwLGV4cG9ydHMubWFwUHJvcGVydGllcz1tYXBQcm9wZXJ0aWVzLGV4cG9ydHMubWF0Y2hJc0VxdWFsPW1hdGNoSXNFcXVhbCxleHBvcnRzLm1hdGNoSW5kZXg9bWF0Y2hJbmRleCxleHBvcnRzLm1hdGNoUHJvcGVydHk9bWF0Y2hQcm9wZXJ0eSxleHBvcnRzLm1hdGNoQWxsUHJvcGVydGllcz1tYXRjaEFsbFByb3BlcnRpZXMsZXhwb3J0cy5tYXRjaFZhbHVlPW1hdGNoVmFsdWUsZXhwb3J0cy5ub0hhbmRsZXI9bm9IYW5kbGVyLGV4cG9ydHMub3V0SW5kZXg9b3V0SW5kZXgsZXhwb3J0cy5vdXRQcm9wZXJ0eT1vdXRQcm9wZXJ0eSxleHBvcnRzLm91dFZhbHVlPW91dFZhbHVlLGV4cG9ydHMucHJlc3NFbnRlcj1wcmVzc0VudGVyLGV4cG9ydHMucXVvdGVWYWx1ZXM9cXVvdGVWYWx1ZXMsZXhwb3J0cy5zZXJpYWxpemU9c2VyaWFsaXplLGV4cG9ydHMuc3RyaW5naWZ5PXN0cmluZ2lmeSxleHBvcnRzLnRlbXBvcmFyaWx5U2hyaW5rPXRlbXBvcmFyaWx5U2hyaW5rLGV4cG9ydHMucmVkdWNlPXJlZHVjZSxleHBvcnRzLnJlZHVjZUFycmF5PXJlZHVjZUFycmF5LGV4cG9ydHMucmVkdWNlT2JqZWN0PXJlZHVjZU9iamVjdCxleHBvcnRzLnJlbW92ZUZpbGVFeHRlbnNpb249cmVtb3ZlRmlsZUV4dGVuc2lvbixleHBvcnRzLnJ1bkNhbGxiYWNrPXJ1bkNhbGxiYWNrLGV4cG9ydHMudGltZW91dD10aW1lb3V0LGV4cG9ydHMudG9BcnJheWlzaD10b0FycmF5aXNoLGV4cG9ydHMudG9GaWVsZHM9dG9GaWVsZHMsZXhwb3J0cy50b0Zvcm1FbnRyaWVzPXRvRm9ybUVudHJpZXMsZXhwb3J0cy50b0Nsb25lPXRvQ2xvbmUsZXhwb3J0cy50b0Nsb25lRGVlcD10b0Nsb25lRGVlcDsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAc2VuZGdyaWQvbWFpbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiZXR0ZXItc3FsaXRlM1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0by1qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJrbmV4XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb25nb2RiXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm15c3FsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZmxlY3QtbWV0YWRhdGFcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2J1aWxkL3NyYy9pbmRleC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJfX2ltcG9ydERlZmF1bHQiLCJtb2QiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiZ2V0QWNjb3VudEJ5SWQiLCJnZXRBY2NvdW50QnlUb2tlbiIsImRlbGV0ZUFjY291bnRCeUlkIiwiZGVsZXRlQWNjb3VudEJ5VG9rZW4iLCJkZWxldGVBY2NvdW50QnlQYXNzd29yZCIsImNyZWF0ZUFjY291bnRCeUdvb2dsZSIsImNyZWF0ZUFjY291bnRCeVBhc3N3b3JkIiwiY2FydFV0aWxzXzEiLCJyZXF1aXJlIiwiZGJUb2tlbl8xIiwibG9naW5VdGlsc18xIiwiaHR0cENvZGVzXzEiLCJ1c2VyVXRpbHNfMSIsImVtYWlsIiwicGFzc3dvcmQiLCJ1c2VyUmVzdWx0IiwidW5kZWZpbmVkIiwidXNlciIsImNyZWF0ZVVzZXJCeUVtYWlsIiwiY3JlYXRlTG9naW5CeVBhc3N3b3JkIiwidG9rZW4iLCJnZXROZXciLCJzYXZlIiwibmFtZSIsImdvb2dsZUlkIiwiY3JlYXRlTG9naW5CeUdvb2dsZSIsIl9pZCIsImRlbGV0ZUFjY291bnQiLCJjYXJ0SWQiLCJ1c2VySWQiLCJkZWxldGVDYXJ0QnlJZCIsImRlbGV0ZUxvZ2luQnlFbWFpbCIsImRlbGV0ZVVzZXJCeUlkIiwiZ2V0VXNlckJ5SWQiLCJlcnJvciIsIkVycm9yIiwiY29kZSIsImJhZFJlcXVlc3QiLCJjYXJ0X2lkIiwiZ2V0VXNlckJ5UGFzc3dvcmQiLCJpbmNvcnJlY3RQYXNzd29yZCIsImdldFVzZXJCeVRva2VuIiwiaW5jb3JyZWN0Q3JlZGVudGlhbHMiLCJhY2NvdW50IiwidXNlcklEIiwiY2FydCIsImdldENhcnRCeUlkIiwiYXBpIiwicGluZyIsIl9yZXF1ZXN0IiwicmVzcG9uc2UiLCJmYWtlSWQiLCJzZW5kIiwiYXN5bmNFcnJvciIsIm1lc3NhZ2UiLCJzZXJ2ZXJFcnJvciIsInN0YXR1cyIsIm5vZGVVdGlsc18xIiwidXRpbGl0eUZ1bmN0aW9uc18xIiwibG9naW5fMSIsImF1dGhlbnRpY2F0ZSIsImdvb2dsZSIsInJlc3VsdCIsInVzZXJfaWQiLCJmb3JiaWRkZW5Vc2VyIiwidW5hdXRoZW50aWNhdGVkIiwiZW1haWxIYXNoIiwiaGFzaCIsInBhc3N3b3JkSGFzaCIsImdldE9uZSIsImlzRW1wdHkiLCJ1cGRhdGVDYXJ0Iiwic2V0Q2FydCIsInJlbW92ZUl0ZW1Gcm9tQ2FydCIsImdldEl0ZW1zQnlDYXJ0IiwiY3JlYXRlQ2FydCIsImdldENhcnRCeVVzZXIiLCJnZXRDYXJ0QnlUb2tlbiIsImNhcnRfMSIsIml0ZW1fMSIsInZhbGlkYXRlXzEiLCJpZCIsIml0ZW1zIiwiZm9yZWlnbktleSIsImRlbGV0ZU9uZSIsImFkZE9uZSIsImluc2VydGVkSWQiLCJpdGVtX2lkcyIsIiRhbGwiLCJpdGVtIiwicXVlcnkiLCIkcHVsbCIsImNhcnRSZXN1bHQiLCJ1cGRhdGVPbmUiLCJhc3NpZ24iLCJkYlRva2VuIiwiaW52YWxpZGF0ZSIsInJldm9rZSIsImludmFsaWRhdGVHb29nbGUiLCJsb2dpbklkIiwiYWNjZXNzVG9rZW4iLCJyZXZva2VUb2tlbiIsImdlbmVyYXRlS2V5IiwibG9naW5SZXN1bHQiLCJ1cGRhdGVJbmZvIiwicmVzdG9yZURlcGVuZGVuY2llcyIsImluamVjdERlcGVuZGVuY2llcyIsImdldEludmVudG9yeSIsImludmVudG9yeV8xIiwiaXRlbVV0aWxzXzEiLCJpbnZlbnRvcmllcyIsImludmVudG9yeVJlc3VsdCIsImludmVudG9yeSIsIml0ZW1SZXN1bHRzIiwiaXRlbUxpc3QiLCJnZXRJdGVtc0J5SWQiLCJpbnZlbnRvcnlFbmhhbmNlZCIsImludmVudG9yeUNvbnRyb2xsZXIiLCJpdGVtQ29udHJvbGxlciIsImluamVjdERlcGVuZGVuY3kiLCJyZXN0b3JlRGVwZW5kZW5jeSIsImdldFZlcmlmaWVkSXRlbUlkIiwiZ2V0SXRlbUJ5SWQiLCJpZExpc3QiLCIkaW4iLCJnZXRNYW55IiwiYXV0aGVudGljYXRlXzEiLCJlcnJvclV0aWxzXzEiLCJ2ZXJpZnlfMSIsImxvZ2luIiwid2l0aFRva2VuIiwid2l0aFBhc3N3b3JkIiwid2l0aEdvb2dsZSIsInJlcXVlc3QiLCJib2R5IiwibG9naW5BdHRlbXB0cyIsImF1dGhJbmZvIiwiaXNUZW1wb3JhcnkiLCJoYW5kbGVBc3luY0Vycm9yIiwibmV4dCIsImxvZ2luSW5mbyIsImRhdGEiLCJsb2dpbldpdGhUb2tlbiIsImxvZ2luV2l0aFBhc3N3b3JkIiwiZ2V0VXNlcklkQnlQYXNzd29yZCIsInVzZXJfMSIsInNpZ251cEVtYWlsIiwibG9nb3V0IiwibWFpbF8xIiwiZG90ZW52XzEiLCJjb25maWciLCJzZW5kRW1haWwiLCJzaWdudXBDb25maXJtYXRpb24iLCJkZWxldGVDb25maXJtYXRpb24iLCJpc1Rlc3RFbWFpbCIsImZyb20iLCJ0byIsInN1YmplY3QiLCJ0ZXh0IiwiaHRtbCIsInN0YXR1c0NvZGUiLCJjb25zb2xlIiwibG9nIiwic2V0QXBpS2V5IiwicHJvY2VzcyIsImVudiIsInNlbmRHcmlkQXBpS2V5Iiwic2VuZEVtYWlsXzEiLCJhY2NvdW50VXRpbHNfMSIsInNpZ251cCIsImRpc2FibGVFbWFpbHMiLCJfbmV4dCIsImZldGNoSW5mbyIsImRlbGV0ZSIsImRlbCIsImdldENhcnRJZCIsInVzZXJJbmZvIiwicmVzdWx0cyIsImZvcmVpZ25LZXlDb25zdHJhaW50IiwiZXhwcmVzc18xIiwiY29yc18xIiwicm91dGVyXzEiLCJpdGVtX2dyYXBocWxfMSIsImludmVudG9yeV9ncmFwaHFsXzEiLCJpbnZlbnRvcnlVdGlsc18xIiwiaXNEb2NrZXJFbnZpcm9ubWVudF8xIiwic2hvdWxkSW5qZWN0RGVwZW5kZW5jeSIsImFwcCIsImhvc3QiLCJpc0RvY2tlckVudmlyb25tZW50IiwicG9ydCIsIk51bWJlciIsIlBPUlQiLCJiYXNlVXJsIiwiaG9zdEVudmlyb25tZW50IiwiaGFuZGxlTGlzdGVuIiwidXNlIiwib3JpZ2luIiwic3RhdGljIiwianNvbiIsImxpc3RlbiIsIk1JQ1JPU0VSVklDRVMiLCJDT05UUk9MTEVSU18xIiwiQ09OVFJPTExFUlNfMiIsImN1c3RvbWVyIiwiQ09OVFJPTExFUlMiLCJwcm9kdWN0IiwiX19yZXN0IiwicyIsImUiLCJ0IiwicCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImluZGV4T2YiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJpIiwibGVuZ3RoIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJkYXRhYmFzZV8xIiwibG9naW5zIiwibW9uZ29kYiIsImdldENvbGxlY3Rpb24iLCJmaW5kT25lIiwiaW5zZXJ0T25lIiwiJHNldCIsIm1vbmdvZGJfMSIsInVzZXJzIiwiT2JqZWN0SWQiLCJ2YWxpZGF0ZSIsImVycm9yTWVzc2FnZSIsInZlcmlmeSIsImlzU2lnbnVwRW1haWxUYWtlbiIsImxvZ2luQXR0ZW1wdENvdW50IiwidGltZW91dElkcyIsIkxPR0lOX1RJTUVPVVRfRFVSQVRJT04iLCJfYSIsIm51bWJlck9mQXR0ZW1wdHMiLCJyZXNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0Iiwic3FsIiwidHlwZW9ybSIsImtuZXgiLCJEYXRhYmFzZV8xIiwibW9uZ29kYl9jb25maWdfMSIsImRhdGFiYXNlIiwiY29uZmlndXJlTW9uZ29kYiIsImNvbm5lY3Rpb25TdHJpbmciLCJtb25nb2RiQ29ubmVjdGlvblN0cmluZyIsIm1vbmdvZGJEYXRhYmFzZSIsIm1vbmdvZGJDb25maWciLCJtb25nb2RiVXNlciIsIm1vbmdvZGJQYXNzd29yZCIsImNhcnRzIiwiZ3JhcGhxbF8xIiwiSXRlbV8xIiwiX2IiLCJfYyIsImdyYXBocWxRdWVyeSIsInByb2R1Y3RzQXJyYXkiLCJhbWF6b25Qcm9kdWN0Q2F0ZWdvcnkiLCJwcm9kdWN0UmVzdWx0cyIsIm1hcCIsInRvSXRlbSIsInRvSXRlbUlkIiwiYXNpbiIsImRlc2NyaXB0aW9uIiwiZXh0cmFjdEluZm8iLCJ0aXRsZSIsInByaWNlIiwiaW1hZ2UiLCJtYWluSW1hZ2VVcmwiLCJJdGVtIiwiaW5mbyIsIl9vdGhlckluZm8iLCJzcGxpdCIsInByb2R1Y3RSZXN1bHQiLCJhbWF6b25Qcm9kdWN0IiwiaWRzIiwibWF0Y2hpbmdJdGVtcyIsImZpbHRlciIsIm1hdGNoSXRlbUlkcyIsIml0ZW1JZHMiLCJkb2VzTWF0Y2giLCJpbmNsdWRlcyIsImZpbmQiLCJ0b0FycmF5Iiwib2JqZWN0Iiwib2JqZWN0SWQiLCJzdHJpbmciLCJudW1iZXIiLCJncmFwaHFsIiwiY2Fub3B5QXBpS2V5IiwiZmV0Y2giLCJtZXRob2QiLCJtb2RlIiwiaGVhZGVycyIsIkpTT04iLCJzdHJpbmdpZnkiLCJWYWxpZGF0ZWRRdWVyeSIsInJlbW92ZUVtcHR5VmFsdWVzXzEiLCJ3aXRob3V0RW1wdHlWYWx1ZXMiLCJ3aXRob3V0VW5tYXRjaGVkT3B0aW9ucyIsInJlbW92ZVVubWF0Y2hlZE9wdGlvbnMiLCJyZW1vdmVFbXB0eVZhbHVlcyIsIm5ld1F1ZXJ5IiwicHJvcGVydGllcyIsImdldE93blByb3BlcnR5TmFtZXMiLCJmaWVsZHMiLCJwcm9wZXJ0eSIsIm9wdGlvbnMiLCJvcHRpb24iLCJmaWVsZCIsImhhc01hdGNoaW5nRmllbGQiLCJWYWxpZGF0ZWRRdWVyeV8xIiwiYXJyYXkiLCJ2YWxpZGF0ZWRRdWVyeSIsImludmFsaWRPYmplY3RJZCIsInV0aWxpdHlGdW5jdGlvbnNTZXJ2ZXJfMSIsImNhcnREYXRhIiwidmFsaWRWYWx1ZXMiLCJnZXRWYWxpZFZhbHVlcyIsInVybHMiLCJob3N0VXJsIiwiZW5kcG9pbnRzIiwidGVzdCIsInJlZGlyZWN0IiwiY2FsbGJhY2siLCJyZWZyZXNoIiwiZHluYW1pYyIsInJvb3QiLCJnZXREYk9wZXJhdGlvbiIsIk1JQ1JPU0VSVklDRVNfMSIsIm1pY3Jvc2VydmljZSIsImVuZHBvaW50IiwiY29tbWFuZCIsImNvbnRyb2xsZXJzIiwiY29udHJvbGxlciIsImRiT3BlcmF0aW9uIiwiaGFuZGxlUm91dGUiLCJnZXREYk9wZXJhdGlvbl8xIiwicGFyYW1zIiwidXJsSG9tZSIsInNlbmRGaWxlIiwiaW52ZW50b3J5RGF0YSIsImhvbWVfMSIsInRlc3RQYWdlXzEiLCJyZWFkXzEiLCJ1cGRhdGVfMSIsImRlbGV0ZV8xIiwibG9nb3V0XzEiLCJzaWdudXBfMSIsImFzc2VydF8xIiwiYXBpXzEiLCJlbmRwb2ludHNfMSIsImhhbmRsZVJvdXRlXzEiLCJyb3V0ZXIiLCJSb3V0ZXIiLCJwb3N0IiwicHV0IiwiZ2V0IiwidGVzdFBhZ2UiLCJ0b1VzZWRQcm9wZXJ0aWVzIiwidGFibGUiLCJ2YWxpZFRhYmxlc0FuZFByb3BlcnRpZXMiLCJBcnJheSIsInZhbGlkT2JqZWN0IiwidmFsaWRQcm9wZXJ0aWVzIiwidmFsaWRQcm9wZXJ0aWVzQW5kVmFsdWVzIiwicmVkdWNlIiwicHJvcGVydGllc0FycmF5IiwidXNlZFByb3BlcnRpZXMiLCJfb2JqZWN0IiwiY29uZmlndXJlS25leF8xIiwiY29uZmlndXJlTXlzcWxfMSIsImNvbmZpZ3VyZVR5cGVvcm1fMSIsImNvbmZpZ3VyZVNxbGl0ZV8xIiwiY29uZmlndXJlU3FsS25leF8xIiwiY29uZmlndXJlU3FsTXlzcWxfMSIsImNvbmZpZ3VyZVNxbFR5cGVvcm1fMSIsInNxbEtuZXhfMSIsInNxbFR5cGVvcm1fMSIsInNxbFNxbGl0ZV8xIiwic3FsU3FsaXRlRmlsZV8xIiwic3FsTXlzcWxfMSIsIkRhdGFiYXNlIiwiY29uc3RydWN0b3IiLCJjb25maWd1cmVLbmV4IiwiYmluZCIsImNvbmZpZ3VyZU15c3FsIiwiY29uZmlndXJlVHlwZW9ybSIsImNvbmZpZ3VyZVNxbGl0ZSIsImNvbmZpZ3VyZVNxbEtuZXgiLCJjb25maWd1cmVTcWxNeXNxbCIsImNvbmZpZ3VyZVNxbFR5cGVvcm0iLCJzcWxLbmV4Iiwic3FsVHlwZW9ybSIsInNxbFNxbGl0ZSIsInNxbFNxbGl0ZUZpbGUiLCJzcWxNeXNxbCIsImtuZXhfMSIsImtuZXhmaWxlQ29uZmlnIiwibXlzcWxfMSIsIm15c3FsQ29uZmlnIiwibXlzcWwiLCJjcmVhdGVDb25uZWN0aW9uIiwiaW5pdGlhbGl6ZWQiLCJpc0luaXRpYWxpemVkIiwiaW5pdGlhbGl6ZSIsImJldHRlcl9zcWxpdGUzXzEiLCJjd2QiLCJmaWxlbmFtZSIsInNxbGl0ZSIsImFwcERhdGFTb3VyY2UiLCJzcWxDb21tYW5kIiwicGFyYW1ldGVycyIsInJhdyIsImxhYmVsIiwicHJlcGFyZSIsImFsbCIsImZzXzEiLCJTUUxjb21tYW5kcyIsInJlYWRGaWxlU3luYyIsImV4ZWMiLCJ0b1N0cmluZyIsImNvbmZpZ3VyZU1vbmdvZGJfMSIsImFyZ3VtZW50cyIsIlByb21pc2VFeHRlbmRzXzEiLCJwcm90b2NvbCIsIlVSTCIsImdldENsaWVudEFuZERiIiwicmVzb2x2ZSIsInJlamVjdCIsImNsaWVudCIsIk1vbmdvQ2xpZW50IiwiY29ubmVjdCIsImRiIiwiUHJvbWlzZUV4dGVuZHMiLCJjb2xsZWN0aW9uTmFtZSIsImNvbGxlY3Rpb24iLCJwcm9taXNlQ2FsbGJhY2siLCJleHRlbmRlZFByb21pc2UiLCJQcm9taXNlIiwiZXh0ZW5kZWRDYWxsYmFjayIsImV4dGVuZGVkUmVzb2x2ZSIsInJlc29sdmVkVmFsdWUiLCJzZXRQcm90b3R5cGVPZiIsIm1ha2VBc3luY2hyb25vdXMiLCJleGlzdHNTeW5jIiwiaHR0cENvZGVzIiwic3VjY2VzcyIsImNyZWF0ZWQiLCJnZW5lcmFsIiwib2siLCJjb25mbGljdCIsInVuYXV0aG9yaXplZCIsImNyeXB0b18xIiwiYWxnb3JpdGhtIiwiaGFzaENvZGUiLCJjcmVhdGVIYXNoIiwidXBkYXRlIiwiZGlnZXN0Iiwib2JqZWN0V2l0aG91dEVtcHR5VmFsdWVzIiwidG9DbG9uZURlZXAiLCJ0b0Nsb25lIiwidG9Gb3JtRW50cmllcyIsInRvRmllbGRzIiwidG9BcnJheWlzaCIsInRpbWVvdXQiLCJ0ZW1wb3JhcmlseVNocmluayIsInNlcmlhbGl6ZSIsInJ1bkNhbGxiYWNrIiwicmVtb3ZlRmlsZUV4dGVuc2lvbiIsInJlbW92ZUVsZW1lbnQiLCJyZWR1Y2VPYmplY3QiLCJyZWR1Y2VBcnJheSIsInF1b3RlVmFsdWVzIiwicHJlc3NFbnRlciIsIm91dFZhbHVlIiwib3V0UHJvcGVydHkiLCJvdXRJbmRleCIsIm5vSGFuZGxlciIsIm1hdGNoVmFsdWUiLCJtYXRjaEFsbFByb3BlcnRpZXMiLCJtYXRjaFByb3BlcnR5IiwibWF0Y2hJbmRleCIsIm1hdGNoSXNFcXVhbCIsIm1hcFByb3BlcnRpZXMiLCJpc1VSTCIsImlzT2JqZWN0RW1wdHkiLCJpc0FycmF5RW1wdHkiLCJpc0NoYXIiLCJpc0hUTUxmaWxlIiwiaXNET01vYmplY3RSZWFkeSIsImlzVW5pcXVlVmFsdWUiLCJnZXRPYmplY3RQcm9wZXJ0aWVzIiwiZ2V0VW5pcXVlVmFsdWVzIiwiZ2V0TXVsdGlBcnJheVZhbHVlIiwiZ2V0Rm9ybUVudHJpZXMiLCJnZXRDb21tYW5kTGluZVBhcmFtZXRlcnMiLCJmbG9vck9mIiwiZmlsdGVyU29ydCIsImNvbnZlcnRUb1RleHREb2N1bWVudCIsImNvbnZlcnRUb0h0bWxEb2N1bWVudCIsImNvbWJpbmUiLCJjb3B5VmFsdWVzT2YiLCJsb2Rhc2hfMSIsImNyeXB0b19qc18xIiwic291cmNlIiwiY29weSIsImNvdWxkbnRDb3B5VmFsdWUiLCJ2YWx1ZTEiLCJ2YWx1ZTIiLCJlbGVtZW50IiwiX2luZGV4IiwiX2FycmF5IiwicmVtb3ZlIiwiZmlsZVN0cmluZyIsImh0bWxDb250ZW50IiwiaHRtbERvY3VtZW50IiwiRE9NUGFyc2VyIiwicGFyc2VGcm9tU3RyaW5nIiwiZmlsZUNvbnRlbnQiLCJ0ZXh0Q29udGVudCIsImlzTWF0Y2giLCJtYXRjaCIsIm5vdE1hdGNoIiwidG9GaWx0ZXJTb3J0IiwiZmlsdGVyZWQiLCJwdXNoIiwic3RhcnRpbmdJbmRleCIsImRlY2ltYWxQbGFjZXMiLCJzaGlmdGVkIiwidHJ1bmNhdGVkIiwidW5zaGlmdGVkIiwiTWF0aCIsInRydW5jIiwibnVtYmVyT2ZLZXlzR2VuZXJhdGVkIiwiRGF0ZSIsImdldFRpbWUiLCJjb21tYW5kTGluZSIsImFyZ3YiLCJzbGljZSIsImZvcm1FbGVtZW50IiwiZW50cmllcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpbmRleEFycmF5IiwiaW5kZXgiLCJzaGlmdCIsImFycmF5V2l0aFVuaXF1ZVZhbHVlcyIsImhhc2hPYmplY3QiLCJTSEEyNTYiLCJlbmMiLCJIZXgiLCJET01vYmplY3QiLCJyZWFkeVN0YXRlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIl9saXN0ZW5lciIsImV2ZW50IiwidGFyZ2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsImZpbGVuYW1lU3RyaW5nIiwiaHRtbFJlZ2V4IiwibnVtYmVyT2ZWYWx1ZXMiLCJrZXlzIiwidXJsU3RyaW5nIiwidXJsUmVnZXgiLCJmb3JFYWNoIiwiaXNFcXVhbCIsImluZGV4VG9NYXRjaCIsIl92YWx1ZSIsInZhbHVlVG9NYXRjaCIsInN0cmluZ0luZGV4IiwiaW52YWxpZFByb3BlcnR5IiwicHJvcGVydGllc0FuZFZhbHVlcyIsImlzTWF0Y2hpbmciLCJpbmRleFRvUmVtb3ZlIiwidmFsdWVUb1JlbW92ZSIsIl9wcmVzc0VudGVyIiwiX3JlamVjdCIsInN0ZGluIiwicmVzdW1lIiwib25jZSIsInBhdXNlIiwicXVvdGVkQXJyYXkiLCJzZXJpYWxpemVkIiwicmVwbGFjZXIiLCJzcGFjZXIiLCJodG1sRWxlbWVudCIsImNvbnRhaW5lciIsInBhcmVudEVsZW1lbnQiLCJvZmZzZXRIZWlnaHQiLCJjb250YWluZXJIZWlnaHQiLCJvZmZzZXRXaWR0aCIsImNvbnRhaW5lcldpZHRoIiwib3JpZ2luYWxDb250YWluZXJTaXplIiwiZm9yY2VTdHlsZVNpemUiLCJjdXJyZW50SGVpZ2h0IiwiY3VycmVudFdpZHRoIiwic2hyaW5rUGVyY2VudCIsInRlbXBIZWlnaHQiLCJ0ZW1wV2lkdGgiLCJvcmlnaW5hbEVsZW1lbnRTaXplIiwiZGVsYXkiLCJyZXN0b3JlU2l6ZXMiLCJvcmlnaW5hbEhlaWdodCIsIm9yaWdpbmFsV2lkdGgiLCJyZXN0b3JlU3R5bGVTaXplIiwiaW5pdGlhbFZhbHVlIiwicmVkdWNlZFZhbHVlIiwiY3VycmVudFZhbHVlIiwiYXJyYXlDb3B5Iiwic3BsaXRGaWxlbmFtZSIsInBvcCIsImV4dGVuc2lvblJlbW92ZWQiLCJqb2luIiwib3JpZ2luYWxTaXplT2JqZWN0Iiwib3JpZ2luYWwiLCJzdHlsZSIsImhlaWdodCIsIndpZHRoIiwib3JpZ2luYWxTaXplIiwibWlsbGlzZWNvbmRzIiwicmVzb2x2ZVByb21pc2UiLCJhcnJheWlzaCIsImZpZWxkTGlzdCIsIm5ld0ZpZWxkcyIsImRpZmZlcmVuY2UiLCJjb25jYXQiLCJjbG9uZURlZXAiXSwic291cmNlUm9vdCI6IiJ9