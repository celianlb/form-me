# Plan de Migration - Simplification des Formations

## Résumé des changements demandés

1. **Supprimer** les formations ONE et DSA (et tout le système APPLICATION)
2. **Retirer** du schéma : prix, nombre de stagiaires, lieu (site/distanciel)
3. **Ajouter** : photo de la formation (URL stockée sur Cloudinary)

---

## Phase 1 : Migration du Schéma Prisma

### Champs à supprimer du modèle `Training`

```prisma
// À SUPPRIMER
minParticipants Int?     @default(1)
maxParticipants Int?
pricePartnerPerDay       Decimal? @db.Decimal(10, 2)
priceNonPartnerPerTrainee Decimal? @db.Decimal(10, 2)
availableForPartners     Boolean  @default(false)
applicationType          ApplicationType @default(STANDARD)
availableInCenter        Boolean  @default(true)
availableElearning       Boolean  @default(false)
```

### Enum à supprimer

```prisma
enum ApplicationType {
  STANDARD
  APPLICATION
}
```

### Champ à ajouter

```prisma
imageUrl String? // URL Cloudinary de la photo de la formation
```

### Fichier de migration SQL attendu

```sql
-- Supprimer les formations ONE et DSA
DELETE FROM "Training" WHERE slug IN ('dsa-digital-success-academy', 'formation-one-ecole-digitale');

-- Supprimer les colonnes
ALTER TABLE "Training" DROP COLUMN "minParticipants";
ALTER TABLE "Training" DROP COLUMN "maxParticipants";
ALTER TABLE "Training" DROP COLUMN "pricePartnerPerDay";
ALTER TABLE "Training" DROP COLUMN "priceNonPartnerPerTrainee";
ALTER TABLE "Training" DROP COLUMN "availableForPartners";
ALTER TABLE "Training" DROP COLUMN "applicationType";
ALTER TABLE "Training" DROP COLUMN "availableInCenter";
ALTER TABLE "Training" DROP COLUMN "availableElearning";

-- Ajouter le champ image
ALTER TABLE "Training" ADD COLUMN "imageUrl" TEXT;

-- Supprimer l'enum (après avoir retiré la colonne qui l'utilise)
DROP TYPE "ApplicationType";
```

---

## Phase 2 : Mise à jour des Types TypeScript

### Fichiers à modifier

1. **types/formation.ts** - Retirer les champs supprimés, ajouter `imageUrl`
2. **types/formationDetails.ts** - Même chose

### Nouveau type Formation simplifié

```typescript
export interface Formation {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  durationHours?: number;
  durationDays?: number;
  imageUrl?: string; // NOUVEAU
  category: {
    name: string;
    slug: string;
  };
}

export interface FormationCardData {
  id: number;
  title: string;
  slug: string;
  duration?: number;
  durationDays?: number;
  imageUrl?: string; // NOUVEAU
  link?: string;
}
```

---

## Phase 3 : Mise à jour du Service Formations

### Fichier : services/formations.service.ts

- Retirer les champs supprimés des requêtes Prisma
- Ajouter `imageUrl` aux selects
- Supprimer la logique de transformation `location` et `capacity`

---

## Phase 4 : Mise à jour des Composants UI

### 1. FormationCard.tsx

**À supprimer :**
- `getLocationDisplay()` et `getLocationIcon()`
- `getCapacityDisplay()`
- Affichage du lieu (lignes 87-101)
- Affichage de la capacité (lignes 106-119)
- Affichage du prix (lignes 121-141)
- Logique `applicationType`

**À ajouter :**
- Affichage de l'image de formation (optionnel, avec placeholder si absent)

### 2. HeroSection.tsx (formations/[slug])

**À supprimer :**
- `getLocationDisplay()`
- `getParticipantsDisplay()`
- Import et utilisation de `ApplicationForm`
- Affichage du lieu (lignes 90-100)
- Affichage de la capacité (lignes 102-112)
- Affichage du prix (lignes 114-168)
- Logique conditionnelle `applicationType`

**À ajouter :**
- Affichage de l'image de formation

### 3. DevisForm.tsx

**À modifier :**
- Retirer le champ "Modalité" (sur site/distanciel)
- Retirer le champ "Nombre d'apprenants"

### 4. ApplicationForm.tsx

**À supprimer entièrement** (plus utilisé)

---

## Phase 5 : Mise à jour des Filtres

### Fichiers concernés

1. **utils/formationFilters.ts** - Supprimer le filtre `location`
2. **utils/filterConstants.ts** - Supprimer `homeLocationOptions`
3. **components/UI/FormationFilters.tsx** - Retirer le dropdown "Où ?"
4. **components/Home/SearchFormation.tsx** - Retirer le dropdown "Où ?"

---

## Phase 6 : Mise à jour du Seed

### Fichier : prisma/seed.ts

- Supprimer les entrées pour DSA et Formation ONE
- Retirer les champs supprimés des autres formations
- Ajouter des `imageUrl` par défaut (optionnel)

---

## Phase 7 : API & Admin

### Routes API à vérifier

1. **api/formations/route.ts** - Adapter les requêtes
2. **api/formations/[slug]/route.ts** - Adapter les requêtes
3. **api/send-devis/route.ts** - Retirer `mode` et `numberLearners`
4. **api/send-application/route.ts** - **Supprimer** (plus utilisé)

### Pages Admin (si existantes)

- Mettre à jour les formulaires d'édition de formation
- Ajouter un champ upload d'image utilisant Cloudinary

---

## Phase 8 : Nettoyage

### Fichiers à supprimer

- `app/(main)/formations/[slug]/ApplicationForm.tsx`
- Références à `TrainingMode` si plus utilisé

### Imports à nettoyer

Vérifier tous les fichiers pour les imports orphelins

---

## Ordre d'exécution recommandé

1. Créer la migration Prisma
2. Exécuter `prisma migrate dev`
3. Mettre à jour les types TypeScript
4. Mettre à jour le service formations
5. Mettre à jour les composants UI (FormationCard, HeroSection, DevisForm)
6. Supprimer ApplicationForm
7. Mettre à jour les filtres
8. Mettre à jour le seed
9. Nettoyer les APIs
10. Tester l'ensemble

---

## Risques et précautions

1. **Données perdues** : Les prix et capacités existants seront supprimés définitivement
2. **Backup recommandé** : Faire un export de la table Training avant migration
3. **Formations liées** : Vérifier que DSA et ONE n'ont pas de devis/supports liés avant suppression

---

## Tests à effectuer

- [ ] Page d'accueil avec les cards formations
- [ ] Page listing formations (/formations)
- [ ] Page catégorie (/formations/category/[slug])
- [ ] Page détail formation (/formations/[slug])
- [ ] Formulaire de devis (sans modalité ni nombre d'apprenants)
- [ ] Filtres de recherche (sans filtre lieu)
- [ ] Upload d'image pour une formation (admin)
