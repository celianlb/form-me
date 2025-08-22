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
  durationHours?: number;
  durationDays?: number;
  minParticipants?: number;
  maxParticipants?: number;
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
  priceExclTax?: number;
  availableInCenter?: boolean;
  availableElearning?: boolean;

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
      "Sensibiliser aux risques liés aux atmosphères explosives et adopter les comportements sécuritaires lors d’interventions en zones ATEX. Conforme à la directive ATEX 1999/92/CE et au Code du travail (R4227-42 à R4227-54).",
    durationHours: 7,
    durationDays: 1,
    minParticipants: 8,
    maxParticipants: 10,
    targetAudience:
      "Salariés travaillant/circulant en zones ATEX sans maintenance; intervenants ponctuels en zones classées.",
    objectives: [
      "Comprendre ce qu’est une atmosphère explosive.",
      "Identifier les zones ATEX et leur classification.",
      "Connaître les sources d’inflammation et leurs conséquences.",
      "Adopter les comportements sécuritaires en zone ATEX.",
      "Connaître les règles de circulation et d’utilisation des équipements.",
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
          "- Définition ATEX; gaz/vapeurs/poussières\n- Triangle de l’explosion",
      },
      {
        title: "Classification des zones",
        order: 3,
        type: "THEORETICAL",
        content: "- Gaz: 0/1/2; Poussières: 20/21/22\n- Signalisation et accès",
      },
      {
        title: "Sources d’inflammation",
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
          "- EPI; règles de circulation\n- Consignes & procédures d’urgence",
      },
      {
        title: "Ateliers pratiques",
        order: 6,
        type: "PRACTICAL",
        content:
          "- Études de cas d’accidents\n- Identification de zones sur plans\n- Simulation d’entrée en zone ATEX",
      },
    ],
    teachingMeans:
      "Alternance théorie/exercices; supports multimédia; mise en situation si possible.",
    evaluationMethods: "QCM + exercices pratiques.",
    validationMethod: "Attestation ATEX Niveau 0.",
    monitoringMethods: "Feuilles d’émargement (½ journée).",
    renewalRecommendation:
      "Remise à niveau conseillée tous les 3 ans ou en cas d’évolution/incident.",
  },

  // 2) H0 – B0 – H0V
  {
    categoryName: "Habilitations électriques",
    title: "Habilitation Électrique H0 – B0 – H0V",
    shortDescription:
      "Sensibilisation des non-électriciens aux risques électriques et au voisinage.",
    longDescription:
      "Former les non-électriciens aux risques électriques et à l’intervention en sécurité au voisinage d’installations. Conforme NF C18-510 et Code du travail (R4544-9 à R4544-11).",
    durationHours: 7,
    durationDays: 1,
    minParticipants: 8,
    maxParticipants: 10,
    targetAudience:
      "Non-électriciens intervenant dans/à proximité d’installations électriques.",
    objectives: [
      "Comprendre les risques liés à l’électricité.",
      "Identifier zones et limites d’intervention.",
      "Connaître les règles de sécurité au voisinage.",
      "Adopter les bons comportements en incident.",
      "Préparer l’habilitation H0-B0 ou H0V.",
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
      "Former des non-électriciens à réaliser de petites interventions d’ordre électrique en sécurité (NF C18-510).",
    durationHours: 14,
    durationDays: 2,
    minParticipants: 6,
    maxParticipants: 8,
    targetAudience:
      "Personnel non-électricien désigné pour de petites interventions (maintenance, techniciens...).",
    objectives: [
      "Identifier les risques des interventions simples.",
      "Connaître la réglementation applicable.",
      "Réaliser des manœuvres élémentaires en sécurité.",
      "Réagir en cas d’incident.",
      "Obtenir l’habilitation BS ou BE Manœuvre.",
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
    minParticipants: 8,
    maxParticipants: 12,
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
    title: "AIPR — Autorisation d’Intervention à Proximité des Réseaux",
    shortDescription:
      "Préparer et réussir l’examen AIPR (opérateur/encadrant/concepteur).",
    longDescription:
      "Travail en sécurité à proximité des réseaux aériens/souterrains (DT-DICT, arrêté du 15/02/2012).",
    durationHours: 7,
    durationDays: 1,
    minParticipants: 8,
    maxParticipants: 12,
    targetAudience:
      "Terrassiers, conducteurs d’engins, encadrants, concepteurs intervenant à proximité des réseaux.",
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
    minParticipants: 6,
    maxParticipants: 8,
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
    minParticipants: 6,
    maxParticipants: 8,
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
    minParticipants: 6,
    maxParticipants: 8,
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
    minParticipants: 6,
    maxParticipants: 8,
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
    minParticipants: 6,
    maxParticipants: 8,
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
    minParticipants: 8,
    maxParticipants: 10,
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
    minParticipants: 8,
    maxParticipants: 10,
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
    minParticipants: 8,
    maxParticipants: 10,
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
      "Permettre d’intervenir efficacement face à un accident du travail en attendant les secours. Conforme référentiel INRS; Code du travail (R4224-14 à R4224-16).",
    durationHours: 14,
    durationDays: 2,
    minParticipants: 4,
    maxParticipants: 12,
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
    minParticipants: 8,
    maxParticipants: 10,
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
    minParticipants: 6,
    maxParticipants: 8,
    targetAudience:
      "Conducteurs d’engins de chantier (selon catégories visées).",
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
      durationHours: data.durationHours ?? null,
      durationDays: data.durationDays ?? null,
      minParticipants: data.minParticipants ?? 1,
      maxParticipants: data.maxParticipants ?? null,
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
      priceExclTax: data.priceExclTax ?? null,
      availableInCenter: data.availableInCenter ?? true,
      availableElearning: data.availableElearning ?? false,
      status: "PUBLISHED",
    },
    create: {
      categoryId,
      title: data.title,
      slug,
      shortDescription: data.shortDescription ?? null,
      longDescription: data.longDescription ?? null,
      durationHours: data.durationHours ?? null,
      durationDays: data.durationDays ?? null,
      minParticipants: data.minParticipants ?? 1,
      maxParticipants: data.maxParticipants ?? null,
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
      priceExclTax: data.priceExclTax ?? null,
      availableInCenter: data.availableInCenter ?? true,
      availableElearning: data.availableElearning ?? false,
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
