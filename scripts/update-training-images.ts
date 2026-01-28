import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

/**
 * Script pour mettre à jour les images de toutes les formations
 * Images Unsplash vérifiées et cohérentes avec le contenu de chaque formation
 *
 * IMPORTANT: Chaque image a été sélectionnée pour correspondre au thème de la formation
 */

const TRAINING_IMAGES: Record<string, string> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // BLOC A - TRAVAIL EN HAUTEUR & LEVAGE
  // ═══════════════════════════════════════════════════════════════════════════

  // Travail en hauteur - ouvrier BTP sur structure métallique en hauteur
  "travail-en-hauteur-harnais-pirl-filets":
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",

  // Échafaudage fixe - échafaudages sur chantier de construction
  "echafaudage-fixe-utilisateur-monteur-demonteur-verificateur":
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop",

  // Échafaudage roulant - travaux intérieurs avec échafaudage mobile
  "echafaudage-roulant-utilisateur-monteur-demonteur-verificateur":
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop",

  // Chef de manœuvre - ouvrier avec signalisation sur chantier grue
  "chef-de-man-uvre-direction-des-operations-de-levage":
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop",

  // Élingage - grue avec crochet et élingues de levage
  "elingage-techniques-d-elingage-et-securite-des-operations-de-levage":
    "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2069&auto=format&fit=crop",

  // Levage - opération de levage avec grue sur chantier
  "levage-chef-de-man-uvre-elingueur":
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=2070&auto=format&fit=crop",

  // Module harnais - ouvrier avec harnais de sécurité antichute
  "module-port-du-harnais-utilisation-des-epi-antichute":
    "https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?q=80&w=2070&auto=format&fit=crop",

  // Module PIRL - travailleur sur plateforme élévatrice
  "module-pirl-plateforme-individuelle-roulante-legere":
    "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=2072&auto=format&fit=crop",

  // Module filet - filet de protection chantier construction
  "module-filet-de-securite-protection-collective-contre-les-chutes":
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop",

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOC B - PRÉVENTION, SANTÉ & SÉCURITÉ
  // ═══════════════════════════════════════════════════════════════════════════

  // SST - Formation secourisme avec mannequin RCP / massage cardiaque
  "sst-sauveteur-secouriste-du-travail":
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",

  // MAC SST - Recyclage formation premiers secours
  "mac-sst-maintien-et-actualisation-des-competences-sst":
    "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=2070&auto=format&fit=crop",

  // Gestes et Postures - personne qui soulève correctement une charge
  "gestes-et-postures":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",

  // PRAP IBC - manutention de cartons en entrepôt
  "prap-ibc-prevention-des-risques-lies-a-l-activite-physique-industrie-btp-commerc":
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",

  // PRAP 2S - aide-soignante avec patient, secteur sanitaire
  "prap-2s-prevention-des-risques-lies-a-l-activite-physique-sanitaire-et-social":
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop",

  // AIPR - travaux de canalisation, excavation près de réseaux enterrés
  "aipr-autorisation-d-intervention-a-proximite-des-reseaux":
    "https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=2036&auto=format&fit=crop",

  // ATEX - environnement industriel avec tuyauteries (raffinerie/usine)
  "atex-niveau-0-sensibilisation-aux-atmospheres-explosives":
    "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=2070&auto=format&fit=crop",

  // Habilitation mécanique - technicien sur machine industrielle
  "habilitation-mecanique-m0-m1-m2-mr":
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop",

  // N1 Risques chimiques - laboratoire/usine chimique avec EPI
  "n1-risques-chimiques-niveau-1":
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=2070&auto=format&fit=crop",

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOC C - ÉLECTRICITÉ & HABILITATIONS ÉLECTRIQUES
  // ═══════════════════════════════════════════════════════════════════════════

  // H0-B0-H0V - panneau danger électrique / armoire électrique fermée
  "habilitation-electrique-h0-b0-h0v":
    "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=2070&auto=format&fit=crop",

  // BS-BE Manœuvre - technicien devant tableau électrique
  "habilitation-electrique-bs-be-man-uvre":
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop",

  // B1 - électricien travaillant sur câblage
  "habilitation-electrique-b1-executant-electricien-basse-tension":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2089&auto=format&fit=crop",

  // B2 - électricien avec multimètre/outils de mesure
  "habilitation-electrique-b2-charge-de-travaux-basse-tension":
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",

  // BR - électricien intervention sur installation
  "habilitation-electrique-br-interventions-generales-en-basse-tension":
    "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=2070&auto=format&fit=crop",

  // BC-HC - consignation avec cadenas sur disjoncteur
  "habilitation-electrique-bc-hc-charge-de-consignation-bt-ht":
    "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2072&auto=format&fit=crop",

  // BP - panneaux solaires photovoltaïques sur toit
  "habilitation-electrique-bp-interventions-sur-installations-photovoltaiques":
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop",

  // BF-HF - excavation avec câbles électriques visibles
  "habilitation-electrique-bf-hf-travaux-en-fouilles-a-proximite-d-ouvrages-electri":
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop",

  // H1 - lignes haute tension / pylônes électriques
  "habilitation-electrique-h1-executant-electricien-haute-tension":
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop",

  // H2 - poste de transformation haute tension
  "habilitation-electrique-h2-charge-de-travaux-haute-tension":
    "https://images.unsplash.com/photo-1548613053-22087dd8edb8?q=80&w=2069&auto=format&fit=crop",

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOC D - CACES & AUTORISATIONS DE CONDUITE
  // ═══════════════════════════════════════════════════════════════════════════

  // R489 - Chariot élévateur / forklift en entrepôt
  "caces-r489-chariots-automoteurs-de-manutention-a-conducteur-porte":
    "https://images.unsplash.com/photo-1532635026-d12867005472?q=80&w=2070&auto=format&fit=crop",

  // R485 - Gerbeur à conducteur accompagnant en entrepôt
  "caces-r485-gerbeurs-a-conducteur-accompagnant":
    "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop",

  // R486 - Nacelle / PEMP / plateforme élévatrice
  "caces-r486-pemp-nacelles":
    "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?q=80&w=2072&auto=format&fit=crop",

  // R484 - Pont roulant industriel dans usine
  "caces-r484-ponts-roulants-et-portiques":
    "https://images.unsplash.com/photo-1567789884554-0b844b597180?q=80&w=2070&auto=format&fit=crop",

  // R482 - Pelleteuse / engin de chantier en action
  "caces-r482-engins-de-chantier":
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2074&auto=format&fit=crop",

  // R490 - Grue auxiliaire de chargement sur camion
  "caces-r490-grues-de-chargement":
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOC E - SÉCURITÉ INCENDIE & SÛRETÉ
  // ═══════════════════════════════════════════════════════════════════════════

  // Formation incendie EPI - exercice avec extincteur sur feu
  "formation-incendie-epi-equipier-de-premiere-intervention":
    "https://images.unsplash.com/photo-1625958936686-a9343dc35b5b?q=80&w=2070&auto=format&fit=crop",

  // Manipulation extincteurs - extincteur rouge en gros plan
  "manipulation-des-extincteurs":
    "https://images.unsplash.com/photo-1559060017-445fb9722f2a?q=80&w=2070&auto=format&fit=crop",

  // Évacuation - panneau sortie de secours / issue de secours
  "evacuation-incendie-guide-file-serre-file":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",

  // SSIAP 1 - agent de sécurité incendie en uniforme
  "ssiap-1-agent-de-service-de-securite-incendie-et-d-assistance-a-personnes":
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2080&auto=format&fit=crop",

  // SSIAP 2 - poste de sécurité avec écrans de surveillance
  "ssiap-2-chef-d-equipe-de-service-de-securite-incendie":
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop",

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOC F - FORMATION DE FORMATEURS
  // ═══════════════════════════════════════════════════════════════════════════

  // F0 - salle de formation avec formateur et stagiaires
  "f0-devenir-formateur-professionnel-en-prevention-securite-et-reglementation":
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",

  // F-A - formation pratique travail en hauteur avec équipements
  "f-a-devenir-formateur-en-travail-en-hauteur-equipements":
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",

  // F-B - session de formation en salle avec groupe
  "f-b-devenir-formateur-en-prevention-sante-securite":
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
};

