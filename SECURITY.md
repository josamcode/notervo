# Security

Notervo is a development project. Do not expose it as a real store until the blockers in [production readiness](docs/production-readiness.md) have been resolved and independently reviewed.

Keep credentials in ignored `.env.local` files or a deployment secret manager. Frontend `VITE_` variables are bundled into public JavaScript. Use distinct credentials for development and future production. Never include real customer data in fixtures or bug reports.

Account JWTs expire after seven days. Guest order capabilities expire after seven days and are restricted to one order; the storefront stores them in session storage and sends them using `X-Order-Token`. Possession of that capability grants read access to the order. Short order numbers alone do not grant access. Existing guest orders without a capability require administrative assistance.

Do not publish a vulnerability containing credentials or customer information. Report privately to the repository owner through an established private channel. If a future hosting service offers private vulnerability reporting, enable it before launch.

Run `npm audit` regularly and review dependency updates. A clean dependency audit does not establish application security. Historical backups live outside this repository and should be kept private; they have not undergone a comprehensive secret scan.
