# Plaid integration guide

The current UI is a safe demo. Do not replace it with direct browser calls to Plaid’s API or expose Plaid secrets to client code.

## Recommended server flow

1. Authenticate the user and create a Plaid Link token on the server.
2. Open Plaid Link in the browser with the short-lived link token.
3. Send the returned public token to an authenticated server route.
4. Exchange it for an access token on the server.
5. Encrypt the access token and associate it with the authenticated user.
6. Fetch and normalize accounts and transactions server-side.
7. Verify Plaid webhooks before syncing transaction changes.
8. Revoke stored access when a user disconnects an institution.

## Environment variables

Copy `.env.example` to `.env.local` for development. Configure production values through the hosting platform rather than committing them.

Required values will include `PLAID_CLIENT_ID`, `PLAID_SECRET`, and `PLAID_ENV`. OAuth institutions also require an allow-listed redirect URI. Use Plaid’s sandbox environment and synthetic users during development.

## Storage model

Store an institution item per authenticated user, an encrypted access token reference, normalized account metadata, cursor-based sync state, and normalized transactions. Savings goals should also be user-owned durable records. Never use browser storage as the source of truth for financial data.

## Minimum security review

- Confirm server-only secret handling and token encryption.
- Confirm ownership checks on every account, transaction, and goal query.
- Verify webhook signatures and replay protections.
- Redact structured logs and error payloads.
- Define retention, deletion, disconnect, and data-export behavior.
- Complete appropriate Plaid production-access and privacy requirements.
