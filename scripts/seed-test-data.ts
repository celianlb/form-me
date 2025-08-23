import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function seedTestData() {
  try {
    console.log('🌱 Création de données de test...');

    // Vérifier qu'on a au moins une formation
    let training = await prisma.training.findFirst({
      where: { isActive: true, status: 'PUBLISHED' }
    });

    if (!training) {
      // Créer une catégorie de test
      let category = await prisma.category.findFirst();
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: 'Bureautique',
            slug: 'bureautique',
            description: 'Formations en bureautique'
          }
        });
      }

      // Créer une formation de test
      training = await prisma.training.create({
        data: {
          categoryId: category.id,
          title: 'Excel Avancé',
          slug: 'excel-avance',
          shortDescription: 'Maîtrisez les fonctions avancées d\'Excel',
          longDescription: 'Formation complète pour maîtriser les fonctions avancées d\'Excel : tableaux croisés dynamiques, macros, etc.',
          durationHours: 14,
          durationDays: 2,
          minParticipants: 4,
          maxParticipants: 10,
          successRate: 95.5,
          targetAudience: 'Utilisateurs intermédiaires d\'Excel',
          learningObjectives: 'À l\'issue de la formation, vous serez capable de créer des tableaux croisés dynamiques complexes',
          prerequisites: 'Connaissance de base d\'Excel',
          priceExclTax: 890.00,
          availableInCenter: true,
          availableElearning: true,
          isActive: true,
          status: 'PUBLISHED'
        }
      });

      console.log('✅ Formation de test créée:', training.title);
    }

    // Créer quelques supports de test
    const existingSupports = await prisma.support.count({
      where: { trainingId: training.id }
    });

    if (existingSupports === 0) {
      await prisma.support.createMany({
        data: [
          {
            trainingId: training.id,
            type: 'pdf',
            title: 'Manuel de formation Excel Avancé',
            description: 'Guide complet des fonctions avancées',
            fileUrl: 'https://example.com/excel-manuel.pdf',
            fileSize: 2048000, // 2MB
            isActive: true
          },
          {
            trainingId: training.id,
            type: 'pptx',
            title: 'Présentation - Tableaux croisés dynamiques',
            description: 'Support de présentation sur les TCD',
            fileUrl: 'https://example.com/tcd-presentation.pptx',
            fileSize: 1536000, // 1.5MB
            isActive: true
          },
          {
            trainingId: training.id,
            type: 'xlsx',
            title: 'Exercices pratiques',
            description: 'Fichier d\'exercices pour s\'entraîner',
            fileUrl: 'https://example.com/exercices.xlsx',
            fileSize: 512000, // 500KB
            isActive: true
          },
          {
            trainingId: training.id,
            type: 'link',
            title: 'Ressources complémentaires Microsoft',
            description: 'Liens vers la documentation officielle',
            fileUrl: 'https://support.microsoft.com/fr-fr/excel',
            isActive: true
          }
        ]
      });

      console.log('✅ Supports de formation créés');
    }

    // Créer des utilisateurs de test
    const testUsers = [
      { email: 'jean.dupont@example.com', firstName: 'Jean', lastName: 'Dupont' },
      { email: 'marie.martin@example.com', firstName: 'Marie', lastName: 'Martin' },
      { email: 'pierre.durand@example.com', firstName: 'Pierre', lastName: 'Durand' },
      { email: 'sophie.bernard@example.com', firstName: 'Sophie', lastName: 'Bernard' }
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      let user = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            ...userData,
            role: 'LEARNER',
            mustChangePassword: true,
            isActive: true
          }
        });
        console.log('✅ Utilisateur créé:', user.email);
      }
      createdUsers.push(user);
    }

    // Créer un groupe de test
    const existingGroup = await prisma.supportGroup.findFirst({
      where: { trainingId: training.id }
    });

    if (!existingGroup) {
      const adminUser = await prisma.user.findUnique({
        where: { email: 'admin@form-me.com' }
      });

      const testGroup = await prisma.supportGroup.create({
        data: {
          name: 'Groupe Excel ACME Corp - Janvier 2025',
          companyName: 'ACME Corporation',
          trainingDate: new Date('2025-01-15'),
          trainingId: training.id,
          createdById: adminUser?.id,
          isActive: true
        }
      });

      // Ajouter les utilisateurs au groupe
      for (const user of createdUsers) {
        await prisma.supportGroupMember.create({
          data: {
            groupId: testGroup.id,
            userId: user.id,
            status: 'INVITED'
          }
        });
      }

      console.log('✅ Groupe de support créé avec', createdUsers.length, 'membres');
    }

    console.log('🎉 Données de test créées avec succès !');
    console.log('\n📋 Résumé:');
    console.log(`- Formation: ${training.title}`);
    console.log(`- ${testUsers.length} utilisateurs de test créés`);
    console.log('- 1 groupe de support créé');
    console.log('- 4 supports de formation ajoutés');
    console.log('\n🔑 Pour tester:');
    console.log('- Admin: admin@form-me.com / admin123456');
    console.log('- Utilisateurs: jean.dupont@example.com, marie.martin@example.com, etc.');
    console.log('  (Ils recevront des invitations par email avec mot de passe temporaire)');

  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();