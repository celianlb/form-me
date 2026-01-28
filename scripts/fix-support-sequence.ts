/**
 * Script pour réparer la séquence d'auto-increment de la table Support
 *
 * Exécuter avec: npx tsx scripts/fix-support-sequence.ts
 */

import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function fixSupportSequence() {
  try {
    console.log("Vérification de la séquence Support...");

    // Récupérer le MAX(id) actuel
    const result = await prisma.$queryRaw<[{ max: bigint | null }]>`
      SELECT MAX(id) as max FROM "Support"
    `;
    const maxId = result[0]?.max ? Number(result[0].max) : 0;
    console.log(`MAX(id) actuel dans Support: ${maxId}`);

    // Réinitialiser la séquence
    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('"Support"', 'id'), ${maxId + 1}, false)
    `;

    console.log(`Séquence réinitialisée à ${maxId + 1}`);
    console.log("✅ Correction terminée !");

  } catch (error) {
    console.error("Erreur lors de la correction:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSupportSequence();
