# Notervo

A completed notebook e-commerce application with a customer storefront, an administration app, and a REST API. This repository brings all three applications together and preserves their development history.

**Project status:** complete. Follow the [setup guide](docs/development.md) to configure and run Notervo. See [operation and maintenance](docs/operations.md) for supported behavior, configuration requirements, and verification results.

## Repository

```text
apps/
  frontend/          React storefront (@notervo/storefront)
  admin-dashboard/   React administration (@notervo/admin)
  backend/           Express + MongoDB API (@notervo/api)
docs/                Architecture, setup, API, migration, and operating guidance
.github/             CI, dependency updates, and pull request template
compose.yaml         Local MongoDB and email inbox
package.json         Shared npm workspace commands
package-lock.json    One dependency lockfile
```

## Start locally

Install Node.js 24, npm 11, and Docker with a running engine (or provide local MongoDB and SMTP services).

```sh
npm ci
docker compose up -d
```

Copy each application's `.env.example` to `.env.local`. Set the API's `JWT_SECRET` to a random value generated with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Then start all three apps:

```sh
npm run dev
```

| Service                 | Address                          |
| ----------------------- | -------------------------------- |
| Storefront              | http://localhost:3000            |
| Administration          | http://localhost:3001            |
| API                     | http://localhost:5050/api        |
| API readiness           | http://localhost:5050/api/health |
| Development email inbox | http://localhost:8025            |

Registration sends a verification link to the local email inbox. Product uploads require your own Cloudinary configuration. An empty database starts with no products or administrator; follow the [setup guide](docs/development.md) to create an admin account.

## Commands

| Command                                   | Purpose                                                        |
| ----------------------------------------- | -------------------------------------------------------------- |
| `npm run dev`                             | Run all apps with shutdown coordination                        |
| `npm run dev:api`                         | Run only the API with file watching                            |
| `npm run dev:store` / `npm run dev:admin` | Run one React app                                              |
| `npm run build`                           | Build both browser applications into their `dist/` directories |
| `npm test`                                | Run API regression tests and storefront unit tests             |
| `npm run lint`                            | Check JavaScript and JSX                                       |
| `npm run format`                          | Apply shared formatting                                        |
| `npm run check`                           | Lint, tests, and browser builds                                |
| `npm run format:check`                    | Verify formatting without changing files                       |

## Documentation

- [Setup and configuration](docs/development.md)
- [Architecture](docs/architecture.md)
- [API overview](docs/api.md)
- [Git history migration](docs/repository-migration.md)
- [Operation and maintenance](docs/operations.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

The storefront currently supports cash on delivery. Card and PayPal payments are not integrated.
