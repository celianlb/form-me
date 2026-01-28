import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

/**
 * Script pour mettre à jour les images des catégories avec des images Unsplash de haute qualité
 */

// Images sélectionnées sur Unsplash pour chaque catégorie
const CATEGORY_IMAGES: Record<string, string> = {
  // BLOC A - Travail en hauteur & levage
  // Image: Travailleur avec harnais de sécurité en hauteur
  "travail-hauteur-levage": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",

  // BLOC B - Prévention, santé & sécurité au travail
  // Image: Formation aux premiers secours / RCP
  "prevention-sante-securite": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",

  // BLOC C - Électricité & habilitations électriques
  // Image: Tableau électrique professionnel
  "electricite-habilitations": "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=2070&auto=format&fit=crop",

  // BLOC D - CACES & autorisations de conduite
  // Image: Chariot élévateur / Forklift en entrepôt
  "caces-autorisations-conduite": "https://images.unsplash.com/photo-1532635026-d12867005472?q=80&w=2070&auto=format&fit=crop",

  // BLOC E - Sécurité incendie & sûreté
  // Image: Extincteur rouge
  "securite-incendie-surete": "https://images.unsplash.com/photo-1625958936686-a9343dc35b5b?q=80&w=2070&auto=format&fit=crop",

  // BLOC F - Digital, Web & développement
  // Image: Atelier digital / ordinateur / formation tech
  "digital-web-developpement": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
};

async function main() {
  console.log("🖼️  Mise à jour des images des catégories...\n");

  for (const [slug, imageUrl] of Object.entries(CATEGORY_IMAGES)) {
    const category = await prisma.category.findUnique({
      where: { slug }
    });

    if (category) {
      await prisma.category.update({
        where: { slug },
        data: { imageUrl }
      });
      console.log(`✅ ${category.name}`);
      console.log(`   → ${imageUrl.substring(0, 60)}...`);
    } else {
      console.log(`⚠️  Catégorie non trouvée: ${slug}`);
    }
  }

  console.log("\n✅ Mise à jour terminée!");
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
