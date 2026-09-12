# Development

## Requirements

- Node.js 24 and npm 11; `.nvmrc` records the Node major.
- MongoDB, provided by `docker compose up -d` or your own local instance.
- SMTP for registration: Compose provides Mailpit, which captures messages instead of delivering external email.
- A Cloudinary account only when testing image uploads.

Install from the repository root with `npm ci`. Both React applications use [Vite](https://vite.dev/guide/). Every application has its own development server and shares the root dependency lockfile.

## Environment files

Copy `.env.example` to `.env.local` in **each** application. PowerShell example:

```powershell
Copy-Item apps/backend/.env.example apps/backend/.env.local
Copy-Item apps/frontend/.env.example apps/frontend/.env.local
Copy-Item apps/admin-dashboard/.env.example apps/admin-dashboard/.env.local
```

Do not overwrite an existing local file without reviewing your settings. Local files created during consolidation point at localhost. The original ignored `.env` files were retained; the API loads `.env.local` before `.env`, and existing process environment values take precedence. Vite also gives local environment files priority. Restart development servers after changing configuration.

| Variable                                                               | Location          | Purpose                                                                       |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------- |
| `VITE_API_URL`                                                         | Both browser apps | Public API base, including `/api`                                             |
| `MONGO_URI`                                                            | API               | Database connection URI                                                       |
| `JWT_SECRET`                                                           | API               | Random signing secret, at least 32 characters                                 |
| `PORT`                                                                 | API               | Defaults to 5050                                                              |
| `CORS_ORIGINS`                                                         | API               | Comma-separated browser origins, with no trailing slash                       |
| `BASE_URL`                                                             | API               | API origin used in verification links, without `/api`                         |
| `SECOND_BASE_URL`, `FRONTEND_URL`                                      | API               | Storefront origin used by email templates                                     |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`                                | API               | SMTP transport; defaults to localhost Mailpit                                 |
| `EMAIL_SERVICE`                                                        | API               | Optional Nodemailer service preset, overrides host/port transport             |
| `EMAIL_USER`, `EMAIL_PASS`                                             | API               | SMTP authentication when both are set; user also receives order notifications |
| `EMAIL_FROM`, `SUPPORT_EMAIL`                                          | API               | Sender and customer support addresses                                         |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | API               | Product image storage credentials                                             |

Generate a secret with the command in the root README, then paste it into the API local file. No sample secret is suitable for use as a real signing key.

## First administrator

The bootstrap command only creates a new account; it will not promote or overwrite an existing user. Set these temporary variables in your terminal, then run it from the root:

```powershell
$env:ADMIN_NAME = 'Local administrator'
$env:ADMIN_EMAIL = 'admin@notervo.test'
$env:ADMIN_PHONE = '+201000000000'
# Set ADMIN_PASSWORD privately in your environment; use 8–72 bytes with upper/lowercase and a digit.
npm run admin:create --workspace=@notervo/api
Remove-Item Env:ADMIN_PASSWORD
```

You may instead set these values temporarily in the ignored API `.env.local`; remove the password after account creation. The admin is marked verified. Customers register through the storefront and follow the link in Mailpit.

## Checks and troubleshooting

- `npm run check` needs neither MongoDB nor SMTP. API tests use an ephemeral local HTTP server and controlled model doubles; they do not verify persistence.
- `npm run build` generates `apps/frontend/dist` and `apps/admin-dashboard/dist`. For static hosting, configure SPA fallback to `/index.html` so direct route visits work.
- `503` from `/api/health` means MongoDB is not connected. Startup waits for MongoDB and fails if configuration or connectivity is invalid.
- If ports 3000 or 3001 are occupied, Vite fails rather than silently changing ports and breaking CORS. Free the port or change both the Vite config and CORS list.
- Browser API errors: ensure `VITE_API_URL=http://localhost:5050/api`, restart Vite, and inspect the API process.
- Mailpit: inspect http://localhost:8025. Keep `EMAIL_PASS` empty locally so SMTP authentication is not attempted.
- Image uploads accept JPEG, PNG, and WebP up to 5 MiB per file, with five images per product request. Configure Cloudinary before trying uploads.
- `docker compose down` stops the local services while retaining the named database volume. Do not remove that volume unless you intend to erase local data.

## Containers

Build the API from the repository root:

```sh
docker build -f apps/backend/Dockerfile -t notervo-api .
```

The container runs as an unprivileged user, listens on 5050, and requires runtime environment variables. A container's localhost is not the host machine; provide a reachable database and SMTP hostname. The root `.dockerignore` excludes credentials. The old Fly.io configuration is retained only as an [archived example](archive/fly.toml.example); it is not an active deployment target.
