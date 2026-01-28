# Form Me - Training Management Platform

## Overview

Form Me is a training management platform for a French professional training organization. The platform handles training catalog management, learner support materials, PDF document generation, quote requests, and training session scheduling.

**Version:** 2.0.0
**Stack:** Next.js 16.1.4 / React 19.2.3 / TypeScript / Prisma 6 / PostgreSQL (Supabase) / Tailwind CSS v4 / Turborepo

## Architecture

### Monorepo Structure (Turborepo)

The project uses a monorepo architecture with two applications and shared packages:

```
form-me/
├── apps/
│   ├── web/                    # Public website (form-me.com) - NOT YET MIGRATED
│   │   └── (code in root for now)
│   │
│   └── admin/                  # Admin backoffice (admin.form-me.com)
│       ├── app/(dashboard)/    # Admin pages with sidebar
│       │   ├── trainings/      # Training CRUD
│       │   ├── sessions/       # Session management
│       │   ├── quotes/         # Quote management
│       │   ├── users/          # User management
│       │   ├── support-groups/ # Support groups
│       │   └── docs/           # PDF generation
│       ├── app/auth/           # Auth pages (signin, error)
│       ├── app/api/            # Admin API routes
│       ├── components/
│       │   ├── ui/             # shadcn/ui components
│       │   └── layout/         # Sidebar, Header
│       └── public/
│           ├── fonts/          # Sora, Satoshi fonts
│           └── logo/           # Logo assets
│
├── packages/
│   ├── database/               # @form-me/database (Prisma)
│   ├── auth/                   # @form-me/auth (NextAuth config)
│   ├── types/                  # @form-me/types (TypeScript types)
│   ├── storage/                # @form-me/storage (Supabase)
│   └── email/                  # @form-me/email (Resend)
│
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml         # pnpm workspace config
└── package.json                # Root scripts
```

### User Separation

```
┌─────────────────────────────────────────────────────────────────┐
│                    Base de donnees unique                       │
│                                                                 │
│  Table User: role = ADMIN | LEARNER | CLIENT                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│  admin.form-me.com    │       │    form-me.com        │
│                       │       │                       │
│  - Admins uniquement  │       │  - Site public        │
│  - Gestion formations │       │  - Catalogue          │
│  - Gestion sessions   │       │  - Demande de devis   │
│  - Gestion devis      │       │  - Dashboard stagiaire│
│  - Gestion users      │       │    (supports cours)   │
│  - PDF generation     │       │                       │
│                       │       │  Auth: LEARNER/CLIENT │
│  Auth: ADMIN only     │       │                       │
└───────────────────────┘       └───────────────────────┘
```

## Setup & Installation

### Prerequisites
- Node.js 20+
- pnpm 9.0+

### Environment Variables

```env
# Shared (same for both apps)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."
RESEND_API_KEY="..."

# Web app (root .env.local for now)
NEXTAUTH_URL="https://form-me.com"
NEXTAUTH_SECRET="secret-web-unique"

# Admin app (apps/admin/.env.local)
NEXTAUTH_URL="https://admin.form-me.com"
NEXTAUTH_SECRET="secret-admin-unique"
```

### Installation

```bash
pnpm install
pnpm db:generate
pnpm db:push
pnpm dev
```

### Scripts

| Script | Command |
|--------|---------|
| Development (all) | `pnpm dev` |
| Development web only | `pnpm dev:web` |
| Development admin only | `pnpm dev:admin` |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Generate Prisma | `pnpm db:generate` |
| Push DB changes | `pnpm db:push` |
| Run migrations | `pnpm db:migrate` |
| Seed database | `pnpm db:seed` |

## Shared Packages

### @form-me/database

Prisma client and schema.

```typescript
import { prisma } from '@form-me/database';
import { User, Training, TrainingSession, Quote } from '@form-me/database';
```

**Key Models:**
- `User` - Users with roles (ADMIN, LEARNER, CLIENT)
- `Training` - Training courses with modules and objectives
- `TrainingSession` - Scheduled training sessions with recurrence
- `Quote` - Quote/contact requests linked to sessions
- `Category` - Training categories
- `Support` - Training support materials
- `SupportGroup` - Groups of learners for support access

### @form-me/auth

NextAuth configuration with role-based access.

```typescript
import { createAuthOptions, requireAdmin } from '@form-me/auth';

// In apps/admin/lib/auth.ts
export const authOptions = createAuthOptions({
  allowedRoles: ['ADMIN'],
  signInPage: '/auth/signin',
});

// In apps/web/lib/auth.ts
export const authOptions = createAuthOptions({
  allowedRoles: ['LEARNER', 'CLIENT'],
  signInPage: '/auth/signin',
});
```

### @form-me/types

Shared TypeScript types.

```typescript
import type { Formation, FormationWithDetails } from '@form-me/types/formation';
import type { TrainingSession, CreateSessionInput } from '@form-me/types/session';
import type { Quote, QuoteStatus } from '@form-me/types/quote';
import type { User, UserRole } from '@form-me/types/user';
import type { Category, CategoryWithCount } from '@form-me/types/category';
```

### @form-me/storage

Supabase storage utilities.

```typescript
import { uploadFile, uploadPdf, deleteFile, getPublicUrl } from '@form-me/storage';
```

**Buckets:** formations, supports, templates, generated-docs

