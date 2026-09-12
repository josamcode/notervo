# Notervo API

Express 5 and Mongoose API. `index.js` handles validated configuration, MongoDB connection, and server lifecycle; `app.js` configures HTTP middleware and routes without opening database connections.

Run `npm run dev:api` from the root. Copy `.env.example` to `.env.local`, generate `JWT_SECRET`, and start MongoDB and Mailpit as described in the [development guide](../../docs/development.md).

Run `npm test --workspace=@notervo/api` for regression tests. These use HTTP requests and controlled model doubles, not a real MongoDB instance.

See [API overview](../../docs/api.md), [architecture](../../docs/architecture.md), and [operation and maintenance](../../docs/operations.md).
