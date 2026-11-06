# MANÁ STORE IA

International-first digital product studio for the creator's own low-ticket digital products, focused on **Spanish and English** markets.

## Current application

- Main entry point: `/central-pro.html` (the root URL redirects here).
- Product brief and draft manuscript generator in Spanish and English.
- Opportunity radar reader backed by `/api/opportunities`.
- Audience and promotion package generator.
- Local library and JSON backup/export.
- No affiliate-product or physical-product storefront in the primary flow.

## Important limitations

- The free manuscript engine uses local templates and rules, not a connected large language model. It creates first drafts, not fully researched, expert-reviewed books.
- RSS/news signals are exploratory evidence, not proof of buyer demand.
- The library currently uses browser local storage; data is device/browser-specific until exported.
- The current app prepares promotional materials but does not publish to social networks, run paid ads, create checkout products, process payments, or confirm sales.
- Social publishing and sales reporting require official APIs, secure account authorization, and testing.
- Never put passwords, API keys, or service-role secrets in browser code or this repository.

## Environment

The opportunities endpoint requires server-side environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The scheduled research job also requires the scheduler secret configured for its endpoint. Check the deployment environment before relying on scheduled runs.

## Launch checklist

1. Deploy the latest `main` branch to Vercel.
2. Confirm `/central-pro.html` loads on Android.
3. Confirm `/api/opportunities` returns data (or a clear configuration error).
4. Generate a Spanish draft and an English draft; export both.
5. Save a product and a promotion package, then test JSON backup/restore.
6. Connect official checkout and social integrations only after the account owner authorizes them.
