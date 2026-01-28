# @form-me/web

Public-facing website for Form Me - the training management platform.

## Overview

This is the main public website that serves:

- Training catalog browsing (`/formations`)
- Category listings (`/formations/category/[slug]`)
- Training detail pages (`/formations/[slug]`)
- Quote request forms (`/devis-&-contact`)
- Learner authentication (`/auth`)
- Learner dashboard (`/dashboard`)
- Homepage and marketing pages

## User Roles

This application only allows the following user roles:

- **LEARNER** - Users enrolled in training programs
- **CLIENT** - Company representatives managing their employees' training

Admin users should use the separate admin application (`@form-me/admin`).

## Development

```bash
# From the monorepo root
pnpm dev --filter @form-me/web

# Or from this directory
pnpm dev
```

The development server runs on port 3000 by default.

## Dependencies

This app depends on the following internal packages:

- `@form-me/database` - Prisma client and database utilities
- `@form-me/auth` - Authentication configuration
- `@form-me/types` - Shared TypeScript types
- `@form-me/storage` - Supabase storage utilities
- `@form-me/email` - Email sending with Resend

## Build

```bash
pnpm build
```

## Environment Variables

Required environment variables (defined in root `.env`):

- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection (for migrations)
- `NEXTAUTH_URL` - Base URL for NextAuth
- `NEXTAUTH_SECRET` - Secret for JWT signing
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `RESEND_API_KEY` - Resend API key for emails
