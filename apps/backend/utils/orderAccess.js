const jwt = require("jsonwebtoken");
function createGuestOrderToken(orderId) {
  return jwt.sign(
    { purpose: "guest-order", orderId: String(orderId) },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "7d" }
  );
}
function canReadGuestOrder(token, orderId) {
  if (typeof token !== "string") return false;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return (
      payload.purpose === "guest-order" && payload.orderId === String(orderId)
    );
  } catch {
    return false;
  }
}
module.exports = { createGuestOrderToken, canReadGuestOrder };
