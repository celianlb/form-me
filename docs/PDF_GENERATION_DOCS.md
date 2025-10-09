# Système de Génération de Documents PDF

Ce système permet de générer des **Conventions** et des **Feuilles d'Émargement** au format PDF depuis un back-office admin.

## 📋 Fonctionnalités

### Convention
- **1 PDF unique** par convention
- Contient: société, représentant, formation, objectifs, dates/horaires, effectif, tarification
- Calcul automatique: `tarif_journalier × nb_jours_uniques`

### Émargement
- **1 PDF par session** (date + créneaux matin/après-midi)
- Gestion des journées entières ou créneaux horaires spécifiques
- Groupement par batch pour traçabilité

## 🔧 Stack Technique

- **Next.js 15** (App Router)
- **Prisma 6** + PostgreSQL (Neon)
- **pdf-lib** pour génération PDF (mode OVERLAY)
- **Cloudinary** pour stockage templates + PDFs générés
- **Zod** pour validation
- **Zustand** pour état UI (Stepper)
- **shadcn/ui** + Tailwind v4

## 📦 Installation

### 1. Variables d'environnement

Ajouter dans `.env`:

```bash
# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Templates PDF (public_ids Cloudinary)
CONVENTION_TEMPLATE_PUBLIC_ID=pdf-templates/convention_template
EMARGEMENT_TEMPLATE_PUBLIC_ID=pdf-templates/emargement_template
```

### 2. Base de données

```bash
# Appliquer les migrations
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate
```

### 3. Upload des templates

1. Uploader vos templates PDF vides vers Cloudinary dans le folder `pdf-templates/`
2. Noter les `public_id` et les ajouter dans `.env`

## 🚀 Utilisation

### Interface Admin

1. **Accéder au back-office** : `/admin/docs`
   - Nécessite rôle `ADMIN`
   - Liste tous les documents générés

2. **Générer un document** : `/admin/docs/new`
   - **Step 1** : Choisir Convention ou Émargement
   - **Step 2** : Remplir le formulaire dynamique
   - **Step 3** : Révision des données
   - **Step 4** : Téléchargement des PDFs

### API

#### POST `/api/docs/generate/convention`

Body (JSON):
```json
{
  "societe": {
    "nom": "Ma Société",
    "siret": "12345678901234",
    "adresse": "123 Rue Test",
    "representantPrenom": "John",
    "representantNom": "Doe"
  },
  "formation": {
    "nom": "Formation SST",
    "objectifsOperationnels": ["Objectif 1", "Objectif 2"],
    "dureeHeures": 14,
    "lieu": "Paris"
  },
  "datesEtHoraires": [
    {
      "dateISO": "2025-01-15T00:00:00Z",
      "debutISO": "2025-01-15T09:00:00Z",
      "finISO": "2025-01-15T17:00:00Z"
    }
  ],
  "effectif": [
    {
      "prenom": "Alice",
      "nom": "Martin",
      "dateNaissanceISO": "1990-05-20T00:00:00Z"
    }
  ],
  "tarifJournalierEUR": 500
}
```

Response:
```json
{
  "documentId": "clxxx",
  "pdfUrl": "https://res.cloudinary.com/..."
}
```

#### POST `/api/docs/generate/emargement`

Body (JSON):
```json
{
  "formationNom": "Formation SST",
  "organismeNom": "Mon Organisme",
  "lieu": "Paris",
  "formateur": {
    "prenom": "Marie",
    "nom": "Dupont"
  },
  "sessions": [
    {
      "dateISO": "2025-01-15T00:00:00Z",
      "journeeEntiere": true,
      "matin": {
        "debutISO": "2025-01-15T09:00:00Z",
        "finISO": "2025-01-15T12:30:00Z"
      },
      "apresMidi": {
        "debutISO": "2025-01-15T14:00:00Z",
        "finISO": "2025-01-15T17:30:00Z"
      }
    }
  ]
}
```

Response:
```json
{
  "batchId": "clxxx",
  "documents": [
    {
      "documentId": "clyyy",
      "pdfUrl": "https://res.cloudinary.com/...",
      "label": "Émargement - 15/01/2025 Journée"
    }
  ]
}
```

## 🎨 Coordonnées des Champs

Les coordonnées des champs PDF sont définies dans `src/server/pdf/docs/coordinates.ts`.

**Format PDF** : Origine en bas-gauche, unités en points (1pt ≈ 0.35mm)
**Page A4 portrait** : ~595 × 842 points

### Ajuster les coordonnées

1. Ouvrir `src/server/pdf/docs/coordinates.ts`
2. Modifier les valeurs `x`, `y`, `fontSize` selon votre template
3. Tester avec un document réel

Exemple :
```typescript
'societe.nom': { pageIndex: 0, x: 100, y: 750, fontSize: 12 },
```

## 🧪 Tests

```bash
# Installer Vitest (si pas déjà fait)
npm install -D vitest

# Lancer les tests
npm run test src/server/pdf/docs/__tests__/
```

Tests inclus :
- ✅ Génération Convention avec données valides
- ✅ Rejet si champs requis manquants
- ✅ Upload Cloudinary
- ✅ Persistance en base

## 🔒 Sécurité

- **Routes `/admin/**`** : Protégées par middleware (rôle ADMIN requis)
- **API** : Vérification authentification + rôle dans chaque route handler
- **Validation** : Zod pour tous les inputs (côté API)
- **Sanitization** : `.trim()` sur toutes les strings avant dessin PDF

## 📝 Modèles Prisma

```prisma
model GeneratedDocument {
  id              String       @id @default(cuid())
  kind            DocumentKind // CONVENTION | EMARGEMENT
  createdByUserId Int
  payloadJson     Json
  pdfUrl          String
  cloudinaryPublicId String?
  batchId         String?      // Pour grouper les émargements
  createdAt       DateTime     @default(now())
}

model DocumentBatch {
  id              String   @id @default(cuid())
  kind            DocumentKind
  createdByUserId Int
  count           Int      // Nombre de documents dans le batch
  createdAt       DateTime @default(now())
  documents       GeneratedDocument[]
}
```

## ⚠️ Limitations MVP

1. **Coordonnées hardcodées** : Ajuster manuellement dans `coordinates.ts`
2. **Pas de preview live** : Génération directe sans aperçu
3. **Overflow tables** : Si trop de lignes, pas de gestion auto de nouvelle page
4. **1 seul gabarit** par type de document
5. **Pas de signature électronique** : Signatures manuelles sur PDF imprimé

## 🛠️ Améliorations Futures

- [ ] Interface visuelle pour placer les champs (drag & drop sur preview PDF)
- [ ] Support multi-gabarits (choisir le template à la volée)
- [ ] Gestion automatique overflow (duplication de pages)
- [ ] Export Excel/CSV des métadonnées
- [ ] Historique des versions d'un document
- [ ] Intégration signature électronique (DocuSign, etc.)
- [ ] Envoi par email automatique après génération

## 📞 Support

Pour ajuster les coordonnées ou ajouter des champs :
1. Consulter `src/server/pdf/docs/coordinates.ts`
2. Modifier les services `generateConvention.ts` ou `generateEmargement.ts`
3. Tester avec données réelles

---

**Architecture** : Staff engineer Next.js
**DX First** : Types stricts, validation Zod, erreurs explicites
**Zero any** : TypeScript strict mode activé partout
