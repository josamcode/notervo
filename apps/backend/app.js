const path = require("node:path");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const productsRoutes = require("./routes/productsRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const couponRoutes = require("./routes/couponsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const websiteSettings = require("./routes/websiteSettingsRoutes");
const messageToUserRoutes = require("./routes/messageToUserRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const notebookCategoriesRoutes = require("./routes/notebookCategoriesRoutes");

const app = express();
app.disable("x-powered-by");
// Behind a reverse proxy, set TRUST_PROXY to the number of proxy hops so
// rate limiting sees the client IP instead of the proxy's.
if (process.env.TRUST_PROXY)
  app.set("trust proxy", Number(process.env.TRUST_PROXY));
app.use(helmet());

app.use("/api/public", express.static(path.join(__dirname, "public")));

const allowedOrigins = (
  process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3001"
)
  .split(",")
  .map((origin) => origin.trim());
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests with no Origin header.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(
      Object.assign(new Error("Not allowed by CORS"), { status: 403 })
    );
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);
app.get("/api/health", (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ status: ready ? "ok" : "unavailable" });
});

app.use("/api", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/website-settings", websiteSettings);
app.use("/api/message-to-user", messageToUserRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/notebook-categories", notebookCategoriesRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Notervo Ecommerce API");
});

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, _req, res, _next) => {
  const status =
    err.code === "LIMIT_FILE_SIZE"
      ? 413
      : err.name === "MulterError"
        ? 400
        : Number(err.status || 500);
  res
    .status(status >= 400 && status < 600 ? status : 500)
    .json({ message: status >= 500 ? "Internal server error" : err.message });
});
module.exports = app;
