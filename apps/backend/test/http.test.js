const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-only-secret-with-at-least-thirty-two-characters";
process.env.CORS_ORIGINS = "http://localhost:3000,http://localhost:3001";
const app = require("../app");
let server, base;
before(async () => {
  server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((resolve) => server.close(resolve)));

test("health reports database unavailability without exposing credentials", async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 503);
  assert.equal(res.headers.get("x-powered-by"), null);
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  assert.equal(res.headers.get("cache-control"), "no-store");
  assert.deepEqual(await res.json(), { status: "unavailable" });
});
test("CORS allows configured clients and rejects unknown origins", async () => {
  const allowed = await fetch(`${base}/api/health`, {
    headers: { Origin: "http://localhost:3000" },
  });
  assert.equal(
    allowed.headers.get("access-control-allow-origin"),
    "http://localhost:3000"
  );
  const denied = await fetch(`${base}/api/health`, {
    headers: { Origin: "https://unknown.example" },
  });
  assert.equal(denied.status, 403);
});
test("malformed JSON returns a client error", async () => {
  const res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(res.status, 400);
});
test("unknown endpoints return JSON 404", async () => {
  const res = await fetch(`${base}/api/does-not-exist`);
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { message: "Route not found" });
});
test("checkout validation rejects negative totals before database access", async () => {
  const res = await fetch(`${base}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [{ productId: "507f1f77bcf86cd799439011", quantity: -10 }],
      shippingAddress: {
        fullName: "Name",
        phone: "+201000000000",
        city: "City",
        street: "Street",
      },
    }),
  });
  assert.equal(res.status, 400);
});
test("authentication requests are rate limited", async () => {
  let status;
  for (let i = 0; i < 21; i++) {
    const res = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    status = res.status;
    await res.text();
  }
  assert.equal(status, 429);
});
