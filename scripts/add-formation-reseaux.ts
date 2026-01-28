import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Trouver la catégorie Digital Business
  const category = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: 'digital-business' },
        { name: { contains: 'Digital', mode: 'insensitive' } },
      ],
    },
  });

  if (!category) {
    console.error('❌ Catégorie Digital Business non trouvée');
    process.exit(1);
  }

  console.log(`✓ Catégorie trouvée: ${category.name} (ID: ${category.id})`);

  // Créer la formation
  const formation = await prisma.training.create({
    data: {
      categoryId: category.id,
      title: 'Formation Réseaux : Deviens une Référence sur les Réseaux Sociaux',
      slug: 'formation-reseaux-sociaux-reference',
      shortDescription:
        'Apprends à te rendre visible, à créer de l\'impact et à bâtir une image forte qui attire naturellement clients et opportunités.',
      longDescription: `Cette formation complète t'accompagne pas à pas pour construire une stratégie de présence en ligne efficace, authentique et durable.
Tu découvriras comment passer de simple utilisateur à véritable référence dans ton domaine grâce à une méthode structurée en trois niveaux de progression.`,

      durationHours: 4,
      durationDays: null,

      targetAudience: `• Aux entrepreneurs, freelances et formateurs qui veulent se démarquer.
• À ceux qui souhaitent attirer plus de clients grâce à leur image en ligne.
• À toute personne prête à passer au niveau supérieur sur les réseaux sociaux.`,

      learningObjectives: `À la fin de cette formation, tu sauras exactement comment bâtir ton image, attirer ton audience idéale et transformer ta visibilité en opportunités concrètes.
Tu ne subiras plus les réseaux : tu les maîtriseras.`,

      isActive: true,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  console.log(`✓ Formation créée: ${formation.title} (ID: ${formation.id})`);

  // Créer les modules
  const modules = [
    {
      title: 'Savoir où aller',
      order: 1,
      type: 'THEORETICAL',
      content: `Avant de te lancer, tu apprendras à définir une vision claire, alignée sur tes objectifs professionnels et personnels. Tu comprendras ce qui te différencie et comment orienter ta communication pour atteindre la bonne audience.`,
    },
    {
      title: 'Le Personal Branding',
      order: 2,
      type: 'THEORETICAL',
      content: `Découvre l'art de construire une marque personnelle forte : ton identité, ton style, ton message. Apprends à incarner ton expertise pour inspirer confiance et crédibilité.`,
    },
    {
      title: 'Niveau 1 — Se rendre visible et augmenter ses vues',
      order: 3,
      type: 'PRACTICAL',
      content: `Les techniques concrètes pour booster ta visibilité : algorithmes, formats performants, stratégies de publication et outils pour développer ton audience rapidement.`,
    },
    {
      title: 'Niveau 2 — Créer de l\'impact',
      order: 4,
      type: 'PRACTICAL',
      content: `Apprends à créer du contenu qui capte l'attention, provoque l'émotion et fait réagir. Tu comprendras comment transformer ta présence en ligne en véritable levier d'influence.`,
    },
    {
      title: 'Niveau 3 — Devenir une référence',
      order: 5,
      type: 'PRACTICAL',
      content: `Le stade ultime : construire une communauté engagée, développer ton autorité et faire de ton nom une référence incontournable dans ton secteur.`,
    },
  ];

  for (const module of modules) {
    await prisma.trainingModule.create({
      data: {
        trainingId: formation.id,
        ...module,
      },
    });
    console.log(`  ✓ Module ${module.order}: ${module.title}`);
  }

  console.log('\n✅ Formation créée avec succès !');
  console.log(`   URL: https://form-me.fr/formations/${formation.slug}`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
