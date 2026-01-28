import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

/**
 * Script de consolidation des catégories
 *
 * Objectif : Réorganiser toutes les formations en 6 blocs principaux
 * avec les bonnes images et supprimer les doublons
 */

// Les 6 blocs de catégories finaux
const FINAL_CATEGORIES = [
  {
    name: "Travail en hauteur & levage",
    slug: "travail-hauteur-levage",
    description: "Formations pour le travail en hauteur, utilisation des EPI antichute, échafaudages et levage",
    imageUrl: "https://images.unsplash.com/photo-1530639834082-05bafb67fbbe?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Prévention, santé & sécurité au travail",
    slug: "prevention-sante-securite",
    description: "Formations en prévention des risques professionnels, santé et sécurité au travail",
    imageUrl: "https://images.pexels.com/photos/28271058/pexels-photo-28271058.jpeg",
  },
  {
    name: "Électricité & habilitations électriques",
    slug: "electricite-habilitations",
    description: "Formations aux habilitations électriques et interventions sur installations électriques",
    imageUrl: "https://images.unsplash.com/photo-1635335874521-7987db781153?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "CACES & autorisations de conduite",
    slug: "caces-autorisations-conduite",
    description: "Certifications CACES et autorisations de conduite d'engins",
    imageUrl: "https://images.unsplash.com/photo-1620388640785-892616248ec8?q=80&w=2071&auto=format&fit=crop",
  },
  {
    name: "Sécurité incendie & sûreté",
    slug: "securite-incendie-surete",
    description: "Formations à la sécurité incendie, manipulation des extincteurs et SSIAP",
    imageUrl: "https://images.unsplash.com/photo-1560517734-124ebe0ad826?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Digital, Web & développement",
    slug: "digital-web-developpement",
    description: "Formations aux réseaux sociaux, marketing digital, Web3, IA et développement personnel",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
  },
];

// Mapping des formations vers leur catégorie finale (par slug de formation)
const FORMATION_TO_CATEGORY: Record<string, string> = {
  // BLOC A - Travail en hauteur & levage
  "travail-en-hauteur-harnais-pirl-filets": "travail-hauteur-levage",
  "echafaudage-roulant-utilisateur-monteur-demonteur-verificateur": "travail-hauteur-levage",
  "echafaudage-fixe-utilisateur-monteur-demonteur-verificateur": "travail-hauteur-levage",
  "module-port-du-harnais-utilisation-des-epi-antichute": "travail-hauteur-levage",
  "module-pirl-plateforme-individuelle-roulante-legere": "travail-hauteur-levage",
  "module-filet-de-securite-protection-collective-contre-les-chutes": "travail-hauteur-levage",
  "levage-chef-de-manuvre-elingueur": "travail-hauteur-levage",
  "chef-de-manuvre-direction-des-operations-de-levage": "travail-hauteur-levage",
  "elingage-techniques-delingage-et-securite-des-operations-de-levage": "travail-hauteur-levage",
  "travail-en-hauteur": "travail-hauteur-levage",
  "utilisation-des-epi-antichute": "travail-hauteur-levage",
  "echafaudage-roulant": "travail-hauteur-levage",
  "differencier-echafaudage-roulant-fixe": "travail-hauteur-levage",

  // BLOC B - Prévention, santé & sécurité
  "sst-sauveteur-secouriste-du-travail": "prevention-sante-securite",
  "mac-sst-maintien-et-actualisation-des-competences-sst": "prevention-sante-securite",
  "gestes-et-postures": "prevention-sante-securite",
  "prap-ibc-prevention-des-risques-lies-a-lactivite-physique-industrie-btp-commerce": "prevention-sante-securite",
  "prap-2s-prevention-des-risques-lies-a-lactivite-physique-sanitaire-et-social": "prevention-sante-securite",
  "aipr-autorisation-dintervention-a-proximite-des-reseaux": "prevention-sante-securite",
  "atex-niveau-0-sensibilisation-aux-atmospheres-explosives": "prevention-sante-securite",
  "habilitation-mecanique-m0m1m2mr": "prevention-sante-securite",
  "n1-risques-chimiques-niveau-1": "prevention-sante-securite",
  "mac-sst": "prevention-sante-securite",
  "prap-ibc": "prevention-sante-securite",
  "habilitation-mecanique": "prevention-sante-securite",
  "formation-n1-en1-risques-industriels": "prevention-sante-securite",

  // BLOC C - Électricité & habilitations électriques
  "habilitation-electrique-h0-b0-h0v": "electricite-habilitations",
  "habilitation-electrique-bs-be-manuvre": "electricite-habilitations",
  "habilitation-electrique-b1-executant-electricien-basse-tension": "electricite-habilitations",
  "habilitation-electrique-b2-charge-de-travaux-basse-tension": "electricite-habilitations",
  "habilitation-electrique-bchc-charge-de-consignation-bt-ht": "electricite-habilitations",
  "habilitation-electrique-br-interventions-generales-en-basse-tension": "electricite-habilitations",
  "habilitation-electrique-bp-interventions-sur-installations-photovoltaiques": "electricite-habilitations",
  "habilitation-electrique-bfhf-travaux-en-fouilles-a-proximite-douvrages-electriques": "electricite-habilitations",
  "habilitation-electrique-h1-executant-electricien-haute-tension": "electricite-habilitations",
  "habilitation-electrique-h2-charge-de-travaux-haute-tension": "electricite-habilitations",
  "b1-b1v": "electricite-habilitations",
  "b2-b2v": "electricite-habilitations",
  "br": "electricite-habilitations",
  "bc": "electricite-habilitations",
  "bp": "electricite-habilitations",
  "bf": "electricite-habilitations",
  "hf": "electricite-habilitations",
  "hc": "electricite-habilitations",
  "recyclages-habilitations-electriques": "electricite-habilitations",

  // BLOC D - CACES & autorisations de conduite
  "caces-r484-ponts-roulants-et-portiques": "caces-autorisations-conduite",
  "caces-r485-gerbeurs-a-conducteur-accompagnant": "caces-autorisations-conduite",
  "caces-r489-chariots-automoteurs-de-manutention-a-conducteur-porte": "caces-autorisations-conduite",
  "caces-r490-grues-de-chargement": "caces-autorisations-conduite",
  "caces-r486-pemp-nacelles": "caces-autorisations-conduite",
  "caces-r482-engins-de-chantier": "caces-autorisations-conduite",
  "caces-r489-chariots-elevateurs": "caces-autorisations-conduite",

  // BLOC E - Sécurité incendie & sûreté
  "formation-incendie-epi-equipier-de-premiere-intervention": "securite-incendie-surete",
  "manipulation-des-extincteurs": "securite-incendie-surete",
  "evacuation-incendie-guide-file-serre-file": "securite-incendie-surete",
  "ssiap-1-agent-de-service-de-securite-incendie-et-dassistance-a-personnes": "securite-incendie-surete",
  "ssiap-2-chef-dequipe-de-service-de-securite-incendie": "securite-incendie-surete",
  "ssiap-1": "securite-incendie-surete",
  "formation-incendie-epi": "securite-incendie-surete",
  "evacuation-guide-file-serre-file": "securite-incendie-surete",

  // BLOC F - Formation de formateurs (à garder séparé ou intégrer selon besoin)
  "f0-devenir-formateur-professionnel-en-prevention-securite-et-reglementation": "digital-web-developpement",
  "f-a-devenir-formateur-en-travail-en-hauteur-equipements": "digital-web-developpement",
  "f-b-devenir-formateur-en-prevention-sante-securite": "digital-web-developpement",
};

