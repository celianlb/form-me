import { prisma } from "../lib/prisma";

/** simple slugify pour le seed */
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

type ModuleItem = {
  title: string;
  order: number;
  type?: "THEORETICAL" | "PRACTICAL";
  content?: string;
};

type TrainingSeed = {
  categoryName: string; // DOIT matcher un "name" existant en DB
  title: string;
  shortDescription?: string;
  longDescription?: string;
  imageUrl?: string;
  durationHours?: number;
  durationDays?: number;
  successRate?: number;
  targetAudience?: string;
  learningObjectives?: string;
  objectives?: string[];
  prerequisites?: string;
  technicalMeans?: string;
  teachingMeans?: string;
  evaluationMethods?: string;
  validationMethod?: string;
  monitoringMethods?: string;
  renewalRecommendation?: string;

  modules?: ModuleItem[];
};

/* -----------------------------
 *   VOS FORMATIONS (16 items)
 * ----------------------------*/
const trainings: TrainingSeed[] = [
  // 1) ATEX Niveau 0
  {
    categoryName: "ATEX",
    title: "ATEX Niveau 0 – Sensibilisation aux Atmosphères Explosives",
    shortDescription:
      "Sensibilisation aux risques ATEX et comportements sécuritaires en zones classées.",
    longDescription:
      "Sensibiliser aux risques liés aux atmosphères explosives et adopter les comportements sécuritaires lors d'interventions en zones ATEX. Conforme à la directive ATEX 1999/92/CE et au Code du travail (R4227-42 à R4227-54).",
    durationHours: 7,
    durationDays: 1,
    targetAudience:
      "Salariés travaillant/circulant en zones ATEX sans maintenance; intervenants ponctuels en zones classées.",
    objectives: [
      "Comprendre ce qu'est une atmosphère explosive.",
      "Identifier les zones ATEX et leur classification.",
      "Connaître les sources d'inflammation et leurs conséquences.",
      "Adopter les comportements sécuritaires en zone ATEX.",
      "Connaître les règles de circulation et d'utilisation des équipements.",
    ],
    modules: [
      {
        title: "Réglementation et responsabilités",
        order: 1,
        type: "THEORETICAL",
        content: "- Directive ATEX 1999/92/CE\n- Obligations employeur/salarié",
      },
      {
        title: "Compréhension du risque ATEX",
        order: 2,
        type: "THEORETICAL",
        content:
          "- Définition ATEX; gaz/vapeurs/poussières\n- Triangle de l'explosion",
      },
      {
        title: "Classification des zones",
        order: 3,
        type: "THEORETICAL",
        content: "- Gaz: 0/1/2; Poussières: 20/21/22\n- Signalisation et accès",
      },
      {
        title: "Sources d'inflammation",
        order: 4,
        type: "THEORETICAL",
        content:
          "- Électricité statique, étincelles, chaleur, chocs\n- Comportements à éviter",
      },
      {
        title: "Prévention et bonnes pratiques",
        order: 5,
        type: "THEORETICAL",
        content:
          "- EPI; règles de circulation\n- Consignes & procédures d'urgence",
      },
      {
        title: "Ateliers pratiques",
        order: 6,
        type: "PRACTICAL",
        content:
          "- Études de cas d'accidents\n- Identification de zones sur plans\n- Simulation d'entrée en zone ATEX",
      },
    ],
    teachingMeans:
      "Alternance théorie/exercices; supports multimédia; mise en situation si possible.",
    evaluationMethods: "QCM + exercices pratiques.",
    validationMethod: "Attestation ATEX Niveau 0.",
    monitoringMethods: "Feuilles d'émargement (½ journée).",
    renewalRecommendation:
      "Remise à niveau conseillée tous les 3 ans ou en cas d'évolution/incident.",
  },

  // 2) H0 – B0 – H0V
  {
    categoryName: "Habilitations électriques",
    title: "Habilitation Électrique H0 – B0 – H0V",
    shortDescription:
      "Sensibilisation des non-électriciens aux risques électriques et au voisinage.",
    longDescription:
      "Former les non-électriciens aux risques électriques et à l'intervention en sécurité au voisinage d'installations. Conforme NF C18-510 et Code du travail (R4544-9 à R4544-11).",
    durationHours: 7,
    durationDays: 1,
    targetAudience:
      "Non-électriciens intervenant dans/à proximité d'installations électriques.",
    objectives: [
      "Comprendre les risques liés à l'électricité.",
      "Identifier zones et limites d'intervention.",
      "Connaître les règles de sécurité au voisinage.",
      "Adopter les bons comportements en incident.",
      "Préparer l'habilitation H0-B0 ou H0V.",
    ],
    modules: [
      {
        title: "Réglementation & habilitation",
        order: 1,
        type: "THEORETICAL",
        content: "- Code du travail & NF C18-510\n- Notions d’habilitation",
      },
      {
        title: "Notions d’électricité",
        order: 2,
        type: "THEORETICAL",
        content: "- Courant/tension\n- Effets sur le corps humain",
      },
      {
        title: "Risques électriques",
        order: 3,
        type: "THEORETICAL",
        content: "- Électrisation/électrocution/brûlures\n- Incendie/explosion",
      },
      {
        title: "Conduite à tenir",
        order: 4,
        type: "THEORETICAL",
        content: "- Premiers secours\n- Alerte/évacuation",
      },
      {
        title: "Exercices de voisinage",
        order: 5,
        type: "PRACTICAL",
        content:
          "- Distances & zones\n- Circulation en sécurité\n- Procédures en cas d’anomalie",
      },
    ],
    teachingMeans: "Théorie + exercices; supports multimédia.",
    evaluationMethods: "QCM + mise en situation.",
    validationMethod: "Attestation H0-B0-H0V.",
    monitoringMethods: "Feuille d’émargement.",
    renewalRecommendation:
      "Tous les 3 ans ou après incident/évolution installations.",
  },

  // 3) BS – BE Manœuvre
  {
    categoryName: "Habilitations électriques",
    title: "Habilitation Électrique BS – BE Manœuvre",
    shortDescription:
      "Interventions électriques simples en sécurité pour personnels non-électriciens.",
    longDescription:
      "Former des non-électriciens à réaliser de petites interventions d'ordre électrique en sécurité (NF C18-510).",
    durationHours: 14,
    durationDays: 2,
    targetAudience:
      "Personnel non-électricien désigné pour de petites interventions (maintenance, techniciens...).",
    objectives: [
      "Identifier les risques des interventions simples.",
      "Connaître la réglementation applicable.",
      "Réaliser des manœuvres élémentaires en sécurité.",
      "Réagir en cas d'incident.",
      "Obtenir l'habilitation BS ou BE Manœuvre.",
    ],
    modules: [
      {
        title: "Réglementation & habilitation",
        order: 1,
        type: "THEORETICAL",
        content: "- NF C18-510\n- Responsabilités du salarié habilité",
      },
      {
        title: "Fondamentaux d’électricité",
        order: 2,
        type: "THEORETICAL",
        content: "- Courant, tension, résistance\n- Effets physiologiques",
      },
      {
        title: "Risques & environnements",
        order: 3,
        type: "THEORETICAL",
        content: "- Électrisation, brûlures, incendie",
      },
      {
        title: "Interventions autorisées",
        order: 4,
        type: "THEORETICAL",
        content:
          "- Fusibles, lampes, interrupteurs\n- Réarmement disjoncteur\n- Raccordements simples BT",
      },
      {
        title: "TP : interventions simples",
        order: 5,
        type: "PRACTICAL",
        content:
          "- Vérifs visuelles\n- Remplacement ampoule, réarmement\n- Consignation simplifiée",
      },
    ],
    teachingMeans: "Cours/démos/TP, études de cas.",
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "Attestation avec avis formateur.",
    monitoringMethods: "Feuilles d’émargement.",
    renewalRecommendation:
      "Tous les 3 ans ou après accident/évolution/changement de poste.",
  },

  // 4) Gestes et Postures
  {
    categoryName: "Gestes & postures",
    title: "Gestes et Postures",
    shortDescription: "Prévention TMS : bons gestes et organisation du poste.",
    longDescription:
      "Sensibilisation aux risques liés aux manutentions manuelles et techniques adaptées. Conforme Code du travail (R4541-1 à R4541-9).",
    durationHours: 7,
    durationDays: 1,
    targetAudience: "Salariés manipulant/déplaçant/portant des charges.",
    objectives: [
      "Comprendre les enjeux de prévention des TMS.",
      "Identifier les risques liés aux manutentions et postures.",
      "Adopter les bons gestes et postures.",
      "Organiser son poste pour limiter fatigue et accidents.",
      "Être acteur de sa sécurité et de celle des autres.",
    ],
    modules: [
      {
        title: "Réglementation & responsabilités",
        order: 1,
        type: "THEORETICAL",
        content: "- Obligations employeur/salarié\n- Statistiques TMS",
      },
      {
        title: "Anatomie & biomécanique",
        order: 2,
        type: "THEORETICAL",
        content:
          "- Colonne, muscles, articulations\n- Conséquences gestes inadaptés",
      },
      {
        title: "Analyse des risques manutentions",
        order: 3,
        type: "THEORETICAL",
        content:
          "- Efforts, postures contraintes, répétitivité\n- Environnement, stress, cadence",
      },
      {
        title: "Prévention & organisation",
        order: 4,
        type: "THEORETICAL",
        content: "- Aménagement poste\n- Aides mécaniques\n- Économie d’effort",
      },
      {
        title: "Ateliers pratiques",
        order: 5,
        type: "PRACTICAL",
        content:
          "- Observation pratiques\n- Port/déplacement/levage/dépôt\n- Cas adaptés à l’activité",
      },
    ],
    teachingMeans:
      "Théorie & pratique; supports multimédia; mise en pratique sur poste réel.",
    evaluationMethods: "Évaluation pratique en mises en situation.",
    validationMethod: "Attestation Gestes et Postures.",
    monitoringMethods: "Feuille d’émargement (½ journée).",
    renewalRecommendation:
      "Tous les 3–5 ans ou après accident/changement de poste.",
  },

  // 5) AIPR
  {
    categoryName: "AIPR",
    title: "AIPR — Autorisation d'Intervention à Proximité des Réseaux",
    shortDescription:
      "Préparer et réussir l'examen AIPR (opérateur/encadrant/concepteur).",
    longDescription:
      "Travail en sécurité à proximité des réseaux aériens/souterrains (DT-DICT, arrêté du 15/02/2012).",
    durationHours: 7,
    durationDays: 1,
    targetAudience:
      "Terrassiers, conducteurs d'engins, encadrants, concepteurs intervenant à proximité des réseaux.",
    objectives: [
      "Comprendre la réglementation DT-DICT.",
      "Identifier les réseaux et leurs risques.",
      "Maîtriser les procédures avant/pendant travaux.",
      "Adopter les comportements sécuritaires.",
      "Se préparer au QCM ministériel AIPR.",
    ],
    modules: [
      {
        title: "Cadre réglementaire",
        order: 1,
        type: "THEORETICAL",
        content: "- Décret anti-endommagement\n- Obligations employeur/salarié",
      },
      {
        title: "Identification des réseaux",
        order: 2,
        type: "THEORETICAL",
        content: "- Électricité, gaz, eau, assainissement, télécoms",
      },
      {
        title: "Prévention & procédures",
        order: 3,
        type: "THEORETICAL",
        content:
          "- Plans et marquages\n- DICT, marquage-piquetage\n- Règles de sécurité",
      },
      {
        title: "Incident: conduite à tenir",
        order: 4,
        type: "THEORETICAL",
        content: "- Alerte, mise en sécurité\n- Retours d’expérience",
      },
      {
        title: "Préparation examen",
        order: 5,
        type: "PRACTICAL",
        content:
          "- Études de cas, repérage réseaux\n- Simulations\n- Entraînement QCM",
      },
    ],
    teachingMeans: "Apports théoriques + cas pratiques; supports multimédia.",
    evaluationMethods: "Test QCM officiel (plateforme Ministère).",
    validationMethod: "Attestation de compétences AIPR (5 ans).",
    monitoringMethods: "Feuilles d’émargement.",
    renewalRecommendation: "Renouvellement tous les 5 ans via formation + QCM.",
  },

  // 6) CACES R484
  {
    categoryName: "CACES & autorisation de conduite",
    title: "CACES® R484 — Ponts roulants et portiques",
    shortDescription:
      "Conduite en sécurité des ponts roulants/portiques (cat. 1 & 2).",
    longDescription:
      "Conduite en sécurité des ponts roulants et portiques selon la reco CNAM R484. Cat. 1 (commande au sol) et 2 (commande en cabine). Validité 5 ans.",
    durationHours: 14,
    durationDays: 2,
    targetAudience:
      "Conducteurs et futurs conducteurs de ponts roulants/portiques.",
    objectives: [
      "Identifier les risques liés aux ponts roulants.",
      "Comprendre les responsabilités légales.",
      "Maîtriser les règles de sécurité.",
      "Effectuer les vérifications réglementaires.",
      "Réaliser les manœuvres de levage/déplacement en sécurité.",
    ],
    modules: [
      {
        title: "Réglementation & responsabilités",
        order: 1,
        type: "THEORETICAL",
        content: "- Code du travail, CNAM, R484",
      },
      {
        title: "Technologie & sécurité",
        order: 2,
        type: "THEORETICAL",
        content:
          "- Structure, commandes, limiteurs, dispositifs\n- Risques: renversement, chutes, collisions\n- Signalisation & EPI",
      },
      { title: "Conduite à tenir (urgences)", order: 3, type: "THEORETICAL" },
      {
        title: "Vérifs & prises de poste",
        order: 4,
        type: "PRACTICAL",
        content: "- Visuelles/fonctionnelles, mise en service",
      },
      {
        title: "Manœuvres de levage",
        order: 5,
        type: "PRACTICAL",
        content: "- Levage/déplacement, précision/coordination",
      },
      {
        title: "Fin de poste",
        order: 6,
        type: "PRACTICAL",
        content: "- Arrêt, consignation, anomalies",
      },
    ],
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "CACES/Autorisation de conduite R484 (5 ans).",
  },

  // 7) CACES R485
  {
    categoryName: "CACES & autorisation de conduite",
    title: "CACES® R485 — Gerbeurs à conducteur accompagnant",
    shortDescription: "Utilisation en sécurité des gerbeurs (cat. 1 et 2).",
    longDescription:
      "Utilisation en sécurité des gerbeurs à conducteur accompagnant, conforme CNAM R485. Cat. 1 (≤2,50m) et 2 (>2,50m). Validité 5 ans.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Opérateurs utilisant des gerbeurs en entreprise.",
    objectives: [
      "Identifier les risques liés aux gerbeurs.",
      "Comprendre les responsabilités légales.",
      "Connaître les règles de sécurité.",
      "Maîtriser les vérifications réglementaires.",
      "Conduire/manœuvrer en sécurité en différents environnements.",
    ],
    modules: [
      { title: "Gerbeurs & catégories R485", order: 1, type: "THEORETICAL" },
      { title: "Réglementation, signalisation", order: 2, type: "THEORETICAL" },
      {
        title: "Technologie & stabilité",
        order: 3,
        type: "THEORETICAL",
        content: "- Système de levage, organes de sécurité",
      },
      { title: "Risques & co-activité", order: 4, type: "THEORETICAL" },
      {
        title: "Prise de poste & manœuvres",
        order: 5,
        type: "PRACTICAL",
        content: "- À vide/en charge, allées étroites, incidents",
      },
      { title: "Fin de poste", order: 6, type: "PRACTICAL" },
    ],
    evaluationMethods: "QCM + mise en situation pratique.",
    validationMethod: "CACES/Autorisation de conduite R485 (5 ans).",
  },

  // 8) CACES R489
  {
    categoryName: "CACES & autorisation de conduite",
    title:
      "CACES® R489 — Chariots automoteurs de manutention à conducteur porté",
    shortDescription: "Conduite des chariots R489 (1A,1B,2A,2B,3,4,5,6,7).",
    longDescription:
      "Certification à la conduite des chariots automoteurs R489 (plusieurs catégories). Validité 5 ans.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Conducteurs de chariots élévateurs (catégories R489).",
    objectives: [
      "Conduire/manœuvrer en sécurité un chariot adapté.",
      "Identifier les risques (renversement, heurt, chute de charge).",
      "Maîtriser réglementation et responsabilités.",
      "Effectuer les vérifications réglementaires.",
      "Adapter la conduite à l’environnement.",
    ],
    modules: [
      {
        title: "Réglementation & catégories R489",
        order: 1,
        type: "THEORETICAL",
      },
      {
        title: "Stabilité & sécurité des charges",
        order: 2,
        type: "THEORETICAL",
      },
      {
        title: "Risques sols/pentes/co-activité",
        order: 3,
        type: "THEORETICAL",
      },
      { title: "EPI & signalisation", order: 4, type: "THEORETICAL" },
      {
        title: "Conduite & manœuvres",
        order: 5,
        type: "PRACTICAL",
        content: "- Gerbage/dégerbage; allées, rampes, zones encombrées",
      },
      { title: "Fin de poste", order: 6, type: "PRACTICAL" },
    ],
    evaluationMethods: "QCM + épreuves pratiques par catégorie.",
    validationMethod: "CACES/Autorisation de conduite R489 (5 ans).",
  },

  // 9) CACES R490
  {
    categoryName: "CACES & autorisation de conduite",
    title: "CACES® R490 — Grues de chargement",
    shortDescription:
      "Conduite en sécurité des grues de chargement (options accessoires).",
    longDescription:
      "Conduite en sécurité des grues de chargement selon reco CNAM R490 (télécommande, stabilisateurs, accessoires). Validité 5 ans.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Opérateurs de grues de chargement.",
    objectives: [
      "Identifier les risques liés à la grue de chargement.",
      "Comprendre règles légales et responsabilités.",
      "Maîtriser vérifications réglementaires.",
      "Réaliser manœuvres de levage/chargement en sécurité.",
      "Réagir en cas d’incident.",
    ],
    modules: [
      { title: "Réglementation & R490", order: 1, type: "THEORETICAL" },
      {
        title: "Technologie & stabilisation",
        order: 2,
        type: "THEORETICAL",
        content: "- Structure, commandes, limiteurs, stabilisateurs",
      },
      { title: "Risques & environnement", order: 3, type: "THEORETICAL" },
      {
        title: "Mise en service & manœuvres",
        order: 4,
        type: "PRACTICAL",
        content: "- Chargement/déchargement, accessoires spécifiques",
      },
      { title: "Fin de poste", order: 5, type: "PRACTICAL" },
    ],
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "CACES/Autorisation de conduite R490 (5 ans).",
  },

  // 10) CACES R486
  {
    categoryName: "CACES & autorisation de conduite",
    title: "CACES® R486 — PEMP / Nacelles",
    shortDescription: "Conduite en sécurité des PEMP (A, B, option C).",
    longDescription:
      "Conduite en sécurité des PEMP selon R486 (A: élévation verticale; B: multidirectionnelle; C: déplacement/chargement sur porte-engins). Validité 5 ans.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Utilisateurs de PEMP/nacelles (A/B + option C).",
    objectives: [
      "Identifier les risques liés aux PEMP.",
      "Comprendre responsabilités légales.",
      "Connaître règles de conduite en sécurité.",
      "Effectuer vérifications réglementaires.",
      "Réaliser manœuvres d’élévation/translation en sécurité.",
    ],
    modules: [
      { title: "Catégories & réglementation", order: 1, type: "THEORETICAL" },
      {
        title: "Technologie & sécurité",
        order: 2,
        type: "THEORETICAL",
        content: "- Stabilité, dispositifs de sécurité, commandes",
      },
      {
        title: "Risques: renversement/chute/écrasement",
        order: 3,
        type: "THEORETICAL",
      },
      {
        title: "EPI & urgences",
        order: 4,
        type: "THEORETICAL",
        content: "- Harnais, longe, casque\n- Procédures de secours",
      },
      {
        title: "TP conduite/manœuvres",
        order: 5,
        type: "PRACTICAL",
        content:
          "- Sol stable/instable, intérieur/extérieur\n- Élévation, translation, positionnement",
      },
      { title: "Fin de poste", order: 6, type: "PRACTICAL" },
    ],
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "CACES/Autorisation de conduite R486 (5 ans).",
  },

  // 11) Travail en Hauteur
  {
    categoryName: "Travaux en hauteur & échafaudages",
    title: "Travail en Hauteur — Harnais, PIRL, Filets",
    shortDescription:
      "Sécurité et bonnes pratiques pour interventions en hauteur (modules au choix).",
    longDescription:
      "Former aux interventions en hauteur : port du harnais, PIRL, filets de sécurité/surface. Conforme Code du travail (R4323-58 à R4323-90) et normes EN.",
    durationHours: 7,
    durationDays: 1,
    targetAudience: "Salariés intervenant en hauteur (modules selon besoins).",
    objectives: [
      "Identifier les risques liés aux travaux en hauteur.",
      "Connaître la réglementation et responsabilités.",
      "Utiliser correctement un harnais et ses accessoires.",
      "Maîtriser l’utilisation des plateformes PIRL.",
      "Installer/contrôler des filets de sécurité/surface.",
      "Réagir face à un incident.",
    ],
    modules: [
      {
        title: "Réglementation & normes",
        order: 1,
        type: "THEORETICAL",
        content: "- EN 361, EN 1263-1/2; rôles & responsabilités",
      },
      {
        title: "Risques & prévention",
        order: 2,
        type: "THEORETICAL",
        content: "- Chutes; moyens de prévention",
      },
      {
        title: "EPI & EPC",
        order: 3,
        type: "THEORETICAL",
        content: "- Harnais, longes, lignes de vie; PIRL; filets",
      },
      {
        title: "Module Harnais — pratiques",
        order: 4,
        type: "PRACTICAL",
        content: "- Ajustement/port; ancrage; déplacements",
      },
      {
        title: "Module PIRL — pratiques",
        order: 5,
        type: "PRACTICAL",
        content: "- Montage, vérification, déplacements",
      },
      {
        title: "Module Filets — pratiques",
        order: 6,
        type: "PRACTICAL",
        content: "- Installation/fixation; conformité; cas d’urgence",
      },
    ],
    teachingMeans:
      "Théorie + mises en situation; supports multimédia; plateau/site client.",
    evaluationMethods: "QCM/ou oral + évaluation pratique.",
    validationMethod: "Attestation Travail en Hauteur.",
    monitoringMethods: "Feuilles d’émargement.",
    renewalRecommendation: "Tous les 3 ans (ou avant selon contexte).",
  },

  // 12) Échafaudage Roulant
  {
    categoryName: "Travaux en hauteur & échafaudages",
    title:
      "Échafaudage Roulant — Utilisateur / Monteur-Démonteur / Vérificateur",
    shortDescription:
      "Utiliser, monter/démonter et vérifier un échafaudage roulant en sécurité.",
    longDescription:
      "Utilisation, montage/démontage et vérification des échafaudages roulants (décret 2004-924, CNAMTS R457).",
    durationHours: 7,
    durationDays: 1,
    targetAudience: "Utilisateurs, monteurs/démonteurs, vérificateurs.",
    objectives: [
      "Identifier les risques liés aux échafaudages roulants.",
      "Connaître obligations et responsabilités.",
      "Utiliser en sécurité un échafaudage roulant.",
      "Maîtriser montage/démontage/déplacement.",
      "Vérifier la conformité et établir un rapport.",
    ],
    modules: [
      {
        title: "Réglementation & responsabilités",
        order: 1,
        type: "THEORETICAL",
        content: "- Code du travail & R457",
      },
      {
        title: "Connaissance des échafaudages",
        order: 2,
        type: "THEORETICAL",
        content: "- Types, stabilité, dispositifs de sécurité",
      },
      { title: "Risques & prévention", order: 3, type: "THEORETICAL" },
      { title: "Vérifications obligatoires", order: 4, type: "THEORETICAL" },
      {
        title: "Pratiques — Utilisateur",
        order: 5,
        type: "PRACTICAL",
        content: "- Vérif avant usage, déplacement, EPI",
      },
      {
        title: "Pratiques — Monteur/Démonteur",
        order: 6,
        type: "PRACTICAL",
        content: "- Notice constructeur, montage/démontage, stabilisation",
      },
      {
        title: "Pratiques — Vérificateur",
        order: 7,
        type: "PRACTICAL",
        content: "- Contrôles, conformité, fiche de vérification",
      },
    ],
    evaluationMethods: "QCM/ou oral + pratique selon module.",
    validationMethod: "Attestation module validé.",
  },

  // 13) Échafaudage Fixe
  {
    categoryName: "Travaux en hauteur & échafaudages",
    title: "Échafaudage Fixe — Utilisateur / Monteur-Démonteur / Vérificateur",
    shortDescription:
      "Utiliser, monter/démonter et vérifier un échafaudage fixe en sécurité.",
    longDescription:
      "Utilisation, montage/démontage et vérification des échafaudages de pied (décret 2004-924, CNAMTS R408).",
    durationHours: 7,
    durationDays: 1,
    targetAudience: "Utilisateurs, monteurs/démonteurs, vérificateurs.",
    objectives: [
      "Identifier les risques des échafaudages fixes.",
      "Connaître obligations et responsabilités.",
      "Utiliser en sécurité un échafaudage fixe.",
      "Maîtriser montage/démontage/stabilisation.",
      "Vérifier la conformité et rédiger un rapport.",
    ],
    modules: [
      { title: "Réglementation & R408", order: 1, type: "THEORETICAL" },
      {
        title: "Types & composants",
        order: 2,
        type: "THEORETICAL",
        content:
          "- Façade, multidirectionnels, modulaires\n- Plinthes, planchers, ancrages",
      },
      {
        title: "Risques & prévention",
        order: 3,
        type: "THEORETICAL",
        content: "- Vent, sol, obstacles, balisage",
      },
      {
        title: "Vérifications réglementaires",
        order: 4,
        type: "THEORETICAL",
        content: "- Contrôles journaliers/permanents, registre",
      },
      {
        title: "Pratiques — Utilisateur",
        order: 5,
        type: "PRACTICAL",
        content: "- Accès/déplacement en sécurité, EPI",
      },
      {
        title: "Pratiques — Monteur/Démonteur",
        order: 6,
        type: "PRACTICAL",
        content: "- Montage (ancrages, garde-corps, planchers); démontage",
      },
      {
        title: "Pratiques — Vérificateur",
        order: 7,
        type: "PRACTICAL",
        content: "- Stabilité, ancrages, charges, rapports",
      },
    ],
    evaluationMethods: "QCM/ou oral + pratique selon module.",
    validationMethod: "Attestation module validé.",
  },

  // 14) SST
  {
    categoryName: "Sauveteurs secouristes au travail",
    title: "SST — Sauveteur Secouriste du Travail",
    shortDescription:
      "Intervenir efficacement face à un accident du travail (référentiel INRS).",
    longDescription:
      "Permettre d'intervenir efficacement face à un accident du travail en attendant les secours. Conforme référentiel INRS; Code du travail (R4224-14 à R4224-16).",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Salariés devant intervenir en premiers secours.",
    objectives: [
      "Protéger la victime et soi-même.",
      "Examiner l’état de la victime.",
      "Alerter ou faire alerter.",
      "Réaliser les gestes de premiers secours.",
      "Contribuer à la prévention des risques professionnels.",
    ],
    modules: [
      {
        title: "Rôle du SST & prévention",
        order: 1,
        type: "THEORETICAL",
        content:
          "- Organisation de la prévention\n- Obligations de l’entreprise",
      },
      {
        title: "Intervenir face à un accident",
        order: 2,
        type: "THEORETICAL",
        content: "- Protéger, examiner, alerter, secourir",
      },
      {
        title: "Mises en situation & DAE",
        order: 3,
        type: "PRACTICAL",
        content: "- Cas concrets simulés\n- Utilisation du DAE",
      },
    ],
    teachingMeans:
      "Mannequins & DAE de formation; alternance théorie/pratique.",
    evaluationMethods: "Évaluation continue (théorique/pratique).",
    validationMethod: "Certificat SST (2 ans).",
    renewalRecommendation: "MAC SST obligatoire tous les 24 mois.",
  },

  // 15) Levage — Chef de Manœuvre & Élingueur
  {
    categoryName: "Elingage",
    title: "Levage — Chef de Manœuvre & Élingueur",
    shortDescription:
      "Organisation, élingage et guidage des charges en sécurité.",
    longDescription:
      "Former aux opérations de levage : Chef de Manœuvre (diriger/sécuriser) & Élingueur (élingage/guidage). Code du travail (R4323-55 et s.) & recommandations CNAM.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Équipes impliquées dans des opérations de levage.",
    objectives: [
      "Identifier les risques du levage.",
      "Comprendre rôles/responsabilités Chef de Manœuvre & Élingueur.",
      "Connaître matériels & limites d’utilisation.",
      "Communiquer efficacement avec le conducteur.",
      "Réaliser des élingages adaptés et guider les charges.",
      "Organiser et sécuriser la zone de manœuvre.",
    ],
    modules: [
      {
        title: "Réglementation & responsabilités",
        order: 1,
        type: "THEORETICAL",
      },
      {
        title: "Matériels & accessoires",
        order: 2,
        type: "THEORETICAL",
        content: "- Grues, chariots, élingues, crochets, CMU",
      },
      {
        title: "Analyse des risques",
        order: 3,
        type: "THEORETICAL",
        content: "- Basculement, rupture, balancement, co-activité",
      },
      {
        title: "Communication & organisation",
        order: 4,
        type: "THEORETICAL",
        content: "- Gestuelle, radio, balisage",
      },
      {
        title: "TP Chef de Manœuvre",
        order: 5,
        type: "PRACTICAL",
        content: "- Organisation zone; manœuvres simples/complexes",
      },
      {
        title: "TP Élingueur",
        order: 6,
        type: "PRACTICAL",
        content: "- Vérifs, élingages simples/complexes; guidage charges",
      },
    ],
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "Attestation Levage (modules validés).",
  },

  // 16) CACES R482
  {
    categoryName: "CACES & autorisation de conduite",
    title: "CACES® R482 — Engins de chantier",
    shortDescription:
      "Conduite des engins de chantier (A, B1/B2, C1/C2, D, E, F, G, H, I, J).",
    longDescription:
      "Conduite en sécurité des engins de chantier (reco CNAM R482). Validité 10 ans.",
    durationHours: 21,
    durationDays: 3,
    targetAudience:
      "Conducteurs d'engins de chantier (selon catégories visées).",
    objectives: [
      "Identifier les risques liés aux engins.",
      "Connaître responsabilités du conducteur.",
      "Effectuer vérifications réglementaires.",
      "Maîtriser règles de sécurité lors des manœuvres.",
      "Intervenir en cas d’incident.",
    ],
    modules: [
      {
        title: "Catégories R482 & réglementation",
        order: 1,
        type: "THEORETICAL",
      },
      {
        title: "Technologie & fonctionnement",
        order: 2,
        type: "THEORETICAL",
        content: "- Stabilité, organes de sécurité",
      },
      {
        title: "Risques pro & signalisation",
        order: 3,
        type: "THEORETICAL",
        content: "- Renversement, collision, écrasement\n- Balisage & EPI",
      },
      { title: "Prises de poste & vérifs", order: 4, type: "PRACTICAL" },
      {
        title: "Manœuvres & travaux pratiques",
        order: 5,
        type: "PRACTICAL",
        content: "- Terrassement, chargement, nivellement, transport",
      },
      { title: "Fin de poste & entretien", order: 6, type: "PRACTICAL" },
    ],
    evaluationMethods: "QCM + évaluation pratique par catégorie.",
    validationMethod: "CACES/Autorisation de conduite R482 (10 ans).",
  },

  // 17) MAC SST
  {
    categoryName: "Sauveteurs secouristes au travail",
    title: "MAC SST — Maintien et Actualisation des Compétences SST",
    shortDescription: "Recyclage obligatoire tous les 24 mois pour maintenir le certificat SST.",
    longDescription: "Le MAC SST permet aux sauveteurs secouristes du travail de maintenir et actualiser leurs compétences, conformément au référentiel INRS.",
    durationHours: 7,
    durationDays: 1,
    targetAudience: "Titulaires du certificat SST souhaitant le renouveler.",
    prerequisites: "Être titulaire d'un certificat SST en cours de validité ou arrivant à échéance.",
    objectives: [
      "Actualiser ses connaissances sur les risques et la prévention.",
      "Maintenir ses compétences en matière de secourisme.",
      "Réviser les gestes de premiers secours.",
      "Intégrer les évolutions réglementaires et techniques.",
    ],
    modules: [
      { title: "Retour d'expérience", order: 1, type: "THEORETICAL", content: "- Échanges sur les interventions réalisées\n- Difficultés rencontrées" },
      { title: "Actualisation des connaissances", order: 2, type: "THEORETICAL", content: "- Évolutions réglementaires\n- Mise à jour des techniques de secours" },
      { title: "Révision des gestes de secours", order: 3, type: "PRACTICAL", content: "- Protection, examen, alerte\n- Gestes de premiers secours\n- Utilisation du DAE" },
      { title: "Mises en situation", order: 4, type: "PRACTICAL", content: "- Cas concrets adaptés à l'activité de l'entreprise" },
    ],
    teachingMeans: "Mannequins, DAE de formation; alternance théorie/pratique.",
    evaluationMethods: "Évaluation continue (théorique et pratique).",
    validationMethod: "Renouvellement du certificat SST (24 mois).",
    monitoringMethods: "Feuille d'émargement.",
    renewalRecommendation: "MAC SST obligatoire tous les 24 mois.",
  },

  // 18) PRAP IBC
  {
    categoryName: "Gestes & postures",
    title: "PRAP IBC — Prévention des Risques liés à l'Activité Physique (Industrie, BTP, Commerce)",
    shortDescription: "Formation certifiante INRS pour prévenir les TMS et accidents liés à l'activité physique.",
    longDescription: "La formation PRAP IBC permet aux salariés de devenir acteurs de leur prévention, d'analyser leur situation de travail et de proposer des améliorations.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Salariés des secteurs industrie, BTP et commerce exposés aux risques liés à l'activité physique.",
    objectives: [
      "Identifier les risques liés à l'activité physique.",
      "Analyser sa situation de travail.",
      "Proposer des pistes d'amélioration.",
      "Adopter les bons gestes et postures.",
      "Participer à la démarche de prévention de l'entreprise.",
    ],
    modules: [
      { title: "Enjeux de la prévention", order: 1, type: "THEORETICAL", content: "- Statistiques AT/MP\n- Coûts humains et financiers" },
      { title: "Fonctionnement du corps humain", order: 2, type: "THEORETICAL", content: "- Anatomie (colonne, muscles, articulations)\n- Mécanismes des TMS" },
      { title: "Analyse de la situation de travail", order: 3, type: "PRACTICAL", content: "- Observation du poste\n- Identification des déterminants" },
      { title: "Principes de sécurité physique", order: 4, type: "PRACTICAL", content: "- Techniques de manutention\n- Économie d'effort" },
    ],
    teachingMeans: "Apports théoriques, exercices pratiques, analyse de situations réelles.",
    evaluationMethods: "Évaluation continue (théorique et pratique).",
    validationMethod: "Certificat PRAP IBC (INRS) valable 24 mois.",
    renewalRecommendation: "MAC PRAP IBC obligatoire tous les 24 mois.",
  },

  // 19) PRAP 2S
  {
    categoryName: "Gestes & postures",
    title: "PRAP 2S — Prévention des Risques liés à l'Activité Physique (Sanitaire et Social)",
    shortDescription: "Formation certifiante INRS pour les professionnels du secteur sanitaire et social.",
    longDescription: "La formation PRAP 2S permet aux professionnels du secteur sanitaire et social de prévenir les risques liés à la mobilisation des personnes.",
    durationHours: 21,
    durationDays: 3,
    targetAudience: "Personnel soignant, aides à domicile, auxiliaires de vie, personnel EHPAD.",
    objectives: [
      "Identifier les risques liés à l'activité physique dans le secteur sanitaire et social.",
      "Analyser sa situation de travail.",
      "Maîtriser les techniques de mobilisation des personnes.",
      "Proposer des améliorations de son poste de travail.",
      "Utiliser les aides techniques adaptées.",
    ],
    modules: [
      { title: "Enjeux de la prévention en 2S", order: 1, type: "THEORETICAL", content: "- Statistiques AT/MP du secteur\n- Spécificités du secteur sanitaire et social" },
      { title: "Anatomie et biomécanique", order: 2, type: "THEORETICAL", content: "- Fonctionnement du corps\n- Mécanismes des TMS" },
      { title: "Analyse de la situation de travail", order: 3, type: "PRACTICAL", content: "- Observation du poste\n- Propositions d'amélioration" },
      { title: "Techniques de mobilisation", order: 4, type: "PRACTICAL", content: "- Principes de manutention des personnes\n- Utilisation des aides techniques" },
    ],
    teachingMeans: "Apports théoriques, exercices pratiques, mises en situation.",
    evaluationMethods: "Évaluation continue (théorique et pratique).",
    validationMethod: "Certificat PRAP 2S (INRS) valable 24 mois.",
    renewalRecommendation: "MAC PRAP 2S obligatoire tous les 24 mois.",
  },

  // 20) Habilitation Mécanique
  {
    categoryName: "Habilitations mécaniques",
    title: "Habilitation Mécanique M0/M1/M2/MR",
    shortDescription: "Intervention en sécurité sur équipements mécaniques selon le niveau d'habilitation.",
    longDescription: "Former les salariés à intervenir en sécurité sur des équipements mécaniques, en maîtrisant les procédures de consignation.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Personnel de maintenance, techniciens, opérateurs intervenant sur équipements mécaniques.",
    objectives: [
      "Identifier les risques mécaniques.",
      "Connaître les procédures de consignation mécanique.",
      "Appliquer les règles de sécurité lors des interventions.",
      "Adopter un comportement sécurisé.",
    ],
    modules: [
      { title: "Réglementation et responsabilités", order: 1, type: "THEORETICAL", content: "- Code du travail\n- Obligations employeur/salarié" },
      { title: "Risques mécaniques", order: 2, type: "THEORETICAL", content: "- Écrasement, cisaillement, happement\n- Énergies résiduelles" },
      { title: "Procédures de consignation", order: 3, type: "THEORETICAL", content: "- Séparation, condamnation, vérification" },
      { title: "Mise en situation pratique", order: 4, type: "PRACTICAL", content: "- Consignation/déconsignation sur équipements" },
    ],
    teachingMeans: "Apports théoriques, études de cas, exercices pratiques.",
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "Attestation d'habilitation mécanique.",
    renewalRecommendation: "Recyclage recommandé tous les 3 ans.",
  },

  // 21) N1 Risques Chimiques
  {
    categoryName: "Risques chimiques",
    title: "N1 Risques Chimiques — Niveau 1",
    shortDescription: "Sensibilisation aux risques chimiques pour le personnel intervenant sur sites industriels.",
    longDescription: "La formation N1 Risques Chimiques permet aux salariés d'identifier les risques chimiques et d'adopter les comportements de prévention adaptés.",
    durationHours: 7,
    durationDays: 1,
    targetAudience: "Personnel intervenant sur sites industriels à risques chimiques (entreprises extérieures).",
    objectives: [
      "Identifier les risques chimiques.",
      "Connaître les moyens de prévention.",
      "Comprendre la signalisation et l'étiquetage.",
      "Adopter les comportements de sécurité.",
      "Réagir en cas d'incident.",
    ],
    modules: [
      { title: "Réglementation et responsabilités", order: 1, type: "THEORETICAL", content: "- Code du travail\n- Plan de prévention" },
      { title: "Risques chimiques", order: 2, type: "THEORETICAL", content: "- Types de produits\n- Voies de pénétration" },
      { title: "Prévention et protection", order: 3, type: "THEORETICAL", content: "- EPI/EPC\n- Signalisation et étiquetage" },
      { title: "Conduite à tenir", order: 4, type: "PRACTICAL", content: "- En cas d'exposition\n- En cas d'incident" },
    ],
    teachingMeans: "Apports théoriques, vidéos, études de cas.",
    evaluationMethods: "QCM.",
    validationMethod: "Attestation N1 Risques Chimiques (valable 3 ans).",
    renewalRecommendation: "Recyclage obligatoire tous les 3 ans.",
  },

  // 22) Chef de Manœuvre
  {
    categoryName: "Elingage",
    title: "Chef de Manœuvre — Direction des opérations de levage",
    shortDescription: "Diriger et sécuriser les opérations de levage en coordonnant les intervenants.",
    longDescription: "Former les chefs de manœuvre à organiser, diriger et sécuriser les opérations de levage, en coordination avec les conducteurs et élingueurs.",
    durationHours: 7,
    durationDays: 1,
    targetAudience: "Personnel devant diriger des opérations de levage sur chantier ou en industrie.",
    objectives: [
      "Identifier les risques liés aux opérations de levage.",
      "Organiser et sécuriser la zone de manœuvre.",
      "Communiquer efficacement avec les intervenants.",
      "Diriger les manœuvres de levage en sécurité.",
      "Réagir en cas d'incident.",
    ],
    modules: [
      { title: "Réglementation et responsabilités", order: 1, type: "THEORETICAL", content: "- Code du travail\n- Responsabilités du chef de manœuvre" },
      { title: "Analyse des risques", order: 2, type: "THEORETICAL", content: "- Basculement, rupture, balancement\n- Co-activité" },
      { title: "Communication et signalisation", order: 3, type: "THEORETICAL", content: "- Gestuelle normalisée\n- Communication radio" },
      { title: "Mise en situation pratique", order: 4, type: "PRACTICAL", content: "- Organisation de zone\n- Direction de manœuvres" },
    ],
    teachingMeans: "Apports théoriques, exercices pratiques, mises en situation.",
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "Attestation Chef de Manœuvre.",
    renewalRecommendation: "Recyclage recommandé tous les 3 ans ou en cas de changement de contexte.",
  },

  // 23) Élingeur
  {
    categoryName: "Elingage",
    title: "Élingage — Techniques d'élingage et sécurité des opérations de levage",
    shortDescription: "Maîtriser les techniques d'élingage pour sécuriser les opérations de levage.",
    longDescription: "Former les salariés à réaliser des opérations d'élingage en toute sécurité, en choisissant et utilisant correctement les accessoires de levage.",
    durationHours: 7,
    durationDays: 1,
    targetAudience: "Personnel amené à réaliser des opérations d'élingage (BTP, industrie, maintenance, logistique).",
    prerequisites: "Aptitude médicale au poste concerné requise.",
    objectives: [
      "Identifier les risques liés aux opérations d'élingage.",
      "Reconnaître les différents accessoires de levage.",
      "Choisir les élingues adaptées à la charge à lever.",
      "Réaliser un élingage conforme et sécurisé.",
      "Vérifier l'état des accessoires de levage.",
      "Adopter un comportement sécurisé lors des opérations de levage.",
    ],
    modules: [
      { title: "Réglementation et responsabilités", order: 1, type: "THEORETICAL", content: "- Cadre réglementaire\n- Responsabilités des intervenants" },
      { title: "Accessoires de levage", order: 2, type: "THEORETICAL", content: "- Élingues chaînes, textiles, câbles\n- Manilles, crochets, anneaux" },
      { title: "Risques et prévention", order: 3, type: "THEORETICAL", content: "- Lecture des plaques de charge\n- Principes généraux de prévention" },
      { title: "Pratique d'élingage", order: 4, type: "PRACTICAL", content: "- Contrôle des accessoires\n- Réalisation des différents types d'élingage\n- Équilibrage des charges" },
    ],
    teachingMeans: "Apports théoriques, exercices pratiques, mises en situation.",
    evaluationMethods: "Évaluation pratique lors des opérations d'élingage.",
    validationMethod: "Attestation de formation Élingage.",
    renewalRecommendation: "Remise à niveau recommandée en cas de changement de charges ou d'accessoires.",
  },

  // 24) B1 Habilitation Électrique
  {
    categoryName: "Habilitations électriques",
    title: "Habilitation Électrique B1 — Exécutant électricien basse tension",
    shortDescription: "Réaliser des travaux d'ordre électrique en basse tension sous la responsabilité d'un chargé de travaux.",
    longDescription: "La formation B1 permet aux électriciens d'effectuer des travaux d'ordre électrique en basse tension, conformément à la norme NF C 18-510.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Personnel électricien réalisant des travaux électriques en basse tension.",
    prerequisites: "Connaissances de base en électricité obligatoires. Aptitude médicale au poste.",
    objectives: [
      "Identifier les risques liés aux travaux électriques en basse tension.",
      "Comprendre le cadre réglementaire et les responsabilités associées.",
      "Appliquer les règles de sécurité de la norme NF C 18-510.",
      "Réaliser des travaux électriques en qualité d'exécutant B1.",
      "Adopter un comportement sécurisé lors des interventions.",
    ],
    modules: [
      { title: "Tronc commun B1", order: 1, type: "THEORETICAL", content: "- Notions fondamentales en électricité\n- Effets du courant électrique\n- Cadre réglementaire et NF C 18-510" },
      { title: "Rôles et limites B1", order: 2, type: "THEORETICAL", content: "- Zones d'environnement électrique\n- Responsabilités et limites de l'habilitation B1" },
      { title: "Sécurité et EPI", order: 3, type: "THEORETICAL", content: "- Procédures de sécurité\n- Équipements de protection" },
      { title: "Mise en situation pratique", order: 4, type: "PRACTICAL", content: "- Travaux électriques sous responsabilité\n- Conduite à tenir en cas d'incident" },
    ],
    teachingMeans: "Apports théoriques, études de cas, exercices pratiques.",
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "Attestation de formation B1 + avis d'habilitation remis à l'employeur.",
    renewalRecommendation: "Recyclage recommandé tous les 3 ans selon NF C 18-510.",
  },

  // 25) B2 Habilitation Électrique
  {
    categoryName: "Habilitations électriques",
    title: "Habilitation Électrique B2 — Chargé de travaux basse tension",
    shortDescription: "Diriger et organiser des travaux d'ordre électrique en basse tension.",
    longDescription: "La formation B2 permet aux électriciens d'assurer la direction et l'organisation de travaux électriques en BT, conformément à la norme NF C 18-510.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Personnel électricien amené à encadrer et diriger des travaux électriques en BT.",
    prerequisites: "Solides connaissances en électricité obligatoires. Expérience professionnelle recommandée.",
    objectives: [
      "Identifier les risques liés aux travaux électriques en basse tension.",
      "Organiser, diriger et surveiller des travaux électriques.",
      "Appliquer les règles de sécurité de la norme NF C 18-510.",
      "Assurer la sécurité des personnes et des biens pendant les interventions.",
    ],
    modules: [
      { title: "Tronc commun B2", order: 1, type: "THEORETICAL", content: "- Rappels fondamentaux en électricité\n- Cadre réglementaire et NF C 18-510" },
      { title: "Organisation des travaux", order: 2, type: "THEORETICAL", content: "- Analyse des risques\n- Mesures de prévention\n- Consignation, balisage" },
      { title: "Gestion des situations", order: 3, type: "THEORETICAL", content: "- Situations anormales et d'urgence\n- Coordination des intervenants" },
      { title: "Mise en situation pratique", order: 4, type: "PRACTICAL", content: "- Organisation et direction de travaux\n- Gestion d'équipe" },
    ],
    teachingMeans: "Apports théoriques, études de cas, exercices pratiques.",
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "Attestation de formation B2 + avis d'habilitation remis à l'employeur.",
    renewalRecommendation: "Recyclage recommandé tous les 3 ans selon NF C 18-510.",
  },

  // 26) BC/HC Habilitation Électrique
  {
    categoryName: "Habilitations électriques",
    title: "Habilitation Électrique BC/HC — Chargé de consignation BT & HT",
    shortDescription: "Réaliser les opérations de consignation et déconsignation électrique.",
    longDescription: "La formation BC/HC permet aux électriciens d'assurer la consignation et déconsignation d'installations électriques BT et/ou HT, conformément à la norme NF C 18-510.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Personnel électricien chargé de réaliser des consignations électriques.",
    prerequisites: "Solides connaissances en électricité obligatoires. Expérience professionnelle recommandée.",
    objectives: [
      "Identifier les risques liés aux opérations de consignation électrique.",
      "Appliquer les règles de sécurité de la norme NF C 18-510.",
      "Réaliser une consignation et déconsignation en basse tension (BC).",
      "Réaliser une consignation et déconsignation en haute tension (HC).",
      "Garantir la sécurité des personnes et des installations.",
    ],
    modules: [
      { title: "Tronc commun BC/HC", order: 1, type: "THEORETICAL", content: "- Rappels fondamentaux\n- Principe général de la consignation" },
      { title: "Consignation BT", order: 2, type: "THEORETICAL", content: "- Étapes: séparation, condamnation, identification, VAT, MALT" },
      { title: "Consignation HT", order: 3, type: "THEORETICAL", content: "- Spécificités HT\n- Procédure de déconsignation" },
      { title: "Mise en situation pratique", order: 4, type: "PRACTICAL", content: "- Consignation/déconsignation BT et HT" },
    ],
    teachingMeans: "Apports théoriques, études de cas, exercices pratiques.",
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "Attestation de formation BC/HC + avis d'habilitation remis à l'employeur.",
    renewalRecommendation: "Recyclage recommandé tous les 3 ans selon NF C 18-510.",
  },

  // 27) BR Habilitation Électrique
  {
    categoryName: "Habilitations électriques",
    title: "Habilitation Électrique BR — Interventions générales en basse tension",
    shortDescription: "Réaliser des interventions générales de dépannage et maintenance en BT.",
    longDescription: "La formation BR permet aux électriciens d'effectuer en sécurité des interventions générales en BT (dépannage, maintenance, remplacement, raccordement).",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Personnel électricien réalisant des interventions de dépannage et maintenance en BT.",
    prerequisites: "Solides connaissances en électricité obligatoires. Expérience professionnelle recommandée.",
    objectives: [
      "Identifier les risques liés aux interventions électriques en BT.",
      "Préparer, organiser et réaliser une intervention générale en BT.",
      "Mettre en œuvre les procédures de consignation adaptées.",
      "Assurer la sécurité lors des interventions électriques.",
    ],
    modules: [
      { title: "Tronc commun BR", order: 1, type: "THEORETICAL", content: "- Rappels fondamentaux\n- Cadre réglementaire et NF C 18-510" },
      { title: "Organisation des interventions", order: 2, type: "THEORETICAL", content: "- Analyse des risques\n- Consignation et déconsignation" },
      { title: "Partie pratique", order: 3, type: "PRACTICAL", content: "- Interventions de dépannage et maintenance\n- Remplacement et raccordement" },
    ],
    teachingMeans: "Apports théoriques, études de cas, exercices pratiques.",
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "Attestation de formation BR + avis d'habilitation remis à l'employeur.",
    renewalRecommendation: "Recyclage recommandé tous les 3 ans selon NF C 18-510.",
  },

  // 28) BP Habilitation Électrique (Photovoltaïque)
  {
    categoryName: "Habilitations électriques",
    title: "Habilitation Électrique BP — Interventions sur installations photovoltaïques",
    shortDescription: "Intervenir en sécurité sur des installations photovoltaïques.",
    longDescription: "La formation BP permet aux électriciens d'effectuer en sécurité des interventions sur des installations PV, en tenant compte des risques spécifiques du courant continu.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Personnel électricien intervenant sur des installations photovoltaïques.",
    prerequisites: "Solides connaissances en électricité obligatoires. Connaissances en PV recommandées.",
    objectives: [
      "Identifier les risques spécifiques aux installations photovoltaïques.",
      "Appliquer les règles de sécurité de la norme NF C 18-510.",
      "Préparer et réaliser une intervention en sécurité sur une installation PV.",
      "Mettre en œuvre les procédures de consignation adaptées au photovoltaïque.",
    ],
    modules: [
      { title: "Tronc commun BP", order: 1, type: "THEORETICAL", content: "- Spécificités du courant continu\n- Architecture d'une installation PV" },
      { title: "Risques spécifiques PV", order: 2, type: "THEORETICAL", content: "- Présence de tension même sans alimentation réseau\n- Zones à risque" },
      { title: "Partie pratique", order: 3, type: "PRACTICAL", content: "- Consignation spécifique PV\n- Interventions de maintenance et dépannage" },
    ],
    teachingMeans: "Apports théoriques, études de cas, exercices pratiques.",
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "Attestation de formation BP + avis d'habilitation remis à l'employeur.",
    renewalRecommendation: "Recyclage recommandé tous les 3 ans selon NF C 18-510.",
  },

  // 29) BF/HF Habilitation Électrique (Travaux en fouilles)
  {
    categoryName: "Habilitations électriques",
    title: "Habilitation Électrique BF/HF — Travaux en fouilles à proximité d'ouvrages électriques",
    shortDescription: "Intervenir en sécurité lors de travaux en fouilles à proximité de réseaux électriques.",
    longDescription: "La formation BF/HF permet aux salariés d'intervenir en sécurité lors de travaux en fouilles à proximité d'ouvrages électriques enterrés BT et/ou HT.",
    durationHours: 7,
    durationDays: 1,
    targetAudience: "Personnel réalisant des travaux de fouilles, terrassement à proximité de réseaux électriques.",
    prerequisites: "Aucun prérequis technique en électricité n'est exigé. Sensibilisation AIPR recommandée.",
    objectives: [
      "Identifier les risques électriques liés aux ouvrages enterrés.",
      "Reconnaître les réseaux électriques BT et HT en fouilles.",
      "Appliquer les règles de sécurité de la norme NF C 18-510.",
      "Travailler en sécurité à proximité d'ouvrages électriques enterrés.",
      "Réagir efficacement en cas d'incident.",
    ],
    modules: [
      { title: "Tronc commun BF/HF", order: 1, type: "THEORETICAL", content: "- Notions sur les risques électriques\n- Cadre réglementaire" },
      { title: "Travaux en fouilles BT", order: 2, type: "THEORETICAL", content: "- Spécificités des réseaux BT\n- Distances de sécurité" },
      { title: "Travaux en fouilles HT", order: 3, type: "THEORETICAL", content: "- Dangers des réseaux HT\n- Zones de danger renforcées" },
      { title: "Mise en situation", order: 4, type: "PRACTICAL", content: "- Analyse de situations à risque\n- Conduite à tenir" },
    ],
    teachingMeans: "Apports théoriques, études de cas, mises en situation.",
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "Attestation de formation BF/HF + avis d'habilitation remis à l'employeur.",
    renewalRecommendation: "Recyclage recommandé tous les 3 ans selon NF C 18-510.",
  },

  // 30) Formation Incendie EPI
  {
    categoryName: "Sécurité incendie & sûreté",
    title: "Formation Incendie EPI — Équipier de Première Intervention",
    shortDescription: "Intervenir efficacement en cas de départ de feu et utiliser les moyens de première intervention.",
    longDescription: "La formation EPI permet aux salariés d'intervenir efficacement en cas de départ de feu, d'utiliser les moyens de première intervention et d'adopter les bons comportements.",
    durationHours: 4,
    targetAudience: "Tout salarié désigné Équipier de Première Intervention.",
    objectives: [
      "Identifier les risques d'incendie dans l'entreprise.",
      "Reconnaître un départ de feu.",
      "Donner l'alerte efficacement.",
      "Utiliser un extincteur adapté.",
      "Adopter un comportement sécurisé face à un incendie.",
    ],
    modules: [
      { title: "Théorie incendie", order: 1, type: "THEORETICAL", content: "- Triangle du feu\n- Classes de feu\n- Causes d'incendie" },
      { title: "Organisation sécurité incendie", order: 2, type: "THEORETICAL", content: "- Consignes internes\n- Rôle de l'EPI" },
      { title: "Manipulation extincteurs", order: 3, type: "PRACTICAL", content: "- Eau, CO₂, poudre\n- Mise en situation sur feu réel ou simulateur" },
    ],
    teachingMeans: "Apports théoriques, exercices pratiques, mise en situation.",
    evaluationMethods: "Exercices pratiques.",
    validationMethod: "Attestation de formation EPI.",
    renewalRecommendation: "Recyclage recommandé tous les 1 à 2 ans.",
  },

  // 31) Manipulation des extincteurs
  {
    categoryName: "Sécurité incendie & sûreté",
    title: "Manipulation des extincteurs",
    shortDescription: "Manipuler efficacement un extincteur face à un départ de feu.",
    longDescription: "Cette formation permet aux salariés de manipuler efficacement un extincteur face à un départ de feu, en toute sécurité.",
    durationHours: 2,
    targetAudience: "Tout salarié.",
    objectives: [
      "Identifier les classes de feu.",
      "Choisir l'extincteur adapté.",
      "Manipuler un extincteur en sécurité.",
    ],
    modules: [
      { title: "Types d'extincteurs", order: 1, type: "THEORETICAL", content: "- Eau, poudre, CO₂\n- Classes de feu" },
      { title: "Exercices pratiques", order: 2, type: "PRACTICAL", content: "- Distances et techniques d'attaque\n- Feu réel ou simulateur" },
    ],
    teachingMeans: "Apports théoriques, exercices pratiques.",
    evaluationMethods: "Exercices pratiques.",
    validationMethod: "Attestation de formation.",
    renewalRecommendation: "Recyclage recommandé tous les 1 à 2 ans.",
  },

  // 32) Évacuation incendie
  {
    categoryName: "Sécurité incendie & sûreté",
    title: "Évacuation incendie — Guide-file / Serre-file",
    shortDescription: "Assurer une évacuation rapide, ordonnée et sécurisée en cas d'incendie.",
    longDescription: "Former les salariés désignés guide-file et serre-file à assurer une évacuation rapide, ordonnée et sécurisée des occupants en cas d'incendie.",
    durationHours: 3,
    targetAudience: "Salariés désignés guide-file / serre-file.",
    objectives: [
      "Connaître les consignes d'évacuation.",
      "Identifier les cheminements et points de rassemblement.",
      "Gérer le flux des personnes.",
      "Assurer la sécurité lors de l'évacuation.",
    ],
    modules: [
      { title: "Rôles et responsabilités", order: 1, type: "THEORETICAL", content: "- Guide-file / serre-file\n- Signal d'alarme" },
      { title: "Organisation de l'évacuation", order: 2, type: "THEORETICAL", content: "- Cheminements\n- Points de rassemblement" },
      { title: "Exercice d'évacuation", order: 3, type: "PRACTICAL", content: "- Mise en situation réelle" },
    ],
    teachingMeans: "Apports théoriques, mise en situation.",
    evaluationMethods: "Mise en situation.",
    validationMethod: "Attestation de formation.",
    renewalRecommendation: "Recyclage recommandé tous les 1 à 2 ans.",
  },

  // 33) SSIAP 1
  {
    categoryName: "Sécurité incendie & sûreté",
    title: "SSIAP 1 — Agent de Service de Sécurité Incendie et d'Assistance à Personnes",
    shortDescription: "Exercer la fonction d'agent de sécurité incendie conformément à l'arrêté du 2 mai 2005.",
    longDescription: "La formation SSIAP 1 prépare les stagiaires à exercer la fonction d'agent de sécurité incendie, conformément à l'arrêté du 2 mai 2005 modifié.",
    durationHours: 67,
    targetAudience: "Agents de sécurité, personnel souhaitant accéder à la fonction SSIAP 1.",
    prerequisites: "Aptitude médicale. PSC1 ou équivalent valide. Compréhension du français.",
    objectives: [
      "Prévenir les incendies.",
      "Intervenir sur un début d'incendie.",
      "Alerter et accueillir les secours.",
      "Assurer l'assistance aux personnes.",
    ],
    modules: [
      { title: "Le feu et ses conséquences", order: 1, type: "THEORETICAL", content: "- Comportement du feu\n- Propagation" },
      { title: "Sécurité incendie", order: 2, type: "THEORETICAL", content: "- Réglementation ERP/IGH\n- Installations techniques" },
      { title: "Rôle et missions de l'agent SSIAP", order: 3, type: "THEORETICAL", content: "- Prévention\n- Intervention" },
      { title: "Mises en situation pratiques", order: 4, type: "PRACTICAL", content: "- Rondes\n- Intervention sur sinistre" },
    ],
    teachingMeans: "Apports théoriques, exercices pratiques, mises en situation.",
    evaluationMethods: "Examen théorique + examen pratique.",
    validationMethod: "Diplôme SSIAP 1.",
    renewalRecommendation: "MAC obligatoire tous les 3 ans.",
  },

  // 34) SSIAP 2
  {
    categoryName: "Sécurité incendie & sûreté",
    title: "SSIAP 2 — Chef d'Équipe de Service de Sécurité Incendie",
    shortDescription: "Exercer la fonction de chef d'équipe sécurité incendie.",
    longDescription: "La formation SSIAP 2 prépare à la fonction de chef d'équipe, responsable de la coordination des agents SSIAP 1.",
    durationHours: 70,
    targetAudience: "Agents SSIAP 1 souhaitant évoluer. Chefs d'équipe sécurité incendie.",
    prerequisites: "Être titulaire du SSIAP 1. Expérience professionnelle requise. Aptitude médicale.",
    objectives: [
      "Encadrer une équipe SSIAP.",
      "Gérer les interventions incendie.",
      "Former et organiser les équipes.",
      "Appliquer la réglementation ERP/IGH.",
    ],
    modules: [
      { title: "Rôles et responsabilités du chef d'équipe", order: 1, type: "THEORETICAL", content: "- Management\n- Gestion du PCS" },
      { title: "Management opérationnel", order: 2, type: "THEORETICAL", content: "- Organisation des équipes\n- Gestion des interventions" },
      { title: "Exercices pratiques", order: 3, type: "PRACTICAL", content: "- Mises en situation de gestion d'équipe" },
    ],
    teachingMeans: "Apports théoriques, exercices pratiques, mises en situation.",
    evaluationMethods: "Examen théorique + examen pratique.",
    validationMethod: "Diplôme SSIAP 2.",
    renewalRecommendation: "MAC obligatoire tous les 3 ans.",
  },

  // 35) H1 Habilitation Électrique Haute Tension
  {
    categoryName: "Habilitations électriques",
    title: "Habilitation Électrique H1 — Exécutant électricien haute tension",
    shortDescription: "Réaliser des travaux d'ordre électrique en haute tension sous la responsabilité d'un chargé de travaux.",
    longDescription: "La formation H1 permet aux électriciens d'effectuer des travaux d'ordre électrique en haute tension, conformément à la norme NF C 18-510.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Personnel électricien amené à intervenir sur des installations haute tension.",
    prerequisites: "Solides connaissances en électricité obligatoires. Expérience professionnelle en électricité requise.",
    objectives: [
      "Identifier les risques spécifiques liés aux installations haute tension.",
      "Comprendre le cadre réglementaire et les responsabilités associées.",
      "Appliquer les règles de sécurité de la norme NF C 18-510 en HT.",
      "Réaliser des travaux électriques en qualité d'exécutant H1.",
      "Adopter un comportement sécurisé lors des interventions en haute tension.",
    ],
    modules: [
      { title: "Tronc commun H1", order: 1, type: "THEORETICAL", content: "- Rappels fondamentaux en électricité HT\n- Effets du courant électrique" },
      { title: "Spécificités HT", order: 2, type: "THEORETICAL", content: "- Zones d'environnement électrique HT\n- Consignation, balisage en HT" },
      { title: "Sécurité et EPI", order: 3, type: "THEORETICAL", content: "- Équipements de protection\n- Conduite à tenir en cas d'incident" },
      { title: "Mise en situation pratique", order: 4, type: "PRACTICAL", content: "- Travaux électriques HT sous responsabilité" },
    ],
    teachingMeans: "Apports théoriques, études de cas HT, exercices pratiques.",
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "Attestation de formation H1 + avis d'habilitation remis à l'employeur.",
    renewalRecommendation: "Recyclage recommandé tous les 3 ans selon NF C 18-510.",
  },

  // 36) H2 Habilitation Électrique Haute Tension
  {
    categoryName: "Habilitations électriques",
    title: "Habilitation Électrique H2 — Chargé de travaux haute tension",
    shortDescription: "Diriger et organiser des travaux d'ordre électrique en haute tension.",
    longDescription: "La formation H2 permet aux électriciens d'assurer la direction, l'organisation et la surveillance de travaux électriques en HT, conformément à la norme NF C 18-510.",
    durationHours: 14,
    durationDays: 2,
    targetAudience: "Personnel électricien amené à encadrer et diriger des travaux électriques en haute tension.",
    prerequisites: "Solides connaissances en électricité obligatoires. Expérience professionnelle confirmée en électricité HT recommandée.",
    objectives: [
      "Identifier les risques spécifiques liés aux installations haute tension.",
      "Organiser, diriger et surveiller des travaux électriques en qualité de chargé de travaux H2.",
      "Mettre en œuvre les mesures de prévention adaptées.",
      "Assurer la sécurité des personnes et des biens lors des interventions en haute tension.",
    ],
    modules: [
      { title: "Tronc commun H2", order: 1, type: "THEORETICAL", content: "- Rappels fondamentaux en électricité HT\n- Cadre réglementaire et NF C 18-510" },
      { title: "Organisation des travaux HT", order: 2, type: "THEORETICAL", content: "- Analyse des risques\n- Coordination des intervenants" },
      { title: "Consignation et sécurité HT", order: 3, type: "THEORETICAL", content: "- Consignation, balisage\n- Gestion des situations d'urgence" },
      { title: "Mise en situation pratique", order: 4, type: "PRACTICAL", content: "- Organisation et direction de travaux HT" },
    ],
    teachingMeans: "Apports théoriques, études de cas HT, exercices pratiques.",
    evaluationMethods: "QCM + évaluation pratique.",
    validationMethod: "Attestation de formation H2 + avis d'habilitation remis à l'employeur.",
    renewalRecommendation: "Recyclage recommandé tous les 3 ans selon NF C 18-510.",
  },

  // 37) F0 Formation Formateur Tronc Commun
  {
    categoryName: "Formation de formateurs",
    title: "F0 — Devenir formateur professionnel en prévention, sécurité et réglementation",
    shortDescription: "Acquérir les compétences pour devenir formateur professionnel conforme aux exigences Qualiopi.",
    longDescription: "La formation F0 permet à des professionnels indépendants de devenir formateurs compétents, structurés et conformes aux exigences réglementaires et Qualiopi.",
    durationHours: 28,
    durationDays: 4,
    targetAudience: "Professionnels indépendants, experts métiers souhaitant transmettre leurs compétences.",
    prerequisites: "Expertise métier dans au moins un domaine de la prévention ou de la sécurité. Maîtrise orale du français.",
    objectives: [
      "Comprendre le cadre réglementaire de la formation professionnelle.",
      "Adopter la posture et les responsabilités du formateur professionnel.",
      "Concevoir une action de formation structurée et conforme à Qualiopi.",
      "Animer une formation en présentiel de manière efficace.",
      "Évaluer les acquis des stagiaires.",
      "Assurer la traçabilité et la conformité documentaire d'une formation.",
    ],
    modules: [
      { title: "Le cadre de la formation professionnelle", order: 1, type: "THEORETICAL", content: "- Système de formation en France\n- Obligations légales" },
      { title: "Posture et rôle du formateur", order: 2, type: "THEORETICAL", content: "- Communication pédagogique\n- Gestion d'un groupe d'adultes" },
      { title: "Ingénierie pédagogique", order: 3, type: "THEORETICAL", content: "- Objectifs pédagogiques\n- Construction d'un programme" },
      { title: "Animation d'une formation", order: 4, type: "PRACTICAL", content: "- Techniques d'animation\n- Pédagogie active" },
      { title: "Évaluation et suivi des acquis", order: 5, type: "PRACTICAL", content: "- QCM, mises en situation\n- Attestation et traçabilité" },
      { title: "Qualiopi et conformité documentaire", order: 6, type: "THEORETICAL", content: "- Référentiel Qualiopi\n- Documents obligatoires" },
    ],
    teachingMeans: "Apports théoriques, travaux pratiques, exercices d'animation.",
    evaluationMethods: "Évaluations continues, mise en situation pédagogique.",
    validationMethod: "Attestation de formation F0.",
    renewalRecommendation: "Actualisation des compétences recommandée tous les 3 ans.",
  },

  // 38) F-A Formation Formateur Travail en Hauteur
  {
    categoryName: "Formation de formateurs",
    title: "F-A — Devenir formateur en Travail en Hauteur & Équipements",
    shortDescription: "Concevoir, animer et évaluer des formations en travail en hauteur.",
    longDescription: "La formation F-A permet à des professionnels indépendants de concevoir, animer et évaluer des formations en travail en hauteur, conformément aux exigences réglementaires et Qualiopi.",
    durationHours: 28,
    durationDays: 4,
    targetAudience: "Formateurs indépendants, professionnels du BTP, de l'industrie ou de la maintenance souhaitant devenir formateurs.",
    prerequisites: "Être titulaire du F0. Expérience professionnelle significative en travail en hauteur.",
    objectives: [
      "Maîtriser le cadre réglementaire du travail en hauteur.",
      "Concevoir une formation travail en hauteur conforme à Qualiopi.",
      "Animer des formations pratiques en toute sécurité.",
      "Évaluer les acquis théoriques et pratiques des stagiaires.",
    ],
    modules: [
      { title: "Réglementation travail en hauteur", order: 1, type: "THEORETICAL", content: "- Code du travail\n- Hiérarchie des moyens de protection" },
      { title: "Ingénierie pédagogique Bloc A", order: 2, type: "THEORETICAL", content: "- Programmes travail en hauteur, échafaudages, chef de manœuvre" },
      { title: "Animation des formations pratiques", order: 3, type: "PRACTICAL", content: "- Organisation d'un plateau pédagogique\n- Sécurisation des zones" },
      { title: "Modules complémentaires", order: 4, type: "PRACTICAL", content: "- Port du harnais, PIRL, filets de sécurité" },
      { title: "Évaluation et validation", order: 5, type: "PRACTICAL", content: "- Évaluation théorique et pratique\n- Critères d'évaluation" },
    ],
    teachingMeans: "Apports théoriques, travaux pratiques de conception, mises en situation d'animation.",
    evaluationMethods: "Évaluations continues, mise en situation d'animation réelle.",
    validationMethod: "Attestation de formation F-A.",
    renewalRecommendation: "Actualisation des compétences recommandée tous les 3 ans.",
  },

  // 39) F-B Formation Formateur Prévention Santé Sécurité
  {
    categoryName: "Formation de formateurs",
    title: "F-B — Devenir formateur en Prévention, Santé & Sécurité",
    shortDescription: "Concevoir, animer et évaluer des formations en prévention des risques professionnels.",
    longDescription: "La formation F-B permet à des professionnels indépendants de concevoir, animer et évaluer des formations en prévention des risques professionnels, conformément aux exigences Qualiopi.",
    durationHours: 28,
    durationDays: 4,
    targetAudience: "Formateurs indépendants, professionnels de la prévention, QHSE, sécurité.",
    prerequisites: "Être titulaire du F0. Expérience professionnelle ou expertise en prévention des risques.",
    objectives: [
      "Maîtriser le cadre réglementaire de la prévention et de la santé au travail.",
      "Concevoir des formations conformes à Qualiopi.",
      "Animer des formations prévention de manière dynamique et efficace.",
      "Évaluer les acquis théoriques et pratiques des stagiaires.",
    ],
    modules: [
      { title: "Cadre réglementaire prévention", order: 1, type: "THEORETICAL", content: "- Code du travail\n- Obligations employeur/salarié" },
      { title: "Ingénierie pédagogique Bloc B", order: 2, type: "THEORETICAL", content: "- Programmes SST, Gestes et postures, PRAP, ATEX" },
      { title: "Animation des formations prévention", order: 3, type: "PRACTICAL", content: "- Techniques d'animation\n- Gestion des groupes" },
      { title: "Évaluation et validation", order: 4, type: "PRACTICAL", content: "- Évaluation théorique et pratique\n- Traçabilité Qualiopi" },
    ],
    teachingMeans: "Apports théoriques, travaux pratiques de conception, mises en situation d'animation.",
    evaluationMethods: "Évaluations continues, mise en situation d'animation réelle.",
    validationMethod: "Attestation de formation F-B.",
    renewalRecommendation: "Actualisation des compétences recommandée tous les 3 ans.",
  },

  // 40) Module Port du Harnais
  {
    categoryName: "Travaux en hauteur & échafaudages",
    title: "Module Port du Harnais — Utilisation des EPI antichute",
    shortDescription: "Utiliser en sécurité les équipements de protection individuelle contre les chutes de hauteur.",
    longDescription: "Le module Port du harnais forme les salariés à l'utilisation en sécurité des EPI antichute (harnais, longes, systèmes antichute), conformément à la réglementation et aux notices fabricants.",
    durationHours: 3.5,
    targetAudience: "Tout salarié amené à utiliser un harnais antichute.",
    prerequisites: "Aptitude médicale au travail en hauteur requise. Avoir suivi ou suivre la formation Travail en hauteur.",
    objectives: [
      "Identifier les risques de chute nécessitant le port d'un harnais.",
      "Reconnaître les différents équipements antichute.",
      "Vérifier l'état et la conformité des EPI.",
      "Mettre en place et ajuster correctement un harnais.",
      "Utiliser un système antichute en respectant les consignes de sécurité.",
    ],
    modules: [
      { title: "Rappel réglementaire", order: 1, type: "THEORETICAL", content: "- EPI antichute\n- Normes EN" },
      { title: "Présentation des équipements", order: 2, type: "THEORETICAL", content: "- Harnais, longes, absorbeurs, lignes de vie" },
      { title: "Mise en pratique", order: 3, type: "PRACTICAL", content: "- Vérification, mise en place, réglage\n- Utilisation en situation" },
    ],
    teachingMeans: "Apports théoriques ciblés, exercices pratiques individuels.",
    evaluationMethods: "Évaluation pratique lors des mises en situation.",
    validationMethod: "Attestation de formation – Module Port du harnais.",
  },

  // 41) Module PIRL
  {
    categoryName: "Travaux en hauteur & échafaudages",
    title: "Module PIRL — Plateforme Individuelle Roulante Légère",
    shortDescription: "Utiliser en sécurité les plateformes individuelles roulantes légères.",
    longDescription: "Le module PIRL forme les salariés à l'utilisation en sécurité des PIRL, afin de prévenir les risques de chute et de renversement.",
    durationHours: 3.5,
    targetAudience: "Salariés utilisant des PIRL pour des travaux en hauteur.",
    prerequisites: "Aptitude médicale au travail en hauteur requise. Avoir suivi ou suivre la formation Travail en hauteur.",
    objectives: [
      "Identifier les risques liés à l'utilisation d'une PIRL.",
      "Vérifier la conformité de la PIRL avant utilisation.",
      "Utiliser une PIRL dans le respect des règles de sécurité.",
      "Se déplacer et travailler en hauteur en toute sécurité.",
    ],
    modules: [
      { title: "Réglementation PIRL", order: 1, type: "THEORETICAL", content: "- Types de PIRL\n- Règles d'utilisation" },
      { title: "Vérifications", order: 2, type: "THEORETICAL", content: "- Contrôles avant utilisation" },
      { title: "Mise en pratique", order: 3, type: "PRACTICAL", content: "- Utilisation et déplacement en sécurité" },
    ],
    teachingMeans: "Apports théoriques ciblés, exercices pratiques sur PIRL.",
    evaluationMethods: "Évaluation pratique lors des exercices.",
    validationMethod: "Attestation de formation – Module PIRL.",
  },

  // 42) Module Filet de sécurité
  {
    categoryName: "Travaux en hauteur & échafaudages",
    title: "Module Filet de sécurité — Protection collective contre les chutes",
    shortDescription: "Comprendre l'utilisation des filets de sécurité comme protection collective.",
    longDescription: "Le module Filet de sécurité sensibilise les salariés à l'utilisation des filets comme moyen de protection collective contre les chutes de hauteur.",
    durationHours: 3.5,
    targetAudience: "Salariés intervenant sur des chantiers équipés de filets de sécurité.",
    prerequisites: "Aptitude médicale au travail en hauteur requise. Avoir suivi ou suivre la formation Travail en hauteur.",
    objectives: [
      "Identifier les risques de chute nécessitant une protection collective.",
      "Comprendre le rôle et les limites des filets de sécurité.",
      "Reconnaître les différents types de filets.",
      "Respecter les consignes de travail en présence de filets.",
      "Adopter un comportement sécurisé sur les zones protégées.",
    ],
    modules: [
      { title: "Protection collective", order: 1, type: "THEORETICAL", content: "- Principes de protection\n- Réglementation" },
      { title: "Types de filets", order: 2, type: "THEORETICAL", content: "- Domaines d'utilisation\n- Limites" },
      { title: "Études de cas", order: 3, type: "PRACTICAL", content: "- Situations à risque\n- Consignes de sécurité" },
    ],
    teachingMeans: "Apports théoriques ciblés, études de cas issues du terrain.",
    evaluationMethods: "Évaluation continue.",
    validationMethod: "Attestation de formation – Module Filet de sécurité.",
  },
];

