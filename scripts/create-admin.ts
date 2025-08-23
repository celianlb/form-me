import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@form-me.com';
  const password = 'admin123456'; // Changez ceci en production !
  
  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log('❌ Un administrateur avec cet email existe déjà');
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'admin
    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'System',
        role: 'ADMIN',
        isActive: true,
        mustChangePassword: false
      }
    });

    console.log('✅ Administrateur créé avec succès !');
    console.log('📧 Email:', email);
    console.log('🔑 Mot de passe:', password);
    console.log('⚠️  N\'oubliez pas de changer le mot de passe en production !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();