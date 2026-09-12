const path = require("node:path");
require("dotenv").config({
  path: [
    path.join(__dirname, "../.env.local"),
    path.join(__dirname, "../.env"),
  ],
  quiet: true,
});
function validateEnvironment(env = process.env) {
  if (!env.MONGO_URI) throw new Error("MONGO_URI is required");
  if (
    !env.JWT_SECRET ||
    env.JWT_SECRET.length < 32 ||
    env.JWT_SECRET.includes("change-me")
  )
    throw new Error(
      "JWT_SECRET must be a random secret of at least 32 characters"
    );
  const port = Number(env.PORT || 5050);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("PORT must be an integer between 1 and 65535");
  if (env.NODE_ENV === "production" && (!env.CORS_ORIGINS || !env.BASE_URL))
    throw new Error("Production requires explicit CORS_ORIGINS and BASE_URL");
  return { port, mongoUri: env.MONGO_URI };
}
module.exports = { validateEnvironment };
