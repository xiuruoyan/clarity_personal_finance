# Architecture

## Current shape

Clarity is a single-route React application built with vinext and Vite. The page component owns the interactive demo state for navigation, transaction filters, habit suggestions, account-connection simulation, and savings-goal tracking. Styling is contained in the global stylesheet, while the root layout supplies fonts and social metadata.

The production build targets Cloudflare Workers through the Sites Vite plugin. `.openai/hosting.json` declares optional platform resources; both D1 and R2 are currently disabled.

## Data flow

```text
Synthetic transactions
        │
        ├── category totals ── daily/monthly views
        ├── repeated patterns ── habit cards
        └── saving opportunities ── goal contributions
```

No bank request, external transfer, or financial transaction occurs in the current version.

## Production evolution

A live implementation should add authenticated server routes, Plaid Link token creation, public-token exchange, encrypted access-token storage, verified webhooks, and durable user-owned goal records. Client components must receive only the minimum normalized data needed for display.

See [PLAID_INTEGRATION.md](PLAID_INTEGRATION.md) for the recommended boundary design.
