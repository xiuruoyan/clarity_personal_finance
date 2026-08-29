# Security policy

## Supported versions

Security updates are applied to the latest version on the default branch.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Use GitHub’s private vulnerability reporting feature when enabled, or contact the repository owner privately through their GitHub profile.

Include a concise description, impact, reproduction steps, and suggested mitigation. Do not include live credentials, access tokens, raw transaction exports, or another person’s financial data.

## Financial-data rules

- Plaid client secrets and access tokens must remain server-side.
- Access tokens must be encrypted at rest and excluded from logs.
- Webhooks must be verified before processing.
- Production routes must enforce authenticated ownership checks.
- Logs and analytics must not contain account numbers, credentials, or complete transaction payloads.
- Test fixtures, screenshots, and issue reports must use synthetic data.
- `.env*` files remain ignored; only `.env.example` may be committed.

The current repository contains a demo connection flow and synthetic transaction data. It is not yet approved for production financial information.