/* -----------------------------
 *   HELPERS (catégories déjà en DB)
 * ----------------------------*/
async function loadCategoryIndex() {
  const cats = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
  });
  const byName = new Map<string, number>();
  const bySlug = new Map<string, number>();
  for (const c of cats) {
    if (c.name) byName.set(c.name.toLowerCase(), c.id);
    if (c.slug) bySlug.set(c.slug.toLowerCase(), c.id);
  }
  return { byName, bySlug };
}

async function getCategoryIdOrThrow(
  wantedName: string,
  idx: { byName: Map<string, number>; bySlug: Map<string, number> }
) {
  const byName = idx.byName.get(wantedName.toLowerCase());
  if (byName) return byName;
  const guessSlug = slugify(wantedName);
  const bySlug = idx.bySlug.get(guessSlug);
  if (bySlug) return bySlug;
  throw new Error(
    `Category "${wantedName}" not found in DB. Please ensure it matches exactly your Category.name.`
  );
}

async function ensureTrainingCategories(
  idx: { byName: Map<string, number>; bySlug: Map<string, number> }
) {
  const names = new Set(trainings.map((t) => t.categoryName));
  for (const name of names) {
    const lowerName = name.toLowerCase();
    if (idx.byName.has(lowerName)) continue;
    const slug = slugify(name);
    const slugKey = slug.toLowerCase();
    const existingBySlug = idx.bySlug.get(slugKey);
    if (existingBySlug) {
      idx.byName.set(lowerName, existingBySlug);
      continue;
    }
    // Check if category exists by slug first
    let category = await prisma.category.findFirst({
      where: { slug },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { name, slug },
      });
    }
    idx.byName.set(lowerName, category.id);
    idx.bySlug.set(category.slug.toLowerCase(), category.id);
  }
}

