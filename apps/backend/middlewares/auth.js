const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const match = /^Bearer ([^\s]+)$/i.exec(req.headers.authorization || "");
  if (!match)
    return res.status(401).json({ message: "A Bearer token is required." });
  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (
      payload.purpose ||
      typeof payload.id !== "string" ||
      !["user", "admin"].includes(payload.role)
    )
      return res.status(401).json({ message: "Invalid account token." });
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
function optionalVerifyToken(req, res, next) {
  return req.headers.authorization ? verifyToken(req, res, next) : next();
}
function isAdmin(req, res, next) {
  return req.user?.role === "admin"
    ? next()
    : res.status(403).json({ message: "Forbidden. Admins only." });
}
function isUserOrAdmin(req, res, next) {
  return req.user &&
    (req.user.role === "admin" ||
      req.user.id === (req.params.id || req.user.id))
    ? next()
    : res.status(403).json({ message: "Forbidden. Not authorized." });
}
module.exports = { verifyToken, optionalVerifyToken, isAdmin, isUserOrAdmin };
