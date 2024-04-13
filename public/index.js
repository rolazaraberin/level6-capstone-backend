(() => {
  "use strict";
  var e = {
      9066: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.getAccountById =
            t.getAccountByToken =
            t.deleteAccountById =
            t.deleteAccountByToken =
            t.deleteAccountByPassword =
            t.createAccountByGoogle =
            t.createAccountByPassword =
              void 0);
        const o = n(8042),
          i = r(n(5008)),
          a = n(4072),
          s = r(n(8001)),
          u = n(9628);
        async function c(e, t, n) {
          await (0, o.deleteCartById)(e),
            await (0, a.deleteLoginByEmail)(t),
            await (0, u.deleteUserById)(n);
        }
        async function d(e) {
          const t = await (0, u.getUserById)(e);
          return (t.cart = await (0, o.getCartById)(t.cart_id)), t;
        }
        (t.createAccountByPassword = async function (e, t) {
          const n = await (0, u.createUserByEmail)(e);
          await (0, a.createLoginByPassword)(e, t, n);
          const r = i.default.getNew(e);
          return await i.default.save(e, r), { user: n, token: r };
        }),
          (t.createAccountByGoogle = async function (e, t, n) {
            const r = await (0, u.createUserByEmail)(e, t);
            await (0, a.createLoginByGoogle)(e, r._id, n);
            const o = i.default.getNew(e);
            return await i.default.save(e, o), { user: r, token: o };
          }),
          (t.deleteAccountById = async function (e) {
            const t = await (0, u.getUserById)(e);
            if (!t) {
              const e = new Error("ERROR: invalid user id");
              throw ((e.code = s.default.error.badRequest), e);
            }
            await c(t.cart_id, t.email, e);
          }),
          (t.deleteAccountByPassword = async function (e, t) {
            const n = await (0, u.getUserByPassword)(e, t);
            if (!n) {
              const e = new Error("ERROR: incorrect password");
              throw ((e.code = s.default.error.incorrectPassword), e);
            }
            await c(n.cart_id, e, n._id);
          }),
          (t.deleteAccountByToken = async function (e, t) {
            const n = await (0, u.getUserByToken)(e, t);
            if (!n) {
              const e = new Error("ERROR: invalid token");
              throw ((e.code = s.default.error.incorrectCredentials), e);
            }
            await c(n.cart_id, e, n._id);
          }),
          (t.getAccountByToken = async function (e, t) {
            const n = await (0, u.getUserByToken)(e, t),
              r = await d(n._id);
            return r && (r.token = t), r;
          }),
          (t.getAccountById = d);
      },
      5772: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(8001)),
          i = n(9628),
          a = {
            ping: async function (e, t) {
              try {
                const e = {};
                await (0, i.getUserById)(e), t.send("API ready");
              } catch (e) {
                const n = await e;
                n.message = "ERROR: API not ready. Try again.";
                const r = o.default.error.serverError;
                t.status(r).send(n);
              }
            },
          };
        t.default = a;
      },
      863: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(8001)),
          i = n(218),
          a = n(2787),
          s = r(n(8996)),
          u = {
            cart: async function (e, t, n) {
              if (!e) throw new Error("ERROR: invalid cart id");
              const r = await u.token(t.email, n),
                { user_id: i } = r;
              if (t._id !== i) {
                const e = new Error("ERROR: forbidden access to cart");
                throw ((e.code = o.default.error.forbiddenUser), e);
              }
            },
            password: async function (e, t) {
              if (!e || !t) {
                const e = new Error(
                  "ERROR: email and password must be provided"
                );
                throw ((e.code = o.default.error.unauthenticated), e);
              }
              const n = (0, i.hash)(e),
                r = (0, i.hash)(t),
                a = await s.default.getOne({ emailHash: n, passwordHash: r });
              if (!a) {
                const e = new Error("ERROR: Incorrect email or password");
                throw ((e.code = o.default.error.unauthenticated), e);
              }
              const { user_id: u, token: c } = a;
              return { user_id: u, token: c };
            },
            token: async function (e, t) {
              if ((0, a.isEmpty)(e) || (0, a.isEmpty)(t)) {
                const e = new Error("ERROR: incorrect email or token");
                throw ((e.code = o.default.error.unauthenticated), e);
              }
              const n = (0, i.hash)(e);
              if (!n) {
                const e = new Error("ERROR: Invalid email or token");
                throw ((e.code = o.default.error.unauthenticated), e);
              }
              return await s.default.getOne({ emailHash: n, token: t });
            },
            google: async function (e, t) {
              if ((0, a.isEmpty)(e) || (0, a.isEmpty)(t)) {
                const e = new Error("ERROR: incorrect email or id");
                throw ((e.code = o.default.error.unauthenticated), e);
              }
              const n = (0, i.hash)(e);
              if (!n) {
                const e = new Error("ERROR: Invalid email or token");
                throw ((e.code = o.default.error.unauthenticated), e);
              }
              const r = await s.default.getOne({ emailHash: n, googleId: t });
              if (!r) {
                const e = new Error(
                  "ERROR: An account with that email was not found."
                );
                throw ((e.code = o.default.error.unauthenticated), e);
              }
              return r;
            },
          };
        t.default = u;
      },
      8042: function (e, t, n) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, r) {
                  void 0 === r && (r = n);
                  var o = Object.getOwnPropertyDescriptor(t, n);
                  (o &&
                    !("get" in o
                      ? !t.__esModule
                      : o.writable || o.configurable)) ||
                    (o = {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    }),
                    Object.defineProperty(e, r, o);
                }
              : function (e, t, n, r) {
                  void 0 === r && (r = n), (e[r] = t[n]);
                }),
          o =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, "default", {
                    enumerable: !0,
                    value: t,
                  });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  "default" !== n &&
                    Object.prototype.hasOwnProperty.call(e, n) &&
                    r(t, e, n);
              return o(t, e), t;
            },
          a =
            (this && this.__rest) ||
            function (e, t) {
              var n = {};
              for (var r in e)
                Object.prototype.hasOwnProperty.call(e, r) &&
                  t.indexOf(r) < 0 &&
                  (n[r] = e[r]);
              if (
                null != e &&
                "function" == typeof Object.getOwnPropertySymbols
              ) {
                var o = 0;
                for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
                  t.indexOf(r[o]) < 0 &&
                    Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
                    (n[r[o]] = e[r[o]]);
              }
              return n;
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e };
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.updateCart =
            t.setCart =
            t.removeItemFromCart =
            t.getItemsByCart =
            t.createCart =
            t.deleteCartById =
            t.getCartByUser =
            t.getCartByToken =
            t.getCartById =
              void 0);
        const u = i(n(962)),
          c = n(9628),
          d = s(n(77)),
          l = s(n(9318)),
          f = n(8013),
          p = s(n(7157)),
          y = n(2787),
          h = n(7440);
        async function m(e) {
          p.default.cart_id(e);
          const t = await d.default.getOne({ _id: e });
          if (!t) throw new Error("ERROR: Unable to get cart by id");
          return p.default.cart(t), (t.items = await _(t)), t;
        }
        async function _(e) {
          const { item_ids: t } = e;
          return (0, y.isEmpty)(t)
            ? []
            : (function (e, t) {
                const n = [],
                  r = [...t];
                for (let t of e) {
                  const e = r.filter(
                      (e) => e.toString() === t._id.toString()
                    ).length,
                    o = (0, h.Integer)(e),
                    i = t.price * o,
                    a = Object.assign(
                      { _id: t._id, quantity: o, subtotal: i },
                      t
                    );
                  n.push(a);
                }
                return n;
              })(await l.default.getMany({ _id: { $in: t } }), t);
        }
        (t.getCartById = m),
          (t.getCartByToken = async function (e, t) {
            const n = await (0, c.getUserByToken)(e, t);
            return await m(n.cart_id);
          }),
          (t.getCartByUser = async function (e) {
            const t = e.cart_id;
            if (!t) throw new Error("ERROR: missing user cart information");
            return await m(t);
          }),
          (t.deleteCartById = async function (e) {
            return await m(e), await d.default.deleteOne({ _id: e });
          }),
          (t.createCart = async function () {
            return (await d.default.addOne()).insertedId;
          }),
          (t.getItemsByCart = _),
          (t.removeItemFromCart = async function (e, t) {
            p.default.cart(e), p.default.item(t);
            const n = { _id: e._id, $pull: { items: t._id } };
            return (
              await d.default.updateOne(n), await m(null == e ? void 0 : e._id)
            );
          }),
          (t.setCart = async function (e) {
            const { items: t } = e,
              n = a(e, ["items"]),
              r = [];
            for (let e of t)
              for (let t = 0; t < e.quantity; t++)
                r.push(new f.ObjectId(e._id));
            const o = u.Cart(
              Object.assign(Object.assign({}, n), { item_ids: r })
            );
            return (
              await d.default.updateOne(o), { message: "SUCCESS: cart updated" }
            );
          }),
          (t.updateCart = async function (e, t) {
            let { items: n } = e,
              r = a(e, ["items"]);
            const o = n.map((e) => e._id),
              i = u.Cart(Object.assign(Object.assign({}, r), { item_ids: o }));
            return await d.default.updateOne(i), await m(e._id);
          });
      },
      5008: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = n(2787),
          i = n(218),
          a = r(n(8996)),
          s = {
            invalidate: async function (e) {
              const t = { _id: e, token: "" };
              return await a.default.updateOne(t);
            },
            revoke: async function (e) {
              const t = { _id: e, token: "", accessToken: "", revokeToken: "" };
              return await a.default.updateOne(t);
            },
            getNew: function (e) {
              return (0, i.hash)(e + (0, o.generateKey)());
            },
            save: async function (e, t, n, r) {
              const o = (0, i.hash)(e),
                s = await a.default.getOne({ emailHash: o }),
                { _id: u } = s,
                c = { _id: u, token: t };
              return (
                n && (c.accessToken = n),
                r && (c.revokeToken = r),
                await a.default.updateOne(c)
              );
            },
          };
        t.default = s;
      },
      2324: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.restoreDependencies =
            t.injectDependencies =
            t.getInventory =
              void 0);
        const o = r(n(224)),
          i = n(1096);
        let a = o.default;
        (t.getInventory = async function () {
          const e = await a.getOne(),
            t = await (0, i.getItemsById)(e.item_ids);
          return Object.assign(Object.assign({}, e), { items: t });
        }),
          (t.injectDependencies = function (e, t) {
            (a = e), (0, i.injectDependency)(t);
          }),
          (t.restoreDependencies = function () {
            (a = o.default), (0, i.restoreDependency)();
          });
      },
      1096: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.restoreDependency =
            t.injectDependency =
            t.getVerifiedItemId =
            t.getItemsById =
            t.getItemById =
              void 0);
        const o = n(2787),
          i = r(n(9318));
        let a = i.default;
        (t.getItemById = async function (e) {
          return await a.getOne({ _id: e });
        }),
          (t.getItemsById = async function (e) {
            if ((0, o.isEmpty)(e))
              throw new Error("ERROR: item ids are required");
            let t = { _id: { $in: e } };
            return await a.getMany(t);
          }),
          (t.getVerifiedItemId = async function () {
            return (await a.getOne())._id;
          }),
          (t.injectDependency = function (e) {
            a = e;
          }),
          (t.restoreDependency = function () {
            a = i.default;
          });
      },
      346: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(863)),
          i = r(n(5008)),
          a = n(8844),
          s = r(n(3188)),
          u = {
            withToken: async function (e, t, n) {
              const { email: r, token: i } = e.body;
              if (!i) return n();
              try {
                const e = await o.default.token(r, i);
                if (!e)
                  return t.status(401).send("ERROR: Invalid email or token");
                const n = {
                  email: r,
                  token: i,
                  isTemporary: !1,
                  googleId: e.googleId,
                };
                t.status(200).send(n);
              } catch (e) {
                const {
                  error: n,
                  code: r,
                  message: o,
                } = await (0, a.handleAsyncError)(e);
                t.status(r).send(o);
              }
            },
            withPassword: async function (e, t) {
              const { email: n, password: r } = e.body;
              try {
                s.default.loginAttempts(n);
                const { token: e } = await o.default.password(n, r),
                  a = { email: n, token: e, isTemporary: !1 };
                e ||
                  ((a.token = i.default.getNew(n)),
                  await i.default.save(n, a.token)),
                  t.status(200).send(a);
              } catch (e) {
                const {
                  error: n,
                  code: r,
                  message: o,
                } = await (0, a.handleAsyncError)(e);
                t.status(r).send(o);
              }
            },
            withGoogle: async function (e, t, n) {
              try {
                const { email: r, googleId: a } = e.body;
                if (!a) return n();
                const { token: s } = await o.default.google(r, a),
                  u = { email: r, token: s, isTemporary: !1 };
                s ||
                  ((u.token = i.default.getNew(r)),
                  await i.default.save(r, u.token)),
                  t.status(200).send(u);
              } catch (e) {
                const {
                  error: n,
                  code: r,
                  message: o,
                } = await (0, a.handleAsyncError)(e);
                t.status(r).send(o);
              }
            },
          };
        t.default = u;
      },
      4072: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.loginWithToken =
            t.loginWithPassword =
            t.deleteLoginByEmail =
            t.getUserIdByPassword =
            t.createLoginByGoogle =
            t.createLoginByPassword =
              void 0);
        const o = n(218),
          i = r(n(5008)),
          a = r(n(9905)),
          s = r(n(3188)),
          u = r(n(8996)),
          c = r(n(829)),
          d = n(9628);
        (t.createLoginByPassword = async function (e, t, n) {
          a.default.email(e),
            a.default.password(t),
            a.default.user(n, "ERROR: user is required"),
            await s.default.signupEmail(e);
          const r = (0, o.hash)(e),
            i = (0, o.hash)(t),
            c = n._id;
          return await u.default.addOne({
            emailHash: r,
            passwordHash: i,
            user_id: c,
          });
        }),
          (t.createLoginByGoogle = async function (e, t, n) {
            a.default.email(e),
              a.default.userId(t, "ERROR: userId is required"),
              await s.default.signupEmail(e);
            const r = (0, o.hash)(e);
            return await u.default.addOne({
              emailHash: r,
              user_id: t,
              googleId: n,
            });
          }),
          (t.deleteLoginByEmail = async function (e) {
            a.default.email(e);
            const t = (0, o.hash)(e);
            return await u.default.deleteOne({ emailHash: t });
          }),
          (t.getUserIdByPassword = async function (e, t) {
            a.default.email(e), a.default.password(t);
            const n = (0, o.hash)(e),
              r = (0, o.hash)(t),
              i = await u.default.getOne({ emailHash: n, passwordHash: r });
            return null == i ? void 0 : i.user_id;
          }),
          (t.loginWithPassword = async function (e, t) {
            a.default.email(e), a.default.password(t);
            const n = (0, o.hash)(e),
              r = (0, o.hash)(t),
              s = await u.default.getOne({ emailHash: n, passwordHash: r });
            let d = null == s ? void 0 : s.token;
            d || ((d = i.default.getNew(e)), await i.default.save(e, d));
            const l = await c.default.getOne({ _id: s.user_id });
            if (!l) throw new Error("ERROR: invalid login");
            return { user: l, token: d };
          }),
          (t.loginWithToken = async function (e, t) {
            a.default.email(e), a.default.token(t);
            const n = (0, o.hash)(e),
              r = await u.default.getOne({ emailHash: n, token: t });
            if (!r) throw new Error("ERROR: invalid login");
            const { user_id: i } = r;
            return await (0, d.getUserById)(i);
          });
      },
      3735: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(863)),
          i = r(n(5008)),
          a = n(8844),
          s = {
            withToken: async function (e, t) {
              try {
                const { email: n, token: r } = e.body,
                  a = await o.default.token(n, r),
                  { _id: s } = a;
                await i.default.invalidate(s),
                  t.status(200).send("SUCCESS: logged out");
              } catch (e) {
                const {
                  error: n,
                  code: r,
                  message: o,
                } = await (0, a.handleAsyncError)(e);
                t.status(r).send(o);
              }
            },
          };
        t.default = s;
      },
      6043: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(2139)),
          i = r(n(5142)),
          a = n(8844);
        i.default.config();
        const s = {
          signupConfirmation: function (e) {
            c(e) ||
              u({
                from: "rolazaraberin.test@gmail.com",
                to: e,
                subject: "Signup Confirmation",
                text: `${e} has been signed up for Online Store`,
                html: `<p>${e} has been signed up for Online Store</p>`,
              });
          },
          deleteConfirmation: function (e) {
            c(e) ||
              u({
                from: "rolazaraberin.test@gmail.com",
                to: e,
                subject: "Delete Confirmation",
                text: `${e} has been deleted from Online Store`,
                html: `<p>${e} has been deleted from Online Store</p>`,
              });
          },
        };
        async function u(e) {
          try {
            return (await o.default.send(e))[0].statusCode;
          } catch (e) {
            const {
              error: t,
              code: n,
              message: r,
            } = await (0, a.handleAsyncError)(e);
            console.log(t);
          }
        }
        function c(e) {
          switch (e) {
            case "new@email.com":
            case "temp@email.com":
            case "temporary@email.com":
            case "correct@email.com":
            case "permanent@email.com":
              return !0;
          }
          return !1;
        }
        (t.default = s), o.default.setApiKey(process.env.sendGridApiKey);
      },
      1858: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(6043)),
          i = r(n(5142)),
          a = n(9066),
          s = n(8844),
          u = r(n(3188)),
          c = {
            withPassword: async function (e, t, n) {
              try {
                const { email: n, password: r } = e.body;
                await u.default.signupEmail(n);
                const { user: i, token: s } = await (0,
                a.createAccountByPassword)(n, r);
                t.status(200).send({ email: i.email, token: s }),
                  "true" !== d && o.default.signupConfirmation(n);
              } catch (e) {
                const {
                  error: n,
                  code: r,
                  message: o,
                } = await (0, s.handleAsyncError)(e);
                t.status(r).send(o);
              }
            },
            withGoogle: async function (e, t, n) {
              try {
                const { email: r, name: i, googleId: s } = e.body;
                if (!s) return n();
                await u.default.signupEmail(r);
                const { user: c, token: l } = await (0,
                a.createAccountByGoogle)(r, i, s);
                t.status(200).send({ email: c.email, token: l }),
                  "true" !== d && o.default.signupConfirmation(r);
              } catch (e) {
                const {
                  error: n,
                  code: r,
                  message: o,
                } = await (0, s.handleAsyncError)(e);
                t.status(r).send(o);
              }
            },
          };
        (t.default = c), i.default.config();
        const d = process.env.disableEmails;
      },
      9200: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(6043)),
          i = r(n(5142)),
          a = n(8844),
          s = n(9066),
          u = {
            fetchInfo: async function (e, t) {
              try {
                const { email: n, token: r } = e.body,
                  o = await (0, s.getAccountByToken)(n, r);
                if (!o)
                  return t.status(401).send("ERROR: Cannot retrieve account");
                t.status(200).send(o);
              } catch (e) {
                const {
                  error: n,
                  message: r,
                  code: o,
                } = await (0, a.handleAsyncError)(e);
                t.status(o).send(r);
              }
            },
            delete: async function (e, t) {
              try {
                const { email: n, password: r, token: i } = e.body;
                r
                  ? await (0, s.deleteAccountByPassword)(n, r)
                  : i && (await (0, s.deleteAccountByToken)(n, i)),
                  t.status(200).send("SUCCESS: Account deleted"),
                  "true" !== c && o.default.deleteConfirmation(n);
              } catch (e) {
                const {
                  error: n,
                  message: r,
                  code: o,
                } = await (0, a.handleAsyncError)(e);
                t.status(o).send(r);
              }
            },
          };
        (t.default = u), i.default.config();
        const c = process.env.disableEmails;
      },
      9628: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.deleteUserById =
            t.getUserByPassword =
            t.getUserByToken =
            t.getUserById =
            t.getCartId =
            t.createUserByEmail =
              void 0);
        const o = n(218),
          i = n(4072),
          a = n(8042),
          s = r(n(8001)),
          u = r(n(9905)),
          c = r(n(829)),
          d = r(n(8996));
        async function l(e) {
          try {
            if (!e) throw new Error("ERROR: user id is required");
            return await c.default.getOne({ _id: e });
          } catch (e) {}
        }
        async function f(e, t) {
          u.default.email(e), u.default.token(t);
          const n = (0, o.hash)(e),
            r = await d.default.getOne({ emailHash: n, token: t }),
            i = await c.default.getOne({ _id: r.user_id });
          if (!i) throw new Error("ERROR: Unable to get user by token");
          return i;
        }
        (t.getCartId = async function (e, t) {
          const { email: n, cart_id: r } = e;
          if (r) return r;
          const o = await f(n, t);
          return null == o ? void 0 : o.cart_id;
        }),
          (t.getUserById = l),
          (t.getUserByToken = f),
          (t.getUserByPassword = async function (e, t) {
            u.default.email(e), u.default.password(t);
            const n = await (0, i.getUserIdByPassword)(e, t);
            if (!n) {
              const e = new Error("ERROR: invalid email or password");
              throw ((e.code = s.default.error.incorrectCredentials), e);
            }
            return await l(n);
          }),
          (t.deleteUserById = async function (e) {
            try {
              if (!e) throw new Error("ERROR: user id is required");
              return await c.default.deleteOne({ _id: e });
            } catch (e) {
              throw new Error(
                "ERROR: must delete user cart and user login before deleting user"
              );
            }
          }),
          (t.createUserByEmail = async function (e, t = "") {
            u.default.email(e);
            const n = {};
            (n.email = e),
              (n.name = t),
              (n.cart_id = await (0, a.createCart)());
            const r = await c.default.addOne(n);
            return (n._id = r.insertedId), n;
          });
      },
      6083: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.handler = void 0),
          n(3236);
        const o = r(n(6860)),
          i = r(n(3582)),
          a = r(n(6919)),
          s = (r(n(9137)), r(n(3440)), n(2324), n(6959)),
          u = r(n(724)),
          c = r(n(5142)),
          d = n(4275),
          l = n(8719),
          f = n(516);
        c.default.config();
        const p = (0, o.default)(),
          y = (0, l.getHost)("localhost"),
          h = (0, d.getPort)(8e3);
        process.env.hostEnvironment,
          p.use((0, i.default)({ origin: "*" })),
          p.use(o.default.static("public")),
          p.use(o.default.json()),
          p.use("/", a.default),
          (0, f.isServerless)() ||
            (console.log("Starting server..."),
            p.listen(h, y, function () {
              (0, s.isDockerEnvironment)()
                ? console.log(`Listening on http://localhost:${h}`)
                : console.log(`Listening on http://${y}:${h}`);
            })),
          (t.handler = (0, u.default)(p));
      },
      9347: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.MICROSERVICES = void 0);
        const r = n(1745),
          o = n(3894);
        t.MICROSERVICES = { customer: r.CONTROLLERS, product: o.CONTROLLERS };
      },
      1745: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.CONTROLLERS = void 0);
        const o = r(n(8996)),
          i = r(n(829));
        t.CONTROLLERS = { login: o.default, user: i.default };
      },
      8996: function (e, t, n) {
        var r =
          (this && this.__rest) ||
          function (e, t) {
            var n = {};
            for (var r in e)
              Object.prototype.hasOwnProperty.call(e, r) &&
                t.indexOf(r) < 0 &&
                (n[r] = e[r]);
            if (
              null != e &&
              "function" == typeof Object.getOwnPropertySymbols
            ) {
              var o = 0;
              for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
                t.indexOf(r[o]) < 0 &&
                  Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
                  (n[r[o]] = e[r[o]]);
            }
            return n;
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = n(7658),
          i = n(2787),
          a = o.mongodb.getCollection("login"),
          s = {
            getOne: async function (e) {
              return (
                await a, (0, i.isEmpty)(e) ? null : (await a.findOne(e)) || null
              );
            },
            addOne: async function (e) {
              return await a, await a.insertOne(e);
            },
            updateOne: async function (e) {
              await a;
              let { _id: t } = e,
                n = r(e, ["_id"]);
              if (!t) throw new Error("ERROR: _id is required");
              return await a.updateOne({ _id: t }, { $set: n });
            },
            deleteOne: async function (e) {
              if ((await a, (0, i.isEmpty)(e)))
                throw new Error("ERROR: Unable to delete login");
              return await a.deleteOne(e);
            },
          };
        t.default = s;
      },
      829: function (e, t, n) {
        var r =
            (this && this.__rest) ||
            function (e, t) {
              var n = {};
              for (var r in e)
                Object.prototype.hasOwnProperty.call(e, r) &&
                  t.indexOf(r) < 0 &&
                  (n[r] = e[r]);
              if (
                null != e &&
                "function" == typeof Object.getOwnPropertySymbols
              ) {
                var o = 0;
                for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
                  t.indexOf(r[o]) < 0 &&
                    Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
                    (n[r[o]] = e[r[o]]);
              }
              return n;
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e };
            };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const i = n(7658),
          a = o(n(9905)),
          s = n(2787),
          u = n(8013),
          c = {
            getOne: async function (e) {
              if ((await d, (0, s.isEmpty)(e))) return null;
              let { _id: t } = e;
              if (!t) throw new Error("ERROR: User ID is required");
              return (
                "string" == typeof t && (t = new u.ObjectId(t)),
                await d.findOne({ _id: t })
              );
            },
            addOne: async function (e) {
              await d;
              const { email: t } = e;
              return a.default.email(t), await d.insertOne(e);
            },
            deleteOne: async function (e) {
              return await d, await d.deleteOne(e);
            },
            updateOne: async function (e) {
              await d;
              let { _id: t } = e,
                n = r(e, ["_id"]);
              if (!t) throw new Error("ERROR: _id is required");
              return await d.updateOne({ _id: t }, { $set: n });
            },
          };
        t.default = c;
        const d = i.mongodb.getCollection("user");
      },
      9905: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(8001)),
          i = {
            email: function (e) {
              if (!e) throw new Error("ERROR: email is required");
              if ("string" != typeof e) throw new Error("ERROR: invalid email");
            },
            password: function (e) {
              if (!e) throw new Error("ERROR: password is required");
              if ("string" != typeof e)
                throw new Error("ERROR: invalid password");
            },
            user: function (e, t = "ERROR: invalid user") {
              if (!e || !e._id) {
                const e = new Error(t);
                throw ((e.code = o.default.error.badRequest), e);
              }
            },
            userId: function (e, t = "ERROR: invalid user id") {
              if (!e) {
                const e = new Error(t);
                throw ((e.code = o.default.error.badRequest), e);
              }
            },
            token: function (e) {
              if (!e) throw new Error("ERROR: token is required");
              if ("string" != typeof e) throw new Error("ERROR: invalid token");
            },
          };
        t.default = i;
      },
      3188: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = n(218),
          i = r(n(9905)),
          a = r(n(8996)),
          s = {
            signupEmail: async function (e) {
              i.default.email(e);
              const t = (0, o.hash)(e);
              if (await a.default.getOne({ emailHash: t }))
                throw new Error(
                  "ERROR: An account with that email already exists"
                );
            },
            loginAttempts: function (e) {
              var t;
              const n = null !== (t = u[e]) && void 0 !== t ? t : 0;
              if (n > 3) throw new Error("ERROR: Too many login attempts");
              (u[e] = n + 1),
                (function (e) {
                  clearTimeout(c[e]),
                    (c[e] = setTimeout(() => {
                      clearTimeout(c[e]), (u[e] = 0);
                    }, d));
                })(e);
            },
          };
        t.default = s;
        const u = {},
          c = {},
          d = 6e4;
      },
      7658: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.mongodb = t.sql = t.typeorm = t.knex = void 0);
        const o = r(n(6513)),
          i = r(n(7482)),
          a = new o.default();
        a.configureMongodb(i.default),
          (t.knex = a.knex),
          (t.typeorm = a.typeorm),
          (t.sql = a.sql),
          (t.mongodb = a.mongodb);
      },
      7482: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          r(n(5142)).default.config();
        const o = process.env.mongodbConnectionString,
          i = process.env.mongodbDatabase;
        if (!o) throw new Error("ERROR: Mongodb connection string is required");
        if (!i) throw new Error("ERROR: Mongodb database is required");
        const a = {
          connectionString: o,
          database: i,
          user: process.env.mongodbUser,
          password: process.env.mongodbPassword,
        };
        t.default = a;
      },
      3894: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.CONTROLLERS = void 0);
        const o = r(n(77)),
          i = r(n(9318)),
          a = r(n(224));
        t.CONTROLLERS = {
          cart: o.default,
          item: i.default,
          inventory: a.default,
        };
      },
      77: function (e, t, n) {
        var r =
          (this && this.__rest) ||
          function (e, t) {
            var n = {};
            for (var r in e)
              Object.prototype.hasOwnProperty.call(e, r) &&
                t.indexOf(r) < 0 &&
                (n[r] = e[r]);
            if (
              null != e &&
              "function" == typeof Object.getOwnPropertySymbols
            ) {
              var o = 0;
              for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
                t.indexOf(r[o]) < 0 &&
                  Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
                  (n[r[o]] = e[r[o]]);
            }
            return n;
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = n(8883),
          i = n(2787),
          a = n(8013),
          s = {
            addOne: async function (e) {
              return await u, e || (e = {}), await u.insertOne(e);
            },
            getOne: async function (e) {
              if ((await u, (0, i.isEmpty)(e))) return null;
              const { _id: t } = e;
              if (!t) throw new Error("ERROR: Cart id is required");
              return await u.findOne({ _id: new a.ObjectId(t) });
            },
            deleteOne: async function (e) {
              if ((await u, (0, i.isEmpty)(e)))
                throw new Error("ERROR: Unable to delete cart");
              return await u.deleteOne(e);
            },
            updateOne: async function (e) {
              await u;
              let { _id: t } = e,
                n = r(e, ["_id"]);
              if (!t) throw new Error("ERROR: _id is required");
              return await u.updateOne({ _id: t }, { $set: n });
            },
          };
        t.default = s;
        const u = o.mongodb.getCollection("cart");
      },
      3440: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(8338)),
          i = n(8486),
          a = {
            getOne: async function (e) {
              var t, n, r;
              const i = await o.default.send(
                  '\n    query {\n      amazonProductCategory(input: {categoryId: "1084128"}) {\n        productResults {\n          results{\n            asin\n            title\n            mainImageUrl\n            price {\n              value\n            }\n          }\n        }\n      }\n    }'
                ),
                a = (
                  null ===
                    (r =
                      null ===
                        (n =
                          null === (t = null == i ? void 0 : i.data) ||
                          void 0 === t
                            ? void 0
                            : t.amazonProductCategory) || void 0 === n
                        ? void 0
                        : n.productResults) || void 0 === r
                    ? void 0
                    : r.results
                ).map(s);
              return { item_ids: a.map(u), items: a };
            },
          };
        function s(e) {
          const t = e.asin,
            { name: n, description: r } = (function (e) {
              const [t, ...n] = e.split(",");
              return { name: t, description: e };
            })(e.title),
            o = e.price.value,
            a = e.mainImageUrl;
          return (0, i.Item)({
            _id: t,
            name: n,
            description: r,
            price: o,
            image: a,
          });
        }
        function u(e) {
          const { _id: t } = e;
          return t;
        }
        t.default = a;
      },
      224: function (e, t, n) {
        var r =
          (this && this.__rest) ||
          function (e, t) {
            var n = {};
            for (var r in e)
              Object.prototype.hasOwnProperty.call(e, r) &&
                t.indexOf(r) < 0 &&
                (n[r] = e[r]);
            if (
              null != e &&
              "function" == typeof Object.getOwnPropertySymbols
            ) {
              var o = 0;
              for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
                t.indexOf(r[o]) < 0 &&
                  Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
                  (n[r[o]] = e[r[o]]);
            }
            return n;
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = n(8883),
          i = {
            getOne: async function (e) {
              return await a, await a.findOne(e);
            },
            updateOne: async function (e) {
              await a;
              let { _id: t } = e,
                n = r(e, ["_id"]);
              if (!t) throw new Error("ERROR: _id is required");
              return await a.updateOne({ _id: t }, { $set: n });
            },
          };
        t.default = i;
        const a = o.mongodb.getCollection("inventory");
      },
      9137: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(8338)),
          i = n(8486),
          a = r(n(3440)),
          s = {
            getOne: async function (e) {
              var t;
              let { _id: n } = e || {};
              n || (n = "B0BDHWDR12");
              const r = `\n    query amazonProduct {\n      amazonProduct(input: { asinLookup: { asin: "${n}" } }) {\n        asin\n        title\n        mainImageUrl\n        price {\n          value\n        }\n      }\n    }`,
                a = await o.default.send(r),
                s =
                  null === (t = null == a ? void 0 : a.data) || void 0 === t
                    ? void 0
                    : t.amazonProduct;
              return s
                ? ((s.asin = n),
                  (function (e) {
                    const t = e.asin,
                      { name: n, description: r } = (function (e) {
                        const [t, ...n] = e.split(",");
                        return { name: t, description: e };
                      })(e.title),
                      o = e.price.value,
                      a = e.mainImageUrl;
                    return (0, i.Item)({
                      _id: t,
                      name: n,
                      description: r,
                      price: o,
                      image: a,
                    });
                  })(s))
                : null;
            },
            getMany: async function (e) {
              var t;
              const n = await a.default.getOne(),
                { items: r } = n,
                o =
                  (null === (t = null == e ? void 0 : e._id) || void 0 === t
                    ? void 0
                    : t.$in) || [];
              return r.filter(
                ((i = o),
                function (e) {
                  const t = `${e._id}`;
                  return i.includes(t);
                })
              );
              var i;
            },
          };
        t.default = s;
      },
      9318: function (e, t, n) {
        var r =
          (this && this.__rest) ||
          function (e, t) {
            var n = {};
            for (var r in e)
              Object.prototype.hasOwnProperty.call(e, r) &&
                t.indexOf(r) < 0 &&
                (n[r] = e[r]);
            if (
              null != e &&
              "function" == typeof Object.getOwnPropertySymbols
            ) {
              var o = 0;
              for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
                t.indexOf(r[o]) < 0 &&
                  Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
                  (n[r[o]] = e[r[o]]);
            }
            return n;
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = n(8883),
          i = {
            getOne: async function (e) {
              return await a, await a.findOne(e);
            },
            getMany: async function (e) {
              return await a, await a.find(e).toArray();
            },
            updateOne: async function (e) {
              await a;
              let { _id: t } = e,
                n = r(e, ["_id"]);
              if (!t) throw new Error("ERROR: _id is required");
              return await a.updateOne({ _id: t }, { $set: n });
            },
          };
        t.default = i;
        const a = o.mongodb.getCollection("item");
      },
      7157: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(8001)),
          i = {
            cart: function (e) {
              if (!e || !e._id) {
                const e = new Error("ERROR: invalid cart");
                throw ((e.code = o.default.error.badRequest), e);
              }
            },
            cart_id: function (e) {
              if (!e) {
                const e = new Error("ERROR: invalid cart");
                throw ((e.code = o.default.error.badRequest), e);
              }
            },
            item: function (e) {
              if (!e || !e._id) {
                const e = new Error("ERROR: invalid item");
                throw ((e.code = o.default.error.badRequest), e);
              }
            },
          };
        t.default = i;
      },
      8883: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.mongodb = t.sql = t.typeorm = t.knex = void 0);
        const o = r(n(6513)),
          i = r(n(5162)),
          a = new o.default();
        a.configureMongodb(i.default);
        const { knex: s, typeorm: u, sql: c, mongodb: d } = a;
        (t.knex = s), (t.typeorm = u), (t.sql = c), (t.mongodb = d);
      },
      962: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Cart = void 0);
        const o = n(2787),
          i = r(n(9187));
        t.Cart = (e) => {
          if ((0, o.isEmpty)(e)) return null;
          const t = Object.assign({}, e),
            { _id: n, item_ids: r, totalQuantity: a, totalPrice: s } = t;
          return (
            n && (t._id = i.default.objectId(n)),
            r && (t.item_ids = i.default.array(r)),
            a && (t.totalQuantity = i.default.number(a)),
            s && (t.totalPrice = i.default.number(s)),
            t
          );
        };
      },
      8486: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Item = void 0);
        const o = n(2787),
          i = r(n(9187));
        t.Item = (e) => {
          if ((0, o.isEmpty)(e)) return null;
          const t = Object.assign({}, e),
            { _id: n, name: r, price: a, image: s, description: u } = t;
          return (
            n && (t._id = i.default.objectId(n)),
            r && (t.name = i.default.string(r)),
            a && (t.price = i.default.number(a)),
            s && (t.image = i.default.string(s)),
            u && (t.description = i.default.string(u)),
            t
          );
        };
      },
      8338: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          r(n(5142)).default.config();
        const o = {
          send: async function (e) {
            return (
              await fetch("https://graphql.canopyapi.co/", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json", "API-KEY": i },
                body: JSON.stringify({ query: e }),
              })
            ).json();
          },
        };
        t.default = o;
        const { canopyApiKey: i } = process.env;
      },
      5162: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          r(n(5142)).default.config();
        const o = process.env.mongodbConnectionString,
          i = process.env.mongodbDatabase;
        if (!o) throw new Error("ERROR: Mongodb connection string is required");
        if (!i) throw new Error("ERROR: Mongodb database is required");
        const a = {
          connectionString: o,
          database: i,
          user: process.env.mongodbUser,
          password: process.env.mongodbPassword,
        };
        t.default = a;
      },
      3161: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.ValidatedQuery = void 0);
        const r = n(777),
          o = n(2787);
        t.ValidatedQuery = function (e) {
          return (function (e) {
            if ((0, o.isEmpty)(e)) return null;
            const t = Object.assign({}, e),
              n = Object.getOwnPropertyNames(e),
              r = n.filter((e) => !e.includes("_option")),
              i = n.filter((e) => e.includes("_option"));
            for (let e of i) {
              const n = e.split("_")[0];
              r.find((e) => e === n) || delete t[e];
            }
            return t;
          })((0, r.removeEmptyValues)(e));
        };
      },
      6290: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = n(8844),
          i = r(n(863)),
          a = {
            token: async function (e, t, n) {
              try {
                console.log("Verifying user...");
                const { email: t } = e.body.user,
                  { token: r } = e.body.login;
                return (
                  await i.default.token(t, r),
                  console.log("SUCCESS: User verified."),
                  n()
                );
              } catch (e) {
                console.error("ERROR: User unverified.");
                const {
                  error: n,
                  code: r,
                  message: i,
                } = await (0, o.handleAsyncError)(e);
                t.status(r).send(i);
              }
            },
          };
        t.default = a;
      },
      9187: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 });
        const r = n(3161),
          o = n(8013),
          i = {
            query: function (e) {
              return (0, r.ValidatedQuery)(e);
            },
            number: function (e) {
              const t = Number(e);
              return "number" == typeof t ? t : e;
            },
            objectId: function (e) {
              if (e instanceof o.ObjectId) return e;
              try {
                return new o.ObjectId(e);
              } catch (t) {
                return e;
              }
            },
            string: function (e) {
              return "string" == typeof e ? e : `${e}`;
            },
            array: function (e) {
              return e;
            },
          };
        t.default = i;
      },
      2394: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 });
        const r = { set: n(4210).set };
        t.default = r;
      },
      4210: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.set = void 0);
        const o = n(1209),
          i = n(9628),
          a = n(8042),
          s = n(8844),
          u = r(n(7157));
        t.set = async function (e, t) {
          try {
            console.log("Updating cart...");
            const n = (0, o.getValidValues)(e.body),
              r = n.user,
              s = n.cart,
              c = n.login;
            let d;
            u.default.cart(s),
              (s._id = await (0, i.getCartId)(r, c.token)),
              s.items && (d = await (0, a.setCart)(s)),
              console.log("SUCCESS: Cart updated."),
              t.status(200).send(d);
          } catch (e) {
            console.error("ERROR: Unable to update cart.");
            const {
              error: n,
              message: r,
              code: o,
            } = await (0, s.handleAsyncError)(e);
            t.status(o).send(r);
          }
        };
      },
      5647: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = n(1209),
          i = n(8042),
          a = n(8844),
          s = n(9628),
          u = r(n(7157));
        t.default = {
          cartData: async function (e, t) {
            try {
              const n = (0, o.getValidValues)(e.body),
                r = n.cart,
                a = n.item,
                c = n.user,
                d = n.token;
              u.default.cart(r),
                u.default.item(a),
                (r._id = await (0, s.getCartId)(c, d));
              const l = await (0, i.removeItemFromCart)(r, a);
              t.status(200).send(l);
            } catch (e) {
              const {
                error: n,
                message: r,
                code: o,
              } = await (0, a.handleAsyncError)(e);
              t.status(o).send(r);
            }
          },
        };
      },
      3105: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.urls = t.hostUrl = t.endpoints = void 0),
          (t.endpoints = {
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
            dynamic: "/api/:microservice/:endpoint/:command",
          }),
          (t.hostUrl = process.env.host),
          (t.urls = {
            host: t.hostUrl,
            root: t.hostUrl + t.endpoints.baseUrl,
            api: t.hostUrl + t.endpoints.api,
            cart: t.hostUrl + t.endpoints.cart,
            inventory: t.hostUrl + t.endpoints.inventory,
            login: t.hostUrl + t.endpoints.login,
            logout: t.hostUrl + t.endpoints.logout,
            signup: t.hostUrl + t.endpoints.signup,
            account: t.hostUrl + t.endpoints.user,
            test: t.hostUrl + t.endpoints.test,
          });
      },
      7884: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.getDbOperation = void 0);
        const r = n(9347);
        t.getDbOperation = function (e, t, n) {
          const o = r.MICROSERVICES[e];
          if (!o) throw new Error("ERROR: Invalid microservice");
          const i = o[t];
          if (!i) throw new Error("ERROR: Invalid endpoint");
          const a = i[n];
          if (!a) throw new Error("ERROR: Invalid command");
          return a;
        };
      },
      539: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.handleRoute = void 0);
        const o = r(n(9187)),
          i = n(7884);
        t.handleRoute = async function (e, t) {
          const { microservice: n, endpoint: r, command: a } = e.params,
            { query: s, body: u } = e,
            c = Object.assign(Object.assign({}, s), u),
            d = o.default.query(c);
          try {
            const e = (0, i.getDbOperation)(n, r, a),
              o = await e(d);
            t.json(o);
          } catch (e) {
            await e, t.status(404).json(e.message);
          }
        };
      },
      5331: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e, t) {
            t.sendFile("index.html", { root: "public" });
          });
      },
      7299: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 });
        const r = n(8042),
          o = n(2324);
        t.default = {
          cartData: async function (e, t) {
            try {
              console.log("Retrieving cart...");
              const { email: n, token: o } = e.body.user,
                i = await (0, r.getCartByToken)(n, o);
              console.log("SUCCESS: Cart retrieved."), t.status(200).send(i);
            } catch (e) {
              console.error("ERROR: Unable to retrieve cart."),
                t.status(400).send(e);
            }
          },
          inventoryData: async function (e, t) {
            try {
              const e = await (0, o.getInventory)();
              t.status(200).send(e);
            } catch (e) {
              t.status(400).send(e);
            }
          },
        };
      },
      6919: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(6860)),
          i = r(n(5331)),
          a = n(4222),
          s = r(n(7299)),
          u = r(n(5647)),
          c = r(n(3735)),
          d = r(n(1858)),
          l = r(n(346)),
          f = r(n(9200)),
          p = r(n(6290)),
          y = r(n(5772)),
          h = n(3105),
          m = n(539),
          _ = r(n(5142)),
          g = r(n(2394));
        _.default.config();
        const w = o.default.Router();
        w.post(
          h.endpoints.login,
          l.default.withGoogle,
          l.default.withToken,
          l.default.withPassword
        ),
          w.post(h.endpoints.logout, c.default.withToken),
          w.post(
            h.endpoints.signup,
            d.default.withGoogle,
            d.default.withPassword
          ),
          w.post(h.endpoints.user, f.default.fetchInfo),
          w.delete(h.endpoints.user, f.default.delete),
          w.post(h.endpoints.cart, p.default.token, s.default.cartData),
          w.put(h.endpoints.cart, p.default.token, g.default.set),
          w.delete(h.endpoints.cart, p.default.token, u.default.cartData),
          w.get(h.endpoints.inventory, s.default.inventoryData),
          w.get(h.endpoints.baseUrl, i.default),
          w.get(h.endpoints.test, a.testPage),
          w.post(h.endpoints.test, a.testPage),
          w.get(h.endpoints.api, y.default.ping),
          w.get(h.endpoints.dynamic, m.handleRoute),
          w.post(h.endpoints.dynamic, m.handleRoute),
          w.put(h.endpoints.dynamic, m.handleRoute),
          w.delete(h.endpoints.dynamic, m.handleRoute),
          (t.default = w);
      },
      4222: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.testPage = void 0),
          r(n(5142)).default.config(),
          (t.testPage = function (e, t) {
            const n = JSON.stringify({
              method: e.method,
              mode: process.env.mode,
              hostEnvironment: process.env.hostEnvironment,
            });
            t.send(n);
          });
      },
      1209: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.toUsedProperties = t.getValidValues = void 0);
        const r = n(2787);
        function o(e) {
          return function (t = {}, n, r, o) {
            return void 0 === n || n < 0 || (e.includes(r) && (t[r] = n)), t;
          };
        }
        (t.getValidValues = function (e, t = n) {
          t instanceof Array || (t = [t]);
          let n = {};
          for (let i of t) {
            const t = i.table;
            let a = i.properties;
            a instanceof Array || (a = [a]);
            const s = (0, r.reduce)(e[t], o(a));
            (0, r.isEmpty)(s) || (n[t] = s);
          }
          return (0, r.isEmpty)(n) ? null : n;
        }),
          (t.toUsedProperties = o);
      },
      1741: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 });
        const r = n(5661),
          o = n(6902),
          i = n(6857),
          a = n(823),
          s = n(400),
          u = n(3380),
          c = n(6012),
          d = n(3615),
          l = n(7080),
          f = n(3376),
          p = n(5110),
          y = n(4504);
        t.default = class {
          constructor() {
            (this.configureKnex = r.configureKnex.bind(this)),
              (this.configureMysql = o.configureMysql.bind(this)),
              (this.configureTypeorm = i.configureTypeorm.bind(this)),
              (this.configureSqlite = a.configureSqlite.bind(this)),
              (this.configureSqlKnex = s.configureSqlKnex.bind(this)),
              (this.configureSqlMysql = u.configureSqlMysql.bind(this)),
              (this.configureSqlTypeorm = c.configureSqlTypeorm.bind(this)),
              (this.sqlKnex = d.sqlKnex.bind(this)),
              (this.sqlTypeorm = l.sqlTypeorm.bind(this)),
              (this.sqlSqlite = f.sqlSqlite.bind(this)),
              (this.sqlSqliteFile = p.sqlSqliteFile.bind(this)),
              (this.sqlMysql = y.sqlMysql.bind(this));
          }
        };
      },
      5661: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.configureKnex = void 0);
        const o = r(n(514));
        t.configureKnex = function (e) {
          if (!e) throw new Error("ERROR: knexfile is required");
          const t = (0, o.default)(e);
          this.knex = t;
        };
      },
      6902: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.configureMysql = void 0);
        const o = r(n(2744));
        t.configureMysql = function (e) {
          const t = o.default.createConnection({
            host: e.host,
            user: e.user,
            password: e.password,
          });
          this.mysql = t;
        };
      },
      400: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.configureSqlKnex = void 0),
          (t.configureSqlKnex = function () {
            if (!this.knex) throw new Error("ERROR: knex must be configured");
            this.sql = this.sqlKnex.bind(this);
          });
      },
      3380: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.configureSqlMysql = void 0),
          (t.configureSqlMysql = function () {
            if (!this.typeorm)
              throw new Error("ERROR: mysql must be configured");
            this.sql = this.sqlMysql.bind(this);
          });
      },
      6012: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.configureSqlTypeorm = void 0),
          (t.configureSqlTypeorm = function () {
            if (!this.typeorm)
              throw new Error("ERROR: typeorm must be configured");
            (this.sql = this.sqlTypeorm.bind(this)),
              (this.sql.initialized = async function () {
                this.typeorm.isInitialized || (await this.typeorm.initialize());
              }.bind(this));
          });
      },
      823: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.configureSqlite = void 0);
        const o = r(n(5890));
        t.configureSqlite = function (e, t) {
          if (!e)
            throw new Error("ERROR: current working directory is required");
          if (!t) throw new Error("ERROR: filename is required");
          (this.sqlite = new o.default(e + "/" + t)), (this.sqlite.cwd = e);
        };
      },
      6857: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.configureTypeorm = void 0),
          (t.configureTypeorm = function (e) {
            if (!e) throw new Error("ERROR: AppDataSource is required");
            (this.typeorm = e),
              this.typeorm.initialize(),
              (this.typeorm.initialized = async function () {
                return this.typeorm.isInitialized
                  ? void 0
                  : await this.typeorm.initialize();
              }.bind(this));
          });
      },
      3615: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.sqlKnex = void 0),
          (t.sqlKnex = async function (e, t) {
            return (await this.knex.raw(e, t))[0];
          });
      },
      4504: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.sqlMysql = void 0),
          (t.sqlMysql = async function (e, t) {
            return this.mysql.raw(e, t);
          });
      },
      3376: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.sqlSqlite = void 0),
          (t.sqlSqlite = async function (e, t = "") {
            const n = this.sqlite.prepare(e).all();
            return console.log(t, "\n", n, "\n"), n;
          });
      },
      5110: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.sqlSqliteFile = void 0);
        const o = r(n(7147));
        t.sqlSqliteFile = async function (e, t = this.sqlite.cwd) {
          if (!t) throw new Error("ERROR: sqlite is not configured");
          const n = o.default.readFileSync(t + "/" + e);
          this.sqlite.exec(n.toString());
        };
      },
      7080: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.sqlTypeorm = void 0),
          (t.sqlTypeorm = async function (e, t) {
            return await this.typeorm.query(e, t);
          });
      },
      6513: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = r(n(1741)),
          i = n(3978);
        class a extends o.default {
          constructor() {
            super(...arguments),
              (this.configureMongodb = i.configureMongodb.bind(this));
          }
        }
        t.default = a;
      },
      3978: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.configureMongodb = void 0);
        const r = n(4095),
          o = n(8013),
          i = n(6959);
        t.configureMongodb = function ({ connectionString: e, database: t }) {
          const { protocol: n, port: a } = new URL(e);
          (e =
            (0, i.isDockerEnvironment)() && e.includes("localhost")
              ? `${n}//host.docker.internal:${a}`
              : e),
            (this.mongodb = (0, r.PromiseExtends)(
              async function (n, r) {
                try {
                  const r = new o.MongoClient(e);
                  await r.connect();
                  const i = r.db(t);
                  n({ client: r, db: i });
                } catch (e) {
                  console.error("ERROR: Unable to connect to mongodb"),
                    await e,
                    r(e);
                }
              }.bind(this)
            )),
            (this.mongodb.getCollection = (e) =>
              (0, r.PromiseExtends)(
                async function (t) {
                  await this.mongodb;
                  const { db: n } = this.mongodb;
                  t(n.collection(e));
                }.bind(this)
              ));
        };
      },
      8844: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.handleAsyncError = void 0);
        const o = r(n(8001));
        t.handleAsyncError = async function (e) {
          const t = await e,
            n = t.message;
          let r = t.code;
          return (
            ("number" != typeof r || r >= 600) &&
              (r = o.default.error.serverError),
            { error: t, code: r, message: n }
          );
        };
      },
      5998: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.floorOf = void 0),
          (t.floorOf = function (e, t = 0) {
            if (t) {
              const n = 10 ** t,
                r = e * n;
              return Math.trunc(r) / n;
            }
            return Math.trunc(e);
          });
      },
      4095: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.PromiseExtends = void 0),
          (t.PromiseExtends = function (e) {
            const t = new Promise(function (n, r) {
              function o(e) {
                "object" == typeof e
                  ? (Object.assign(t, e), Object.setPrototypeOf(t, e))
                  : Object.defineProperty(t, "value", { value: e }),
                  n("Promise has been extended with new properties");
              }
              setTimeout(() => e(o, r), 0);
            });
            return t;
          });
      },
      6959: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.isDockerEnvironment = void 0);
        const o = r(n(7147));
        t.isDockerEnvironment = function () {
          return o.default.existsSync("/.dockerenv");
        };
      },
      7440: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.PositiveInteger = t.Integer = void 0);
        const r = n(5998);
        (t.Integer = function (e) {
          return (0, r.floorOf)(e);
        }),
          (t.PositiveInteger = function (e) {
            if (e < 1) throw new Error("Invalid positive integer");
            return (0, t.Integer)(e);
          });
      },
      8001: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = {
            success: { created: 201, general: 200, ok: 200 },
            error: {
              badRequest: 400,
              conflict: 409,
              forbiddenUser: 403,
              general: 400,
              unauthorized: 401,
              unauthenticated: 401,
              incorrectPassword: 401,
              incorrectCredentials: 401,
              serverError: 500,
            },
            redirect: { general: 300 },
          });
      },
      218: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.hash = void 0);
        const o = r(n(6113));
        t.hash = function (e, t = "sha256") {
          try {
            return o.default.createHash(t).update(e).digest("hex");
          } catch (e) {
            return;
          }
        };
      },
      777: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.removeEmptyValues = void 0);
        const r = n(2787);
        t.removeEmptyValues = function (e) {
          if ((0, r.isEmpty)(e)) return null;
          let t = null;
          for (let n in e) {
            const o = e[n];
            (0, r.isEmpty)(o) || (t ? (t[n] = o) : (t = { [n]: o }));
          }
          return t;
        };
      },
      8719: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.getHost = void 0);
        const r = n(6959);
        t.getHost = function (e = "localhost") {
          return (0, r.isDockerEnvironment)()
            ? "0.0.0.0"
            : process.env.host || e;
        };
      },
      4275: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.getPort = void 0),
          (t.getPort = function (e = 8e3) {
            return Number(process.env.PORT) || e;
          });
      },
      516: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.isServerless = void 0),
          (t.isServerless = function () {
            return (
              "serverless" === process.env.hostEnvironment ||
              "lambda" === process.env.hostEnvironment ||
              process.env.AWS_LAMBDA_FUNCTION_NAME ||
              process.env.AWS_LAMBDA_FUNCTION_VERSION
            );
          });
      },
      2787: function (e, t, n) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.toCloneDeep =
            t.toClone =
            t.toFormEntries =
            t.toFields =
            t.toArrayish =
            t.timeout =
            t.temporarilyShrink =
            t.stringify =
            t.serialize =
            t.runCallback =
            t.removeFileExtension =
            t.removeElement =
            t.reduceObject =
            t.reduceArray =
            t.reduce =
            t.quoteValues =
            t.pressEnter =
            t.outValue =
            t.outProperty =
            t.outIndex =
            t.noHandler =
            t.matchValue =
            t.matchAllProperties =
            t.matchProperty =
            t.matchIndex =
            t.matchIsEqual =
            t.mapProperties =
            t.map =
            t.isURL =
            t.isObjectEmpty =
            t.isArrayEmpty =
            t.isEmpty =
            t.isChar =
            t.isHTMLfile =
            t.isDOMobjectReady =
            t.isUniqueValue =
            t.hash =
            t.getObjectProperties =
            t.getUniqueValues =
            t.getMultiArrayValue =
            t.getFormEntries =
            t.getCommandLineParameters =
            t.generateKey =
            t.floorOf =
            t.filterSort =
            t.find =
            t.convertToTextDocument =
            t.convertToHtmlDocument =
            t.combine =
            t.copyValuesOf =
              void 0);
        const o = n(6517),
          i = r(n(5666));
        async function a(e) {
          let t = await fetch(e);
          return await t.text();
        }
        (t.copyValuesOf = function (e, t) {
          let n, r;
          for (n in e)
            try {
              (r = e[n]), (t[n] = r);
            } catch (e) {
              console.log(`Couldn't copy ${n}:${r}`);
            }
        }),
          (t.combine = function (e, t) {
            if (typeof e != typeof t)
              throw Error("Cannot combine different types");
            return "string" == typeof e
              ? `${e} ${t}`
              : e instanceof Array
              ? [...e, ...t]
              : "object" == typeof e
              ? Object.assign(Object.assign({}, e), t)
              : void 0;
          }),
          (t.removeElement = function (e, t, n) {
            e.remove();
          }),
          (t.convertToHtmlDocument = async function (e) {
            let t = await a(e),
              n = new DOMParser().parseFromString(t, "text/html");
            return c(e) ? Promise.resolve(n) : Promise.reject(n);
          }),
          (t.convertToTextDocument = a),
          (t.filterSort = function (e, t) {
            return p(
              e,
              function (e = [[], []], n, r, o) {
                const i = e[0],
                  a = e[1];
                return t(n) ? i.push(n) : a.push(n), e;
              },
              [[], []]
            );
          }),
          (t.find = function (e, t, n = 0) {
            if (0 !== n)
              throw new Error("find() startingIndex not yet implemented");
            e instanceof Array || (e = [e]), e.find(t);
          }),
          (t.floorOf = function (e, t) {
            const n = e * t * 10;
            return Math.trunc(n) / (10 * t);
          });
        let s = 0;
        function u(e, t, n) {
          return n.indexOf(e) === t;
        }
        function c(e) {
          return /\.html$/.test(e);
        }
        function d(e) {
          return e instanceof Array
            ? l(e)
            : e instanceof Object
            ? f(e)
            : null == e || "" === e;
        }
        function l(e) {
          return e ? 0 === e.length : e;
        }
        function f(e) {
          return 0 === Object.keys(e).length;
        }
        function p(e, t, n) {
          return e ? (e instanceof Array ? y(e, t, n) : h(e, t, n)) : n;
        }
        function y(e, t, n) {
          if (!(e instanceof Array))
            throw new Error("An array was not passed to reduceArray()");
          let r = n;
          return (
            e.forEach(function (e, n, o) {
              r = t(r, e, n, o);
            }),
            0 === e.length && (r = t(r)),
            r
          );
        }
        function h(e, t, n) {
          if (
            e instanceof Array ||
            "string" == typeof e ||
            "number" == typeof e
          )
            throw new Error("An object was not passed to reduceObject()");
          let r = n;
          for (let n in e) r = t(r, e[n], n, e);
          return d(e) && (r = t(r)), r;
        }
        function m(e, t) {
          const n = t;
          (e.style.height = n.style.height), (e.style.width = n.style.width);
        }
        function _(e, t, n) {
          const r = {
            style: { height: e.style.height, width: e.style.width },
            offsetHeight: e.offsetHeight,
            offsetWidth: e.offsetWidth,
          };
          return (e.style.height = `${t}px`), (e.style.width = `${n}px`), r;
        }
        function g(e = {}, t, n, r) {
          const o = t.name,
            i = t.value;
          return o && (e[o] = i), e;
        }
        (t.generateKey = function () {
          return new Date().getTime() + "-" + s++;
        }),
          (t.getCommandLineParameters = function () {
            return process.argv.slice(2);
          }),
          (t.getFormEntries = function (e) {
            return p(e.querySelectorAll("[name]"), g);
          }),
          (t.getMultiArrayValue = function e(t, n) {
            if (d(t)) return n;
            const r = t.shift();
            return e(t, n[r]);
          }),
          (t.getUniqueValues = function (e) {
            return e.filter(u);
          }),
          (t.getObjectProperties = function (e) {
            let t;
            const n = [];
            for (t in e) n.push(t);
            return n;
          }),
          (t.hash = function (e) {
            try {
              if (!e) return;
              return i.default.SHA256(e).toString(i.default.enc.Hex);
            } catch (e) {
              return;
            }
          }),
          (t.isChar = function (e) {
            return "string" == typeof e && 1 === e.length;
          }),
          (t.isUniqueValue = u),
          (t.isDOMobjectReady = function e(t) {
            if ("loading" !== t.readyState)
              return (
                t.removeEventListener("readystatechange", n),
                Promise.resolve(`${t} is ready`)
              );
            function n(t) {
              e(t.target);
            }
            t.addEventListener("readystatechange", n);
          }),
          (t.isHTMLfile = c),
          (t.isEmpty = d),
          (t.isArrayEmpty = l),
          (t.isObjectEmpty = f),
          (t.isURL = function (e) {
            return /^http(s):\/\//i.test(e);
          }),
          (t.map = function (e, t) {
            return e instanceof Array || (e = [e]), e.map(t);
          }),
          (t.mapProperties = function (e, t) {
            if (!e) return [];
            const n = Object.getOwnPropertyNames(e);
            if (!n) return [];
            const r = [];
            return (
              n.forEach((n) => {
                const o = t(e[n], n, e);
                r.push(o);
              }),
              r
            );
          }),
          (t.matchIsEqual = function (e) {
            return function (t, n, r) {
              return (0, o.isEqual)(e, t);
            };
          }),
          (t.matchIndex = function (e) {
            return function (t, n, r) {
              return n === e;
            };
          }),
          (t.matchProperty = function (e, t) {
            return (
              "string" == typeof e && (e = [e]),
              function (n, r, o) {
                let i = n;
                try {
                  for (let t of e) i = i[t];
                  return i === t;
                } catch (e) {
                  return !1;
                }
              }
            );
          }),
          (t.matchAllProperties = function (e) {
            return function (t, n, r) {
              let o = !0;
              for (let n in e) {
                const r = e[n];
                if (((o = o && t[n] === r), !o)) return !1;
              }
              return !0;
            };
          }),
          (t.matchValue = function (e) {
            return function (t, n, r) {
              return t === e;
            };
          }),
          (t.noHandler = function () {}),
          (t.outIndex = function (e) {
            return function (t, n, r) {
              return n !== e;
            };
          }),
          (t.outProperty = function (e, t) {
            return (
              "string" == typeof e && (e = [e]),
              function (n, r, o) {
                let i = n;
                for (let t of e) i = i[t];
                return i !== t;
              }
            );
          }),
          (t.outValue = function (e) {
            return function (t, n, r) {
              return t !== e;
            };
          }),
          (t.pressEnter = function () {
            return new Promise(function (e, t) {
              process.stdin.resume(),
                process.stdin.once("data", () => (process.stdin.pause(), e()));
            });
          }),
          (t.quoteValues = function (e) {
            return e ? e.map((e) => `"${e}"`) : e;
          }),
          (t.serialize = function (e) {
            const t = {};
            for (let n in e) {
              const r = e[n];
              t[n] = r;
            }
            return t;
          }),
          (t.stringify = function (e) {
            return JSON.stringify(e, void 0, " ");
          }),
          (t.temporarilyShrink = function (e) {
            let t = e.parentElement,
              { offsetHeight: n, offsetWidth: r } = t || {};
            const o = _(t, n, r),
              i = e.offsetHeight,
              a = e.offsetWidth,
              s = _(e, i - 0.05 * i, a - 0.05 * a);
            setTimeout(function () {
              const n = s.offsetHeight,
                r = s.offsetWidth;
              _(e, n, r), m(e, s), m(t, o);
            }, 100);
          }),
          (t.reduce = p),
          (t.reduceArray = y),
          (t.reduceObject = h),
          (t.removeFileExtension = function (e) {
            const t = e.split(".");
            return t.length > 2 && t.pop(), t.join(".");
          }),
          (t.runCallback = function (e, t, n) {
            e();
          }),
          (t.timeout = function (e) {
            return new Promise(function (t) {
              setTimeout(() => t("Timeout complete"), e);
            });
          }),
          (t.toArrayish = function (e = {}, t, n, r) {
            return (e[n] = t), e;
          }),
          (t.toFields = function (e, t, n, r) {
            e instanceof Array || (e = []);
            const i = Object.keys(t),
              a = (0, o.difference)(i, e);
            return e.concat(a);
          }),
          (t.toFormEntries = g),
          (t.toClone = function (e, t, n) {
            return e;
          }),
          (t.toCloneDeep = function (e, t, n) {
            return (0, o.cloneDeep)(e);
          });
      },
      2139: (e) => {
        e.exports = require("@sendgrid/mail");
      },
      5890: (e) => {
        e.exports = require("better-sqlite3");
      },
      3582: (e) => {
        e.exports = require("cors");
      },
      5666: (e) => {
        e.exports = require("crypto-js");
      },
      5142: (e) => {
        e.exports = require("dotenv");
      },
      6860: (e) => {
        e.exports = require("express");
      },
      514: (e) => {
        e.exports = require("knex");
      },
      6517: (e) => {
        e.exports = require("lodash");
      },
      8013: (e) => {
        e.exports = require("mongodb");
      },
      2744: (e) => {
        e.exports = require("mysql");
      },
      3236: (e) => {
        e.exports = require("reflect-metadata");
      },
      724: (e) => {
        e.exports = require("serverless-http");
      },
      6113: (e) => {
        e.exports = require("crypto");
      },
      7147: (e) => {
        e.exports = require("fs");
      },
    },
    t = {},
    n = (function n(r) {
      var o = t[r];
      if (void 0 !== o) return o.exports;
      var i = (t[r] = { exports: {} });
      return e[r].call(i.exports, i, i.exports, n), i.exports;
    })(6083),
    r = exports;
  for (var o in n) r[o] = n[o];
  n.__esModule && Object.defineProperty(r, "__esModule", { value: !0 });
})();
