# Security

Security guidance for operating and maintaining Notervo. See [operation and maintenance](docs/operations.md) for supported behavior, known operational constraints, and verification results.

Keep credentials in ignored `.env.local` files or a deployment secret manager. Frontend `VITE_` variables are bundled into public JavaScript. Use distinct credentials for local and production environments. Never include real customer data in fixtures or bug reports.

Account JWTs expire after seven days. Guest order capabilities expire after seven days and are restricted to one order; the storefront stores them in session storage and sends them using `X-Order-Token`. Possession of that capability grants read access to the order. Short order numbers alone do not grant access. Existing guest orders without a capability require administrative assistance.

Do not publish a vulnerability containing credentials or customer information. Report privately to the repository owner through an established private channel. Enable private vulnerability reporting when the hosting service supports it.

Run `npm audit` regularly and review dependency updates. A clean dependency audit does not establish application security. Historical backups live outside this repository and should be kept private; they have not undergone a comprehensive secret scan.
