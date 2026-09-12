# API overview

Local base: `http://localhost:5050/api`. JSON requests use `Content-Type: application/json`. Account endpoints accept `Authorization: Bearer <token>`. Tokens carry a user ID and role and expire after seven days.

| Route family                                            | Access and responsibility                                                         |
| ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `GET /health`                                           | Public readiness, 200 when MongoDB is connected and 503 otherwise                 |
| `POST /auth/register`                                   | Register customer; email verification required                                    |
| `GET /auth/verify-email?token=...`                      | Redeem a verification token, valid for 24 hours                                   |
| `POST /auth/login`                                      | Email or international phone in `identifier`, plus `password`                     |
| `GET /me`, `PUT /update`                                | Current authenticated profile; protected fields cannot be updated                 |
| `/users`, `/user/:id`, `/delete`                        | Administrator user management; see route methods in `userRoutes.js`               |
| `/products`                                             | Public catalog reads; administrator product mutations and multipart image uploads |
| `/cart`, `/wishlist`                                    | Current account's cart and wishlist                                               |
| `POST /orders`                                          | Guest or account cash-on-delivery checkout                                        |
| `GET /orders`                                           | Current account's orders                                                          |
| `GET /orders/all`                                       | Administrator order list                                                          |
| `GET /orders/:id`                                       | Owner, administrator, or matching guest capability                                |
| `PUT /orders/shipping/:id`                              | Owner only, while pending                                                         |
| `PUT /orders/status/:id`, `DELETE /orders/:id`          | Administrator order management                                                    |
| `POST /orders/apply-coupon`                             | Authenticated checkout preview                                                    |
| `DELETE /orders/remove-coupon`                          | Retired with 410; removing a preview must not reprice a saved order               |
| `/coupons`, `/notebook-categories`, `/website-settings` | Store configuration; check route-level read/write permissions                     |
| `/messages`, `/message-to-user`, `/subscribers`         | Contact and communication workflows                                               |

Checkout request example (replace the product ID and match existing variants):

```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 1,
      "size": "A5",
      "color": "black"
    }
  ],
  "paymentMethod": "CashOnDelivery",
  "shippingAddress": {
    "fullName": "Test Customer",
    "phone": "+201000000000",
    "city": "Cairo",
    "street": "Test address"
  }
}
```

Do not send or trust client totals. Checkout accepts 1–100 lines, each with an integer quantity of 1–999, and validates product availability and selected variants. Repeated lines are aggregated when checking stock. The current schema retains legacy payment enum values, but new orders reject unsupported methods at the API boundary.

A guest creation response includes `guestAccessToken` beside `order`. Send this value as `X-Order-Token` when retrieving the order; do not put it in a URL. The response retains the legacy shape `{ "status": "success", "order": [ ... ] }` for order retrieval.

Errors generally include `message`; legacy controllers still have inconsistent envelopes. New middleware uses 400 for invalid input, 401 for invalid credentials, 403 for forbidden access, 409 for unavailable products or disallowed state changes, 413 for oversized uploads, and 429 for rate limits. A complete OpenAPI contract and consistent controller error handling remain follow-up work.
