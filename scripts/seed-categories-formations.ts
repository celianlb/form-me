import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

/** simple slugify */
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

// Les 5 blocs de catégories avec leurs formations
const CATEGORY_BLOCKS = [
  {
    name: "Travail en hauteur & levage",
    slug: "travail-hauteur-levage",
    description: "Formations pour le travail en hauteur, utilisation des EPI antichute, échafaudages et levage",
    formations: [
      "Travail en hauteur",
      "Utilisation des EPI antichute",
      "Échafaudage roulant",
      "Échafaudage fixe (montage / utilisation / démontage)",
      "Élingueur",
      "Chef de manœuvre",
      "Différencier échafaudage roulant / fixe",
    ]
  },
  {
    name: "Prévention, santé & sécurité au travail",
    slug: "prevention-sante-securite",
    description: "Formations en prévention des risques professionnels, santé et sécurité au travail",
    formations: [
      "SST – Sauveteur Secouriste du Travail",
      "MAC SST",
      "Gestes & Postures",
      "PRAP IBC",
      "PRAP 2S",
      "AIPR",
      "ATEX niveau 0",
      "Habilitation mécanique",
      "Formation N1 (EN1 – risques industriels)",
    ]
  },
  {
    name: "Électricité & habilitations électriques",
    slug: "electricite-habilitations",
    description: "Formations aux habilitations électriques et interventions sur installations électriques",
    formations: [
      "H0 / B0 / H0V",
      "BS / BE Manœuvre",
      "B1 / B1V",
      "B2 / B2V",
      "BR",
      "BC",
      "BP",
      "BF",
      "HF",
      "HC",
      "Recyclages habilitations électriques",
    ]
  },
  {
    name: "CACES & autorisations de conduite",
    slug: "caces-autorisations-conduite",
    description: "Certifications CACES et autorisations de conduite d'engins",
    formations: [
      "CACES R489 — Chariots élévateurs",
      "CACES R485 — Gerbeurs automoteurs",
      "CACES R486 — Nacelles / PEMP",
      "CACES R484 — Ponts roulants / portiques",
      "CACES R482 — Engins de chantier",
      "CACES R490 — Grues auxiliaires",
    ]
  },
  {
    name: "Sécurité incendie & sûreté",
    slug: "securite-incendie-surete",
    description: "Formations à la sécurité incendie, manipulation des extincteurs et SSIAP",
    formations: [
      "Formation incendie (EPI)",
      "Manipulation des extincteurs",
      "Évacuation / guide-file / serre-file",
      "SSIAP 1",
      "SSIAP 2",
    ]
  },
];

// Mapping des anciennes catégories vers les nouveaux blocs
const CATEGORY_MAPPING: Record<string, string> = {
  // Bloc A - Travail en hauteur & levage
  "travaux-en-hauteur-echafaudages": "travail-hauteur-levage",
  "elingage": "travail-hauteur-levage",

  // Bloc B - Prévention, santé & sécurité
  "sauveteurs-secouristes-au-travail": "prevention-sante-securite",
  "gestes-postures": "prevention-sante-securite",
  "aipr": "prevention-sante-securite",
  "atex": "prevention-sante-securite",

  // Bloc C - Électricité
  "habilitations-electriques": "electricite-habilitations",

  // Bloc D - CACES
  "caces-autorisation-de-conduite": "caces-autorisations-conduite",
};

// Formations existantes à mapper vers les nouveaux titres
const TRAINING_TITLE_MAPPING: Record<string, string> = {
  "travail-en-hauteur-harnais-pirl-filets": "Travail en hauteur",
  "echafaudage-roulant-utilisateur-monteur-demonteur-verificateur": "Échafaudage roulant",
  "echafaudage-fixe-utilisateur-monteur-demonteur-verificateur": "Échafaudage fixe (montage / utilisation / démontage)",
  "levage-chef-de-manuvre-elingueur": "Chef de manœuvre",
  "sst-sauveteur-secouriste-du-travail": "SST – Sauveteur Secouriste du Travail",
  "gestes-et-postures": "Gestes & Postures",
  "aipr-autorisation-dintervention-a-proximite-des-reseaux": "AIPR",
  "atex-niveau-0-sensibilisation-aux-atmospheres-explosives": "ATEX niveau 0",
  "habilitation-electrique-h0-b0-h0v": "H0 / B0 / H0V",
  "habilitation-electrique-bs-be-manuvre": "BS / BE Manœuvre",
  "caces-r489-chariots-automoteurs-de-manutention-a-conducteur-porte": "CACES R489 — Chariots élévateurs",
  "caces-r485-gerbeurs-a-conducteur-accompagnant": "CACES R485 — Gerbeurs automoteurs",
  "caces-r486-pemp-nacelles": "CACES R486 — Nacelles / PEMP",
  "caces-r484-ponts-roulants-et-portiques": "CACES R484 — Ponts roulants / portiques",
  "caces-r482-engins-de-chantier": "CACES R482 — Engins de chantier",
  "caces-r490-grues-de-chargement": "CACES R490 — Grues auxiliaires",
};