/* -----------------------------
 *   UPSERT TRAINING + relations
 * ----------------------------*/
async function upsertTrainingWithExistingCategory(
  data: TrainingSeed,
  idx: { byName: Map<string, number>; bySlug: Map<string, number> }
) {
  const categoryId = await getCategoryIdOrThrow(data.categoryName, idx);
  const slug = slugify(data.title);

  const training = await prisma.training.upsert({
    where: { slug },
    update: {
      categoryId,
      title: data.title,
      shortDescription: data.shortDescription ?? null,
      longDescription: data.longDescription ?? null,
      imageUrl: data.imageUrl ?? null,
      durationHours: data.durationHours ?? null,
      durationDays: data.durationDays ?? null,
      successRate: data.successRate ?? null,
      targetAudience: data.targetAudience ?? null,
      learningObjectives: data.learningObjectives ?? null,
      prerequisites: data.prerequisites ?? null,
      technicalMeans: data.technicalMeans ?? null,
      teachingMeans: data.teachingMeans ?? null,
      evaluationMethods: data.evaluationMethods ?? null,
      validationMethod: data.validationMethod ?? null,
      monitoringMethods: data.monitoringMethods ?? null,
      renewalRecommendation: data.renewalRecommendation ?? null,
      status: "PUBLISHED",
    },
    create: {
      categoryId,
      title: data.title,
      slug,
      shortDescription: data.shortDescription ?? null,
      longDescription: data.longDescription ?? null,
      imageUrl: data.imageUrl ?? null,
      durationHours: data.durationHours ?? null,
      durationDays: data.durationDays ?? null,
      successRate: data.successRate ?? null,
      targetAudience: data.targetAudience ?? null,
      learningObjectives: data.learningObjectives ?? null,
      prerequisites: data.prerequisites ?? null,
      technicalMeans: data.technicalMeans ?? null,
      teachingMeans: data.teachingMeans ?? null,
      evaluationMethods: data.evaluationMethods ?? null,
      validationMethod: data.validationMethod ?? null,
      monitoringMethods: data.monitoringMethods ?? null,
      renewalRecommendation: data.renewalRecommendation ?? null,
      status: "PUBLISHED",
    },
  });

  // objectifs détaillés
  if (data.objectives?.length) {
    await prisma.trainingObjective.deleteMany({
      where: { trainingId: training.id },
    });
    await prisma.trainingObjective.createMany({
      data: data.objectives.map((text) => ({ trainingId: training.id, text })),
    });
  }

  // modules
  if (data.modules?.length) {
    await prisma.trainingModule.deleteMany({
      where: { trainingId: training.id },
    });
    await prisma.trainingModule.createMany({
      data: data.modules.map((m) => ({
        trainingId: training.id,
        title: m.title,
        order: m.order,
        type: m.type ?? null,
        content: m.content ?? null,
      })),
    });
  }

  return training;
}

/* -----------------------------
 *   MAIN
 * ----------------------------*/
async function main() {
  console.log("🌱 Loading categories from DB...");
  const idx = await loadCategoryIndex();

  console.log("🌱 Ensuring categories...");
  await ensureTrainingCategories(idx);

  console.log("🌱 Seeding trainings...");
  for (const t of trainings) {
    const tr = await upsertTrainingWithExistingCategory(t, idx);
    console.log(`✅ ${tr.title}`);
  }
  console.log("✅ Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
