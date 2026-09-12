const { validateEnvironment } = require("./config/env");
const mongoose = require("mongoose");
async function start() {
  const { port, mongoUri } = validateEnvironment();
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  const app = require("./app");
  const server = app.listen(port, "0.0.0.0", () =>
    console.log(`Notervo API listening on port ${port}`)
  );
  const shutdown = () => {
    const timeout = setTimeout(() => process.exit(1), 10000).unref();
    server.close(async () => {
      await mongoose.disconnect();
      clearTimeout(timeout);
      process.exit(0);
    });
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  return server;
}
if (require.main === module)
  start().catch(() => {
    console.error(
      "API startup failed. Check environment configuration and MongoDB connectivity."
    );
    process.exitCode = 1;
  });
module.exports = { start };
