# Production readiness

This project is not running in production. The cleanup establishes a maintainable development baseline; it does not certify the application for real payments or customer data.

## Completed in this cleanup

- One npm workspace, root lockfile, scoped Git history, CI, formatter, linter, and development documentation.
- Vite builds and lazy browser routes; removed the old `CI=false` build override.
- Local port separation, configurable CORS, validated startup configuration, database readiness, and shutdown handling.
- Bounded HTTP bodies and image uploads, security headers, no-store API responses, and authentication rate limits.
- Email verification enforced for both login identifiers, cryptographic verification tokens with expiry, shorter account tokens, and explicit profile field allowlist.
- Guest order capability checks, positive integer checkout quantities, server-side price snapshots, stock availability and variant checks, and cash-on-delivery-only checkout.
- Removed the checkout coupon-removal call that attempted to mutate historical orders; shipping changes are restricted to pending orders.
- Retired the legacy service-worker cache and added regression tests for selected security and commerce behavior.

## Launch blockers

| Priority | Work                                   | Acceptance criterion                                                                                                                                                                                         |
| -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P0       | Transactional inventory and checkout   | Concurrent purchases cannot oversell; stock reservation/decrement, order creation, cart updates, and coupon redemption commit or roll back together on a MongoDB replica set                                 |
| P0       | Checkout idempotency                   | Double submissions and network retries produce one order; cancellation restores reserved inventory exactly once                                                                                              |
| P0       | Coupon lifecycle                       | Usage restrictions are atomically recorded and enforced; guest eligibility, expiry, cancellation, and discount limits are defined and tested                                                                 |
| P0       | Session lifecycle                      | Add session revocation, recovery and reset flows, verification resend, and a reviewed HttpOnly-cookie strategy; deleted or demoted accounts cannot retain access through stale JWT claims                    |
| P0       | Full input and output audit            | Validate every controller, bound pagination, escape search patterns and HTML template inputs, standardize errors without internal details, and prevent hidden products appearing in public catalog responses |
| P0       | Database and browser integration tests | Exercise registration/email verification, admin product creation, guest and account checkout, cancellation, concurrency, and account isolation against disposable infrastructure                             |
| P0       | Deployment controls                    | Configure HTTPS, exact proxy trust, distributed rate limiting for multiple API instances, managed secrets, data backups and restore drills, monitoring, and access logging with redaction                    |
| P1       | Payment integration, if offered        | Signed webhooks, verified server-side amounts, retry handling, refunds, reconciliation, and a tested provider sandbox; never mark paid based on browser input                                                |
| P1       | Order lifecycle and audit trail        | Enforce allowed state transitions, retain audit records instead of hard-deleting fulfilled orders, and handle email failures asynchronously with retries                                                     |
| P1       | Product and policy review              | Verify taxes, shipping prices and regions, returns, privacy, support contacts, content accuracy, image rights, accessibility, and responsive browser behavior                                                |

The current stock check is advisory across concurrent requests because checkout does not reserve or decrement inventory. Coupon `usedBy` is checked but not atomically recorded at creation. Treat both as incomplete business logic.

## Validation record

On 2026-09-12: a clean `npm ci`, `npm run check`, `npm run format:check`, and `git diff --check` passed. All 26 API tests and 3 storefront tests passed. Both browser builds completed without large-chunk warnings after route splitting. `npm audit` reported zero vulnerabilities. Git verification found all 20 imported original commits and no nested repositories or historically tracked environment files.

Automated checks cover JavaScript linting, browser builds, API HTTP/security regressions, and storefront utility behavior. The admin currently has no dedicated automated test suite. `npm audit` should be rerun at review time because advisory data changes.

ESLint 9 is currently retained for compatibility with `eslint-plugin-react`'s declared peer range. npm reports that this ESLint release is no longer supported; upgrading the lint integration is a tooling follow-up. This does not affect the runtime dependency audit.

During this cleanup Docker's engine returned an error, so Compose startup, container build/runtime, and MongoDB-backed user journeys could not be verified. Cloudinary uploads and SMTP delivery were not exercised. Passing unit tests must not be reported as verification of these external systems.
