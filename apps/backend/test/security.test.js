const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const {
  verifyToken,
  optionalVerifyToken,
  isAdmin,
} = require("../middlewares/auth");
const validateOrder = require("../middlewares/validateOrder");
const {
  createGuestOrderToken,
  canReadGuestOrder,
} = require("../utils/orderAccess");
const User = require("../models/User");
const Order = require("../models/Orders");
const users = require("../controllers/usersControllers");
const orders = require("../controllers/ordersControllers");

process.env.JWT_SECRET = "test-only-secret-with-at-least-thirty-two-characters";
const id = "507f1f77bcf86cd799439011";
const originalFindOne = User.findOne;
const originalOrderFindOne = Order.findOne;
afterEach(() => {
  User.findOne = originalFindOne;
  Order.findOne = originalOrderFindOne;
});
function response() {
  return {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}
function validOrder() {
  return {
    items: [{ productId: id, quantity: 1 }],
    shippingAddress: {
      fullName: "Test Customer",
      phone: "+201000000000",
      city: "Cairo",
      street: "Test Street",
    },
  };
}

test("account tokens require the Bearer scheme, correct signature and account claims", () => {
  const token = jwt.sign({ id, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  for (const header of [
    undefined,
    `Basic ${token}`,
    "Bearer invalid",
    `Bearer ${createGuestOrderToken(id)}`,
  ]) {
    const res = response();
    verifyToken({ headers: { authorization: header } }, res, () =>
      assert.fail("Must not authorize")
    );
    assert.equal(res.statusCode, 401);
  }
  const req = { headers: { authorization: `Bearer ${token}` } };
  let authorized = false;
  verifyToken(req, response(), () => {
    authorized = true;
  });
  assert.ok(authorized);
  assert.equal(req.user.id, id);
});

test("expired and wrong-algorithm tokens are rejected", () => {
  for (const options of [{ expiresIn: -1 }, { algorithm: "HS384" }]) {
    const token = jwt.sign(
      { id, role: "admin" },
      process.env.JWT_SECRET,
      options
    );
    const res = response();
    verifyToken({ headers: { authorization: `Bearer ${token}` } }, res, () =>
      assert.fail("Must not authorize")
    );
    assert.equal(res.statusCode, 401);
  }
});

test("optional auth allows guests but rejects supplied invalid credentials", () => {
  let called = false;
  optionalVerifyToken({ headers: {} }, response(), () => {
    called = true;
  });
  assert.ok(called);
  const res = response();
  optionalVerifyToken({ headers: { authorization: "broken" } }, res, () =>
    assert.fail()
  );
  assert.equal(res.statusCode, 401);
});

test("admin middleware denies missing users and customers", () => {
  for (const user of [undefined, { role: "user" }]) {
    const res = response();
    isAdmin({ user }, res, () => assert.fail());
    assert.equal(res.statusCode, 403);
  }
});

test("guest capabilities are bound to one order and reject expiry and tampering", () => {
  const token = createGuestOrderToken(id);
  assert.ok(canReadGuestOrder(token, id));
  assert.equal(canReadGuestOrder(token, "another-order"), false);
  assert.equal(canReadGuestOrder(undefined, id), false);
  assert.equal(canReadGuestOrder(token + "tampered", id), false);
  assert.equal(
    canReadGuestOrder(
      jwt.sign(
        { purpose: "guest-order", orderId: id },
        process.env.JWT_SECRET,
        { expiresIn: -1 }
      ),
      id
    ),
    false
  );
});

test("order lookup denies short-number-only access and allows the matching guest capability", async () => {
  Order.findOne = async () => ({
    _id: id,
    userId: null,
    orderNumber: "NTV-ABC123",
  });
  const req = { params: { id: "NTV-ABC123" }, get: () => undefined };
  const denied = response();
  await orders.getOrderById(req, denied);
  assert.equal(denied.statusCode, 403);
  const allowed = response();
  await orders.getOrderById(
    { ...req, get: () => createGuestOrderToken(id) },
    allowed
  );
  assert.equal(allowed.statusCode, 200);
  assert.equal(allowed.body.order[0]._id, id);
});

test("signed-in orders remain private to their owner or an administrator", async () => {
  Order.findOne = async () => ({
    _id: id,
    userId: "owner",
    orderNumber: "NTV-ABC123",
  });
  for (const [user, expected] of [
    [undefined, 401],
    [{ id: "other", role: "user" }, 403],
    [{ id: "owner", role: "user" }, 200],
    [{ id: "admin", role: "admin" }, 200],
  ]) {
    const res = response();
    await orders.getOrderById({ params: { id }, user }, res);
    assert.equal(res.statusCode, expected);
  }
});

for (const quantity of [-1, 0, 1.5, "2", null, Infinity, 1000]) {
  test(`checkout rejects invalid quantity ${quantity}`, () => {
    const body = validOrder();
    body.items[0].quantity = quantity;
    const res = response();
    validateOrder({ body }, res, () => assert.fail());
    assert.equal(res.statusCode, 400);
  });
}

test("checkout accepts valid cash orders and rejects unsupported payment and malformed products", () => {
  let called = false;
  validateOrder({ body: validOrder() }, response(), () => {
    called = true;
  });
  assert.ok(called);
  for (const body of [
    { ...validOrder(), paymentMethod: "Card" },
    { ...validOrder(), items: [null] },
    { ...validOrder(), couponCode: { $ne: null } },
    { ...validOrder(), shippingAddress: null },
  ]) {
    const res = response();
    validateOrder({ body }, res, () => assert.fail());
    assert.equal(res.statusCode, 400);
  }
});

test("login rejects object-based query injection before touching MongoDB", async () => {
  User.findOne = () => assert.fail("Must validate before database access");
  const res = response();
  await users.loginUser(
    { body: { identifier: { $ne: null }, password: "password" } },
    res
  );
  assert.equal(res.statusCode, 400);
});

test("phone login cannot bypass email verification", async () => {
  User.findOne = async () => ({
    phone: "+201000000000",
    email: "customer@example.test",
    isVerified: false,
  });
  const res = response();
  await users.loginUser(
    { body: { identifier: "+201000000000", password: "Password123" } },
    res
  );
  assert.equal(res.statusCode, 401);
  assert.match(res.body.message, /verify/i);
});

test("profile updates cannot mutate order references, role or verification fields", async (t) => {
  let update;
  t.mock.method(User, "findByIdAndUpdate", (_id, value) => {
    update = value;
    return { select: async () => ({ username: "New name" }) };
  });
  const res = response();
  await users.updateUser(
    {
      user: { id },
      body: {
        username: "New name",
        role: "admin",
        isVerified: true,
        orders: [id],
        cart: id,
        verificationToken: "forged",
      },
    },
    res
  );
  assert.equal(res.statusCode, 200);
  assert.deepEqual(update, { $set: { username: "New name" } });
});

test("retired coupon removal cannot modify saved orders", () => {
  User.findOne = () => assert.fail("Must not access a user or order");
  const res = response();
  orders.removeCouponFromOrders({}, res);
  assert.equal(res.statusCode, 410);
});

test("shipping cannot change after fulfillment has started", async (t) => {
  t.mock.method(Order, "findById", async () => ({
    userId: id,
    state: "shipped",
    save: () => assert.fail("Must not save"),
  }));
  const res = response();
  await orders.updateShipping(
    {
      params: { id },
      user: { id },
      body: { shippingAddress: validOrder().shippingAddress },
    },
    res
  );
  assert.equal(res.statusCode, 409);
});
