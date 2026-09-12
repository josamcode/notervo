const { isObjectIdOrHexString } = require("mongoose");
function validateOrder(req, res, next) {
  const { items, paymentMethod, couponCode, shippingAddress } = req.body || {};
  if (!Array.isArray(items) || items.length < 1 || items.length > 100)
    return res
      .status(400)
      .json({ message: "An order must contain between 1 and 100 items" });
  if (paymentMethod && paymentMethod !== "CashOnDelivery")
    return res
      .status(400)
      .json({ message: "Only cash on delivery is currently supported" });
  if (
    couponCode != null &&
    (typeof couponCode !== "string" || couponCode.length > 64)
  )
    return res.status(400).json({ message: "Invalid coupon code" });
  if (
    !shippingAddress ||
    typeof shippingAddress !== "object" ||
    Array.isArray(shippingAddress)
  )
    return res.status(400).json({ message: "Shipping address is required" });
  for (const field of ["fullName", "phone", "city", "street"]) {
    if (
      typeof shippingAddress[field] !== "string" ||
      !shippingAddress[field].trim() ||
      shippingAddress[field].length > 300
    )
      return res
        .status(400)
        .json({ message: `Invalid shipping address field: ${field}` });
  }
  for (const item of items) {
    if (
      !item ||
      !isObjectIdOrHexString(item.productId) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 999
    )
      return res.status(400).json({
        message:
          "Each item needs a valid product ID and integer quantity between 1 and 999",
      });
    for (const field of ["color", "size"]) {
      if (
        item[field] != null &&
        (typeof item[field] !== "string" || item[field].length > 100)
      )
        return res.status(400).json({ message: `Invalid item ${field}` });
    }
  }
  return next();
}
module.exports = validateOrder;