### @form-me/email

Resend email utilities.

```typescript
import { sendQuoteNotification, sendInvitation } from '@form-me/email';
```

## Admin App Features

### Design System
- **UI Framework:** shadcn/ui with Radix UI primitives
- **Typography:** Sora (headings), Satoshi (body) - same as main website
- **Theme:** Blue accent (#145eff) using OKLch color space
- **Components:** Located in `apps/admin/components/ui/`

### Training CRUD (`/trainings`)
- List with filters (status, category, search)
- Create/edit training with modules and objectives
- Status management (DRAFT → PUBLISHED → ARCHIVED)
- Duration, target audience, prerequisites, teaching methods

### Session Management (`/sessions`)
- Schedule training sessions
- Recurrence patterns (weekly, bi-weekly, monthly)
- Capacity and registration tracking
- Status: SCHEDULED, ONGOING, COMPLETED, CANCELLED
- Link sessions to quotes

### Quote Management (`/quotes`)
- View all quote requests
- Status workflow: received → contacted → processed → converted
- Link to training and session
- Statistics dashboard

### Existing Features
- User management with roles
- Support groups (learner access to materials)
- Support materials upload
- PDF document generation (conventions, attendance sheets)
- Email invitations

## API Routes

### Admin App (`admin.form-me.com`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/trainings` | Training CRUD |
| GET/PUT/DELETE | `/api/trainings/[id]` | Single training |
| PUT | `/api/trainings/[id]/objectives` | Manage objectives |
| PUT | `/api/trainings/[id]/modules` | Manage modules |
| GET/POST | `/api/sessions` | Session management |
| GET/PUT/DELETE | `/api/sessions/[id]` | Single session |
| POST | `/api/sessions/[id]/duplicate` | Duplicate session |
| GET | `/api/quotes` | List quotes |
| GET/DELETE | `/api/quotes/[id]` | Single quote |
| PUT | `/api/quotes/[id]/status` | Update status |
| GET | `/api/quotes/stats` | Quote statistics |
| GET | `/api/categories` | List categories |
| POST | `/api/upload` | File upload (Supabase) |
| POST | `/api/send-invitations` | Send user invitations |
| POST | `/api/docs/generate/convention` | Generate convention PDF |
| POST | `/api/docs/generate/emargement` | Generate attendance PDF |

### Web App (`form-me.com`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/formations` | List trainings |
| GET | `/api/formations/[slug]` | Training details |
| GET | `/api/categories` | List categories |
| POST | `/api/send-devis` | Submit quote request |
| GET | `/api/sessions/public` | Available sessions |

## Development

### Running Both Apps

```bash
pnpm dev
# Web: http://localhost:3000
# Admin: http://localhost:3001
```

### Database Changes

1. Edit `packages/database/prisma/schema.prisma`
2. Run `pnpm db:generate` to update client
3. Run `pnpm db:push` to apply changes

### Adding Components (Admin)

The admin app uses shadcn/ui. Components are in `apps/admin/components/ui/`.

```bash
cd apps/admin
pnpm dlx shadcn@latest add button card input ...
```

## Important Notes

### Conventions
- Use French for user-facing content
- Admin uses shadcn/ui components
- Web uses custom Tailwind components
- Fonts: Sora (headings), Satoshi (body)

### BigInt Handling

`Support.fileSize` uses BigInt:
```typescript
const fileSizeBigInt = fileSize ? BigInt(Math.floor(Number(fileSize))) : null;
```

### Authentication Separation

- Admin and web apps have separate auth secrets
- An admin cannot log in on the web app
- A learner/client cannot log in on the admin app

### Zod v4 Syntax

The project uses Zod v4. Key differences from v3:
```typescript
// Error messages
z.number({ error: "Message" })  // Not required_error

// ZodError
catch (error) {
  if (error instanceof z.ZodError) {
    return error.issues;  // Not error.errors
  }
}
```

### useSearchParams in Next.js 16+

Pages using `useSearchParams()` must be wrapped in Suspense:
```typescript
// page.tsx
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageContent />
    </Suspense>
  );
}

// page-content.tsx (client component)
"use client";
export function PageContent() {
  const searchParams = useSearchParams();
  // ...
}
```

### Ports

- Web app: 3000
- Admin app: 3001

## Recent Updates (Updated: 2026-01-28)

### Admin Backoffice Redesign
- New blue theme aligned with brand (#145eff)
- Custom typography with Sora/Satoshi fonts
- Redesigned dashboard with stat cards and recent activity
- Modern sidebar with tooltips and badges
- Header with breadcrumbs, search, and user dropdown
- Updated auth pages (signin, error) with Suspense boundaries

### Technical Fixes
- Added `@supabase/supabase-js` dependency
- Fixed Zod v4 syntax (`required_error` → `error`, `errors` → `issues`)
- Fixed Prisma model field names (`createdById` → `createdByUserId`)
- Added `payloadJson` to GeneratedDocument creation
- Removed non-existent `company` field from Quote (use `city` instead)
- Fixed `recurrencePattern` type casting for sessions

### Storage Migration
- Migrated from Cloudinary to Supabase Storage
- Upload routes now use Supabase buckets
- Storage service at `src/server/storage/supabase.ts`

### Structure Changes
- Admin app moved to `apps/admin/`
- Shared packages in `packages/`
- Web app still in root (migration pending)
