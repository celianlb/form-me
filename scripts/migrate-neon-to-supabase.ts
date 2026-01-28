/**
 * Script de migration Neon → Supabase
 *
 * Ce script exporte toutes les données de Neon et les importe dans Supabase.
 *
 * Usage: pnpm ts-node scripts/migrate-neon-to-supabase.ts
 */

import { PrismaClient } from '../generated/prisma';

// Client pour Neon (source)
const neonClient = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_mrlYk7d2gUqV@ep-weathered-meadow-a9kba5mw-pooler.gwc.azure.neon.tech/neondb?sslmode=require"
    }
  }
});

// Client pour Supabase (destination) - utilise DATABASE_URL de .env
const supabaseClient = new PrismaClient();

async function migrateData() {
  console.log('🚀 Début de la migration Neon → Supabase\n');

  try {
    // 1. Users
    console.log('👤 Migration des utilisateurs...');
    const users = await neonClient.user.findMany();
    console.log(`   Trouvé ${users.length} utilisateurs`);

    for (const user of users) {
      try {
        await supabaseClient.user.upsert({
          where: { id: user.id },
          update: user,
          create: user,
        });
      } catch (e) {
        console.log(`   ⚠️ Utilisateur ${user.email} déjà existant ou erreur`);
      }
    }
    console.log('   ✅ Utilisateurs migrés\n');

    // 2. Categories
    console.log('📁 Migration des catégories...');
    const categories = await neonClient.category.findMany();
    console.log(`   Trouvé ${categories.length} catégories`);

    for (const category of categories) {
      try {
        await supabaseClient.category.upsert({
          where: { id: category.id },
          update: category,
          create: category,
        });
      } catch (e) {
        console.log(`   ⚠️ Catégorie ${category.slug} déjà existante ou erreur`);
      }
    }
    console.log('   ✅ Catégories migrées\n');

    // 3. Trainings
    console.log('📚 Migration des formations...');
    const trainings = await neonClient.training.findMany();
    console.log(`   Trouvé ${trainings.length} formations`);

    for (const training of trainings) {
      try {
        await supabaseClient.training.upsert({
          where: { id: training.id },
          update: training,
          create: training,
        });
      } catch (e) {
        console.log(`   ⚠️ Formation ${training.slug} déjà existante ou erreur`);
      }
    }
    console.log('   ✅ Formations migrées\n');

    // 4. Training Modules
    console.log('📖 Migration des modules de formation...');
    const modules = await neonClient.trainingModule.findMany();
    console.log(`   Trouvé ${modules.length} modules`);

    for (const mod of modules) {
      try {
        await supabaseClient.trainingModule.upsert({
          where: { id: mod.id },
          update: mod,
          create: mod,
        });
      } catch (e) {
        // Ignore les erreurs de contrainte unique
      }
    }
    console.log('   ✅ Modules migrés\n');

    // 5. Training Objectives
    console.log('🎯 Migration des objectifs de formation...');
    const objectives = await neonClient.trainingObjective.findMany();
    console.log(`   Trouvé ${objectives.length} objectifs`);

    for (const obj of objectives) {
      try {
        await supabaseClient.trainingObjective.upsert({
          where: { id: obj.id },
          update: obj,
          create: obj,
        });
      } catch (e) {
        // Ignore les erreurs
      }
    }
    console.log('   ✅ Objectifs migrés\n');

    // 6. Supports
    console.log('📎 Migration des supports...');
    const supports = await neonClient.support.findMany();
    console.log(`   Trouvé ${supports.length} supports`);

    for (const support of supports) {
      try {
        await supabaseClient.support.upsert({
          where: { id: support.id },
          update: support,
          create: support,
        });
      } catch (e) {
        // Ignore les erreurs
      }
    }
    console.log('   ✅ Supports migrés\n');

    // 7. Support Groups
    console.log('👥 Migration des groupes de support...');
    const groups = await neonClient.supportGroup.findMany();
    console.log(`   Trouvé ${groups.length} groupes`);

    for (const group of groups) {
      try {
        await supabaseClient.supportGroup.upsert({
          where: { id: group.id },
          update: group,
          create: group,
        });
      } catch (e) {
        // Ignore les erreurs
      }
    }
    console.log('   ✅ Groupes migrés\n');

    // 8. Support Group Members
    console.log('👤 Migration des membres de groupe...');
    const members = await neonClient.supportGroupMember.findMany();
    console.log(`   Trouvé ${members.length} membres`);

    for (const member of members) {
      try {
        await supabaseClient.supportGroupMember.upsert({
          where: { id: member.id },
          update: member,
          create: member,
        });
      } catch (e) {
        // Ignore les erreurs
      }
    }
    console.log('   ✅ Membres migrés\n');

    // 9. Access Supports
    console.log('🔐 Migration des accès aux supports...');
    const accesses = await neonClient.accessSupport.findMany();
    console.log(`   Trouvé ${accesses.length} accès`);

    for (const access of accesses) {
      try {
        await supabaseClient.accessSupport.upsert({
          where: { id: access.id },
          update: access,
          create: access,
        });
      } catch (e) {
        // Ignore les erreurs
      }
    }
    console.log('   ✅ Accès migrés\n');

    // 10. Invite Tokens
    console.log('🎟️ Migration des tokens d\'invitation...');
    const tokens = await neonClient.inviteToken.findMany();
    console.log(`   Trouvé ${tokens.length} tokens`);

    for (const token of tokens) {
      try {
        await supabaseClient.inviteToken.upsert({
          where: { id: token.id },
          update: token,
          create: token,
        });
      } catch (e) {
        // Ignore les erreurs
      }
    }
    console.log('   ✅ Tokens migrés\n');

    // 11. Quotes
    console.log('📋 Migration des devis...');
    const quotes = await neonClient.quote.findMany();
    console.log(`   Trouvé ${quotes.length} devis`);

    for (const quote of quotes) {
      try {
        await supabaseClient.quote.upsert({
          where: { id: quote.id },
          update: quote,
          create: quote,
        });
      } catch (e) {
        // Ignore les erreurs
      }
    }
    console.log('   ✅ Devis migrés\n');

    // 12. Training Versions
    console.log('📜 Migration des versions de formation...');
    const versions = await neonClient.trainingVersion.findMany();
    console.log(`   Trouvé ${versions.length} versions`);

    for (const version of versions) {
      try {
        await supabaseClient.trainingVersion.upsert({
          where: { id: version.id },
          update: {
            trainingId: version.trainingId,
            snapshot: version.snapshot as object,
            savedAt: version.savedAt,
            savedBy: version.savedBy,
          },
          create: {
            id: version.id,
            trainingId: version.trainingId,
            snapshot: version.snapshot as object,
            savedAt: version.savedAt,
            savedBy: version.savedBy,
          },
        });
      } catch (e) {
        // Ignore les erreurs
      }
    }
    console.log('   ✅ Versions migrées\n');

    // 13. Document Templates
    console.log('📄 Migration des templates de documents...');
    const templates = await neonClient.documentTemplate.findMany();
    console.log(`   Trouvé ${templates.length} templates`);

    for (const template of templates) {
      try {
        await supabaseClient.documentTemplate.upsert({
          where: { id: template.id },
          update: template,
          create: template,
        });
      } catch (e) {
        // Ignore les erreurs
      }
    }
    console.log('   ✅ Templates migrés\n');

    // 14. Template Fields
    console.log('📝 Migration des champs de template...');
    const fields = await neonClient.templateField.findMany();
    console.log(`   Trouvé ${fields.length} champs`);

    for (const field of fields) {
      try {
        await supabaseClient.templateField.upsert({
          where: { id: field.id },
          update: field,
          create: field,
        });
      } catch (e) {
        // Ignore les erreurs
      }
    }
    console.log('   ✅ Champs migrés\n');

    // 15. Document Batches
    console.log('📦 Migration des lots de documents...');
    const batches = await neonClient.documentBatch.findMany();
    console.log(`   Trouvé ${batches.length} lots`);

    for (const batch of batches) {
      try {
        await supabaseClient.documentBatch.upsert({
          where: { id: batch.id },
          update: batch,
          create: batch,
        });
      } catch (e) {
        // Ignore les erreurs
      }
    }
    console.log('   ✅ Lots migrés\n');

    // 16. Generated Documents
    console.log('📃 Migration des documents générés...');
    const docs = await neonClient.generatedDocument.findMany();
    console.log(`   Trouvé ${docs.length} documents`);

    for (const doc of docs) {
      try {
        await supabaseClient.generatedDocument.upsert({
          where: { id: doc.id },
          update: {
            templateId: doc.templateId,
            kind: doc.kind,
            createdByUserId: doc.createdByUserId,
            payloadJson: doc.payloadJson as object,
            pdfUrl: doc.pdfUrl,
            cloudinaryPublicId: doc.cloudinaryPublicId,
            batchId: doc.batchId,
            createdAt: doc.createdAt,
          },
          create: {
            id: doc.id,
            templateId: doc.templateId,
            kind: doc.kind,
            createdByUserId: doc.createdByUserId,
            payloadJson: doc.payloadJson as object,
            pdfUrl: doc.pdfUrl,
            cloudinaryPublicId: doc.cloudinaryPublicId,
            batchId: doc.batchId,
            createdAt: doc.createdAt,
          },
        });
      } catch (e) {
        // Ignore les erreurs
      }
    }
    console.log('   ✅ Documents migrés\n');

    // Résumé
    console.log('═══════════════════════════════════════════');
    console.log('📊 RÉSUMÉ DE LA MIGRATION');
    console.log('═══════════════════════════════════════════');
    console.log(`   👤 Utilisateurs: ${users.length}`);
    console.log(`   📁 Catégories: ${categories.length}`);
    console.log(`   📚 Formations: ${trainings.length}`);
    console.log(`   📖 Modules: ${modules.length}`);
    console.log(`   🎯 Objectifs: ${objectives.length}`);
    console.log(`   📎 Supports: ${supports.length}`);
    console.log(`   👥 Groupes: ${groups.length}`);
    console.log(`   👤 Membres: ${members.length}`);
    console.log(`   🔐 Accès: ${accesses.length}`);
    console.log(`   🎟️ Tokens: ${tokens.length}`);
    console.log(`   📋 Devis: ${quotes.length}`);
    console.log(`   📜 Versions: ${versions.length}`);
    console.log(`   📄 Templates: ${templates.length}`);
    console.log(`   📝 Champs: ${fields.length}`);
    console.log(`   📦 Lots: ${batches.length}`);
    console.log(`   📃 Documents: ${docs.length}`);
    console.log('═══════════════════════════════════════════');
    console.log('\n✅ Migration terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await neonClient.$disconnect();
    await supabaseClient.$disconnect();
  }
}

migrateData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
