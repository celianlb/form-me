import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function createTestUser() {
  const email = 'test@example.com';
  const password = 'test123456'; // Mot de passe simple pour les tests
  
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('❌ Un utilisateur avec cet email existe déjà');
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur test
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'LEARNER',
        isActive: true,
        mustChangePassword: false // Pas besoin de changer le mot de passe
      }
    });

    // Ajouter l'utilisateur au groupe de test existant
    const testGroup = await prisma.supportGroup.findFirst({
      where: { name: { contains: 'Excel' } }
    });

    if (testGroup) {
      await prisma.supportGroupMember.create({
        data: {
          groupId: testGroup.id,
          userId: user.id,
          status: 'ACTIVE' // Directement actif
        }
      });
    }

    console.log('✅ Utilisateur test créé avec succès !');
    console.log('📧 Email:', email);
    console.log('🔑 Mot de passe:', password);
    console.log('⚡ Pas besoin de changer le mot de passe');
    
    if (testGroup) {
      console.log('👥 Ajouté au groupe de test');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();