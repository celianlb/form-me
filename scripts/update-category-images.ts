/**
 * Script pour mettre à jour les images des catégories
 * Usage: pnpm tsx scripts/update-category-images.ts
 */

import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const categoryImages: Record<string, string> = {
  "caces-autorisations-conduite": "https://images.unsplash.com/photo-1620388640785-892616248ec8?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "electricite-habilitations": "https://images.unsplash.com/photo-1635335874521-7987db781153?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "prevention-sante-securite": "https://images.pexels.com/photos/28271058/pexels-photo-28271058.jpeg",
  "securite-incendie-surete": "https://images.unsplash.com/photo-1560517734-124ebe0ad826?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "travail-hauteur-levage": "https://images.unsplash.com/photo-1530639834082-05bafb67fbbe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

async function updateCategoryImages() {
  console.log('Mise à jour des images des catégories...\n');

  for (const [slug, imageUrl] of Object.entries(categoryImages)) {
    try {
      const result = await prisma.category.update({
        where: { slug },
        data: { imageUrl },
      });
      console.log(`✅ ${result.name}: image mise à jour`);
    } catch (error) {
      console.log(`❌ Catégorie "${slug}" non trouvée`);
    }
  }

  console.log('\n✅ Mise à jour terminée !');
}

updateCategoryImages()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