async function main() {
  console.log("🌱 Réorganisation des catégories et formations...\n");

  // 1. Créer les nouvelles catégories
  console.log("📁 Création/mise à jour des catégories...");
  const categoryIds: Record<string, number> = {};

  for (const block of CATEGORY_BLOCKS) {
    const category = await prisma.category.upsert({
      where: { slug: block.slug },
      update: {
        name: block.name,
        description: block.description,
      },
      create: {
        name: block.name,
        slug: block.slug,
        description: block.description,
      },
    });
    categoryIds[block.slug] = category.id;
    console.log(`  ✅ ${block.name} (ID: ${category.id})`);
  }

  // 2. Migrer les formations existantes vers les nouvelles catégories
  console.log("\n🔄 Migration des formations existantes...");

  const existingTrainings = await prisma.training.findMany({
    include: { category: true }
  });

  for (const training of existingTrainings) {
    const oldCategorySlug = training.category.slug;
    const newCategorySlug = CATEGORY_MAPPING[oldCategorySlug];

    if (newCategorySlug && categoryIds[newCategorySlug]) {
      // Mettre à jour le titre si mappé
      const newTitle = TRAINING_TITLE_MAPPING[training.slug] || training.title;

      await prisma.training.update({
        where: { id: training.id },
        data: {
          categoryId: categoryIds[newCategorySlug],
          title: newTitle,
        },
      });
      console.log(`  ✅ "${training.title}" → catégorie "${newCategorySlug}"`);
    }
  }

  // 3. Créer les formations placeholder manquantes
  console.log("\n📝 Création des formations placeholder...");

  for (const block of CATEGORY_BLOCKS) {
    const categoryId = categoryIds[block.slug];

    for (const formationName of block.formations) {
      const slug = slugify(formationName);

      // Vérifier si la formation existe déjà (par titre ou slug similaire)
      const existing = await prisma.training.findFirst({
        where: {
          OR: [
            { slug },
            { title: { contains: formationName.split(' ')[0], mode: 'insensitive' } }
          ],
          categoryId,
        }
      });

      if (!existing) {
        // Vérifier si le slug existe ailleurs
        const slugExists = await prisma.training.findUnique({ where: { slug } });
        const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug;

        await prisma.training.create({
          data: {
            categoryId,
            title: formationName,
            slug: finalSlug,
            shortDescription: `Formation ${formationName} - Contenu à compléter`,
            longDescription: `Formation ${formationName}.\n\nLe contenu détaillé de cette formation sera ajouté prochainement.`,
            isActive: true,
            status: 'DRAFT', // En brouillon jusqu'à ce que le contenu soit ajouté
          },
        });
        console.log(`  ✅ Créé: "${formationName}" (DRAFT)`);
      } else {
        console.log(`  ⏭️  Existe déjà: "${formationName}"`);
      }
    }
  }

  // 4. Supprimer les anciennes catégories vides
  console.log("\n🗑️  Nettoyage des anciennes catégories vides...");

  const oldCategorySlugs = Object.keys(CATEGORY_MAPPING);
  for (const slug of oldCategorySlugs) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { trainings: true } } }
    });

    if (category && category._count.trainings === 0) {
      await prisma.category.delete({ where: { slug } });
      console.log(`  ✅ Supprimé: "${category.name}"`);
    }
  }

  // 5. Afficher le résumé
  console.log("\n📊 Résumé des catégories:");
  const finalCategories = await prisma.category.findMany({
    include: {
      _count: {
        select: { trainings: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  for (const cat of finalCategories) {
    const publishedCount = await prisma.training.count({
      where: {
        categoryId: cat.id,
        isActive: true,
        status: 'PUBLISHED'
      }
    });
    const draftCount = cat._count.trainings - publishedCount;
    console.log(`  📁 ${cat.name}: ${publishedCount} publiées, ${draftCount} brouillons`);
  }

  console.log("\n✅ Migration terminée!");
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