async function main() {
  console.log("🖼️  Mise à jour des images des formations (images cohérentes)...\n");

  const trainings = await prisma.training.findMany({
    orderBy: { title: 'asc' }
  });

  console.log(`📊 ${trainings.length} formations trouvées\n`);

  let updated = 0;
  let notFound = 0;
  const slugsNotMapped: string[] = [];

  for (const training of trainings) {
    const imageUrl = TRAINING_IMAGES[training.slug];

    if (imageUrl) {
      await prisma.training.update({
        where: { id: training.id },
        data: { imageUrl }
      });
      console.log(`✅ ${training.title}`);
      updated++;
    } else {
      console.log(`⚠️  Pas de mapping: ${training.title}`);
      console.log(`   Slug: ${training.slug}`);
      slugsNotMapped.push(training.slug);
      notFound++;
    }
  }

  console.log(`\n📊 Résumé:`);
  console.log(`   ✅ ${updated} formations mises à jour`);
  console.log(`   ⚠️  ${notFound} formations sans mapping`);

  if (slugsNotMapped.length > 0) {
    console.log(`\n❌ Slugs manquants dans le mapping:`);
    slugsNotMapped.forEach(slug => console.log(`   "${slug}": "",`));
  }

  const imageUrls = Object.values(TRAINING_IMAGES);
  const uniqueImages = new Set(imageUrls);
  console.log(`\n📸 Images uniques: ${uniqueImages.size}/${imageUrls.length}`);

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