// Catégories à supprimer après migration (les anciennes)
const CATEGORIES_TO_DELETE = [
  "aipr",
  "atex",
  "caces-autorisation-de-conduite",
  "elingage",
  "gestes-postures",
  "habilitations-electriques",
  "habilitations-mecaniques",
  "risques-chimiques",
  "sauveteurs-secouristes-au-travail",
  "travaux-en-hauteur-echafaudages",
  "formation-de-formateurs",
];

async function main() {
  console.log("🔧 CONSOLIDATION DES CATÉGORIES\n");
  console.log("=".repeat(50));

  // Étape 1 : Créer/mettre à jour les 6 catégories finales
  console.log("\n📁 Étape 1 : Création/mise à jour des 6 catégories finales...\n");

  const categoryIds: Record<string, number> = {};

  for (const cat of FINAL_CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl: cat.imageUrl,
      },
    });
    categoryIds[cat.slug] = category.id;
    console.log(`  ✅ ${cat.name} (ID: ${category.id})`);
  }

  // Étape 2 : Migrer toutes les formations vers les bonnes catégories
  console.log("\n🔄 Étape 2 : Migration des formations...\n");

  const allTrainings = await prisma.training.findMany({
    include: { category: true }
  });

  let migratedCount = 0;
  let skippedCount = 0;

  for (const training of allTrainings) {
    const targetCategorySlug = FORMATION_TO_CATEGORY[training.slug];

    if (targetCategorySlug && categoryIds[targetCategorySlug]) {
      const targetCategoryId = categoryIds[targetCategorySlug];

      if (training.categoryId !== targetCategoryId) {
        await prisma.training.update({
          where: { id: training.id },
          data: { categoryId: targetCategoryId }
        });
        console.log(`  ✅ "${training.title}" → ${targetCategorySlug}`);
        migratedCount++;
      } else {
        skippedCount++;
      }
    } else {
      // Formation non mappée - essayer de deviner par le titre
      const titleLower = training.title.toLowerCase();
      let guessedCategory: string | null = null;

      if (titleLower.includes('caces') || titleLower.includes('chariot') || titleLower.includes('gerbeur') || titleLower.includes('nacelle') || titleLower.includes('engin')) {
        guessedCategory = 'caces-autorisations-conduite';
      } else if (titleLower.includes('habilitation') && (titleLower.includes('électrique') || titleLower.includes('electrique'))) {
        guessedCategory = 'electricite-habilitations';
      } else if (titleLower.includes('sst') || titleLower.includes('secouriste') || titleLower.includes('prap') || titleLower.includes('gestes') || titleLower.includes('postures') || titleLower.includes('aipr') || titleLower.includes('atex') || titleLower.includes('mécanique') || titleLower.includes('chimique')) {
        guessedCategory = 'prevention-sante-securite';
      } else if (titleLower.includes('incendie') || titleLower.includes('extincteur') || titleLower.includes('évacuation') || titleLower.includes('ssiap') || titleLower.includes('serre-file') || titleLower.includes('guide-file')) {
        guessedCategory = 'securite-incendie-surete';
      } else if (titleLower.includes('hauteur') || titleLower.includes('échafaudage') || titleLower.includes('harnais') || titleLower.includes('élingage') || titleLower.includes('levage') || titleLower.includes('manoeuvre') || titleLower.includes('manœuvre') || titleLower.includes('pirl') || titleLower.includes('filet')) {
        guessedCategory = 'travail-hauteur-levage';
      } else if (titleLower.includes('formateur') || titleLower.includes('digital') || titleLower.includes('web')) {
        guessedCategory = 'digital-web-developpement';
      }

      if (guessedCategory && categoryIds[guessedCategory]) {
        const targetCategoryId = categoryIds[guessedCategory];
        if (training.categoryId !== targetCategoryId) {
          await prisma.training.update({
            where: { id: training.id },
            data: { categoryId: targetCategoryId }
          });
          console.log(`  🔍 "${training.title}" → ${guessedCategory} (deviné)`);
          migratedCount++;
        } else {
          skippedCount++;
        }
      } else {
        console.log(`  ⚠️  "${training.title}" - catégorie non trouvée (slug: ${training.slug})`);
      }
    }
  }

  console.log(`\n  📊 ${migratedCount} formations migrées, ${skippedCount} déjà en place`);

  // Étape 3 : Supprimer les doublons de formations (garder les PUBLISHED)
  console.log("\n🗑️  Étape 3 : Suppression des formations en double (DRAFT)...\n");

  // Supprimer les formations en DRAFT qui ont un équivalent PUBLISHED
  const drafts = await prisma.training.findMany({
    where: { status: 'DRAFT' }
  });

  let deletedDrafts = 0;
  for (const draft of drafts) {
    // Vérifier s'il existe une version publiée similaire
    const similar = await prisma.training.findFirst({
      where: {
        status: 'PUBLISHED',
        categoryId: draft.categoryId,
        title: { contains: draft.title.split(' ')[0], mode: 'insensitive' }
      }
    });

    if (similar) {
      await prisma.trainingModule.deleteMany({ where: { trainingId: draft.id } });
      await prisma.trainingObjective.deleteMany({ where: { trainingId: draft.id } });
      await prisma.training.delete({ where: { id: draft.id } });
      console.log(`  ✅ Supprimé doublon: "${draft.title}"`);
      deletedDrafts++;
    }
  }

  console.log(`\n  📊 ${deletedDrafts} doublons supprimés`);

  // Étape 4 : Supprimer les anciennes catégories vides
  console.log("\n🗑️  Étape 4 : Suppression des anciennes catégories vides...\n");

  for (const slug of CATEGORIES_TO_DELETE) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { trainings: true } } }
    });

    if (category) {
      if (category._count.trainings === 0) {
        await prisma.category.delete({ where: { slug } });
        console.log(`  ✅ Supprimé: "${category.name}"`);
      } else {
        console.log(`  ⚠️  "${category.name}" a encore ${category._count.trainings} formations - non supprimé`);
      }
    }
  }

  // Étape 5 : Résumé final
  console.log("\n" + "=".repeat(50));
  console.log("📊 RÉSUMÉ FINAL\n");

  const finalCategories = await prisma.category.findMany({
    include: {
      trainings: {
        where: { isActive: true, status: 'PUBLISHED' }
      }
    },
    orderBy: { name: 'asc' }
  });

  for (const cat of finalCategories) {
    const hasImage = cat.imageUrl ? '🖼️' : '⬜';
    console.log(`${hasImage} ${cat.name}: ${cat.trainings.length} formations`);
  }

  console.log("\n✅ Consolidation terminée!");
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
