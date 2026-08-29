# Contributing to Clarity

Thank you for helping improve Clarity.

## Before you start

1. Search existing issues and pull requests.
2. Open an issue before large product, architecture, or data-model changes.
3. Never include real banking data, Plaid tokens, secrets, or personal financial information in examples, fixtures, screenshots, or bug reports.

## Development workflow

1. Fork the repository and create a focused branch.
2. Install dependencies with `npm install`.
3. Make a small, reviewable change.
4. Run `npm test` and `npm run lint`.
5. Update documentation when behavior, configuration, or security assumptions change.
6. Open a pull request using the provided template.

## Code expectations

- Keep TypeScript types explicit at integration boundaries.
- Preserve keyboard navigation, visible focus states, and accessible labels.
- Use synthetic data in tests and documentation.
- Keep Plaid access tokens server-side and encrypted at rest.
- Avoid unrelated formatting or dependency changes.

## Commit and pull-request guidance

Use concise, imperative commit subjects such as `Add transaction date filter`. Pull requests should explain the user problem, the chosen approach, validation performed, and any privacy or security impact.
