# Changelog

All notable changes to Form Me will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-19

First stable release of Form Me - Training Management Platform.

### Added

#### Core Platform
- **Next.js 15** application with App Router and Turbopack
- **React 19** for modern UI development
- **TypeScript** strict mode configuration
- **Tailwind CSS v4** for styling
- **Prisma 6** ORM with PostgreSQL (Neon) database

#### Authentication & Authorization
- **NextAuth.js** JWT-based authentication system
- **Role-based access control** (ADMIN, LEARNER, CLIENT roles)
- Password change enforcement on first login
- Invite token system for user registration and password reset
- Protected routes via middleware

#### Training Management (Formations)
- Complete CRUD operations for training courses
- Training modules and objectives management
- Category-based organization with unique slugs
- Content status workflow (DRAFT, PUBLISHED, ARCHIVED)
- Pricing management (partner and non-partner rates)
- Public training catalog with filtering and search

#### PDF Document Generation
- **Convention PDF** generation for training agreements
- **Emargement (Attendance Sheet)** PDF generation
- OVERLAY mode text positioning via coordinates
- Cloudinary integration for template and document storage
- Batch document generation support
- Template management system with field definitions

#### Support Groups (Groupes de Support)
- Learner group management for training sessions
- Support material assignment (PDFs, videos, links)
- Manual access grants for learners
- Group membership tracking with status

#### Admin Dashboard
- User management interface
- Training statistics overview
- Document generation workflow (multi-step)
- Support group administration

#### Learner Dashboard
- Access to assigned training materials
- Support group membership view
- Training progress tracking

#### Public Pages
- Homepage with formations showcase
- Training catalog with category filtering
- Quote and contact form (Devis)
- Legal pages (mentions legales, privacy policy)
- Quality certifications page
- Career opportunities page (Nous rejoindre)

#### Email Integration
- **Resend** email service integration
- User invitation emails
- Quote/contact form notifications

#### SEO & Performance
- Dynamic sitemap generation
- robots.txt configuration
- Meta tags via `createMetadata()` helper
- Server Components by default
- Turbopack for development

#### UI Components
- Reusable UI component library (Button, Input, Card, Table, Badge, etc.)
- Form components with React Hook Form integration
- File upload with Cloudinary
- Date and time pickers
- Search and filter components

### Technical Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15.4.6 |
| UI Library | React 19.1.0 |
| Language | TypeScript 5 (strict) |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 6.16.2 |
| Auth | NextAuth.js 4.24.11 |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form 7.64 + Zod 4 |
| State | Zustand 5.0.8 |
| PDF | pdf-lib 1.17.1 |
| Storage | Cloudinary 2.7.0 |
| Email | Resend 6.0.1 |
| Notifications | Sonner 2.0.7 |

---

## Development History

### November 2025

#### 2025-11-08
- feat: Add new features for PDF generation, cleanup codebase and refactoring

### October 2025

#### 2025-10-12
- Mise a jour du style du composant BentoGrid
- Amelioration de la mise en page et de la logique d'affichage des sections

#### 2025-10-11
- Ajout de la gestion des metadonnees pour le referencement SEO
- Ajout de nouveaux composants et mises a jour de la logique d'affichage
- Refactor du composant RepeatableList
- Ajout de nouveaux composants UI (Label, Input, Textarea, Checkbox, RadioGroup, Select)

#### 2025-10-09
- Ajout de nouveaux champs de prix et d'un type d'application
- Ajout de la configuration TypeScript pour Prisma

#### 2025-10-08
- Mise a jour de l'adresse e-mail de contact
- Remplacement du texte par une image de logo

### August-September 2025

#### 2025-08-25
- Ajout d'une icone WhatsApp dans l'en-tete
- Mise a jour du lien "Contact" vers "Devis & Contact"
- Ajout d'un espacement de suivi pour le niveau de titre 2

#### 2025-08-24
- Ajout de nouvelles routes pour les politiques de confidentialite et les mentions legales
- Amelioration de la suppression des utilisateurs
- Ajout de cases a cocher pour le consentement marketing

#### 2025-08-23
- Ajout d'une image SVG dans le pied de page
- Correction de l'URL de la politique de confidentialite
- Mise a jour des liens de navigation

#### 2025-08-22
- Ajout de la bibliotheque Cloudinary
- Ajout du composant CTADevis
- Ajout de la gestion des categories dans le formulaire de devis
- Mise a jour des liens de navigation

#### 2025-08-17
- Initial commit from Create Next App
- Ajout de composants de page et d'interface pour la gestion des formations
- Integration de Prisma pour la gestion de la base de donnees
- Ajout des types de formation et des composants
- Ajout de l'authentification avec NextAuth
- Creation du tableau de bord admin
- Ajout des groupes de support
- Refactorisation des filtres de formation

---

## [Unreleased]

### Planned
- Multi-language support (i18n)
- Advanced reporting and analytics
- Training completion certificates
- Calendar integration
- Mobile application

---

[1.0.0]: https://github.com/celianlb/form-me/releases/tag/v1.0.0
[Unreleased]: https://github.com/celianlb/form-me/compare/v1.0.0...HEAD
