# Contributing

Use short-lived branches from `main`, for example `fix/checkout-validation` or `feat/catalog-filters`. Keep each change focused, include appropriate regression tests, and describe observable behavior in the pull request.

## Commits

Use `type(scope): message`, in the imperative, without a trailing period.

```text
feat(storefront): add product filtering
fix(api): reject invalid checkout quantities
test(api): cover guest order authorization
docs(repo): explain local setup
chore(deps): update supported dependencies
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `build`, `ci`, `chore`, `perf`, `style`, and `revert`. Choose a clear scope such as `api`, `storefront`, `admin`, `repo`, or `deps`. Historical imports retain their original folder scopes.

## Before review

Run `npm run format`, `npm run check`, and `npm audit`. Validate affected browser flows when changing UI or request contracts. Never suppress a failing check solely to make CI pass.

Use the root lockfile and install dependencies into the appropriate workspace, for example `npm install package-name --workspace=@notervo/api`. Do not create per-app lockfiles or nested Git repositories.

Keep environment examples and documentation aligned with code. Do not commit credentials, customer data, uploads, build output, or local database files. Client variables are public build inputs; they must never contain secrets.

Automated tests currently cover selected API security boundaries and storefront utilities. Add database integration or browser tests when the change depends on those systems; a unit test alone does not verify a complete purchase.
