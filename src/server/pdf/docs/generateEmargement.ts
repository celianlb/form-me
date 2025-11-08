/**
 * Service de génération de Feuilles d'Émargement - VERSION TEMPLATE PROGRAMMATIQUE
 * Génère un PDF par session (date + matin/après-midi)
 */
import { prisma } from "@/lib/prisma";
import type { EmargementInputType } from "@/lib/validations/docs";
import { StandardFonts, rgb } from "pdf-lib";
import { generateEmargementTemplate } from "../templates/emargementTemplate";
import { uploadBuffer } from "./cloudinary";
import {
  formatDateFR,
  formatDateForFilename,
  formatTimeFR,
  sanitizeFilename,
  sanitizeText,
} from "./format";

/**
 * Coordonnées pour le remplissage dynamique
 * ⚠️ SYNCHRONISÉES avec test-emargement-template.ts
 */
const COORDS = {
  organismeNom: { x: 430, y: 810 },
  formationNom: { x: 150, y: 673 },
  formationDate: { x: 173, y: 648 },
  formationLieu: { x: 153, y: 598 },
  formateurNom: { x: 205, y: 517 },
  formateurHeure: { x: 125, y: 438 },
  stagiaireNom: { x: 50, y: 280 },
  stagiairePrenom: { x: 170, y: 280 },
  stagiaireDateNaissance: { x: 295, y: 280 },
  stagiaireLineHeight: 50,
  stagiaireNomContinuation: { x: 50, y: 625 },
  stagiaireePrenomContinuation: { x: 170, y: 625 },
  stagiaireDateNaissanceContinuation: { x: 295, y: 625 },
} as const;

interface EmargementResult {
  batchId: string;
  documents: Array<{
    documentId: string;
    pdfUrl: string;
    label: string;
  }>;
}

/**
 * Génère des feuilles d'émargement (1 PDF par session)
 */
export async function generateEmargement(
  input: EmargementInputType,
  userId: number
): Promise<EmargementResult> {
  try {
    const documents: Array<{
      documentId: string;
      pdfUrl: string;
      label: string;
    }> = [];

    // Générer un batchId unique pour regrouper tous les PDFs
    const batchId = `batch_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // Pour chaque session, générer un ou deux PDFs (matin ET/OU après-midi)
    for (const session of input.sessions) {
      const sessionDate = formatDateFR(session.dateISO);

      // Si matin existe
      if (session.matin) {
        const pdfData = await generateSingleEmargementPDF({
          formationNom: input.formationNom,
          entrepriseNom: input.entrepriseNom,
          lieu: input.lieu,
          formateur: input.formateur,
          sessionDate: session.dateISO,
          periode: "matin",
          heureDebut: session.matin.debutISO,
          heureFin: session.matin.finISO,
          stagiaires: input.stagiaires,
        });

        // Upload vers Cloudinary
        const filename = `emargement_${sanitizeFilename(
          input.formationNom
        )}_${formatDateForFilename(session.dateISO)}_matin`;
        const { secure_url, public_id } = await uploadBuffer(
          pdfData,
          "emargements",
          filename
        );

        // Persister en base
        const doc = await prisma.generatedDocument.create({
          data: {
            kind: "EMARGEMENT",
            createdByUserId: userId,
            payloadJson: {
              ...input,
              batchId,
              sessionDate: session.dateISO,
              periode: "matin",
            } as unknown as Record<string, string | number | boolean | null>,
            pdfUrl: secure_url,
            cloudinaryPublicId: public_id,
          },
        });

        documents.push({
          documentId: doc.id,
          pdfUrl: doc.pdfUrl,
          label: `${sessionDate} - Matin`,
        });
      }

      // Si après-midi existe
      if (session.apresMidi) {
        const pdfData = await generateSingleEmargementPDF({
          formationNom: input.formationNom,
          entrepriseNom: input.entrepriseNom,
          lieu: input.lieu,
          formateur: input.formateur,
          sessionDate: session.dateISO,
          periode: "après-midi",
          heureDebut: session.apresMidi.debutISO,
          heureFin: session.apresMidi.finISO,
          stagiaires: input.stagiaires,
        });

        // Upload vers Cloudinary
        const filename = `emargement_${sanitizeFilename(
          input.formationNom
        )}_${formatDateForFilename(session.dateISO)}_apresmidi`;
        const { secure_url, public_id } = await uploadBuffer(
          pdfData,
          "emargements",
          filename
        );

        // Persister en base
        const doc = await prisma.generatedDocument.create({
          data: {
            kind: "EMARGEMENT",
            createdByUserId: userId,
            payloadJson: {
              ...input,
              batchId,
              sessionDate: session.dateISO,
              periode: "après-midi",
            } as unknown as Record<string, string | number | boolean | null>,
            pdfUrl: secure_url,
            cloudinaryPublicId: public_id,
          },
        });

        documents.push({
          documentId: doc.id,
          pdfUrl: doc.pdfUrl,
          label: `${sessionDate} - Après-midi`,
        });
      }
    }

    return {
      batchId,
      documents,
    };
  } catch (error) {
    console.error("Error generating Emargement:", error);
    throw error;
  }
}

/**
 * Génère un seul PDF d'émargement pour une session donnée
 */
async function generateSingleEmargementPDF(params: {
  formationNom: string;
  entrepriseNom: string;
  lieu: string;
  formateur: { prenom: string; nom: string };
  sessionDate: string;
  periode: string;
  heureDebut: string;
  heureFin: string;
  stagiaires: Array<{
    prenom: string;
    nom: string;
    dateNaissanceISO: string;
  }>;
}): Promise<Buffer> {
  // Constante : nombre maximum de stagiaires par page
  const MAX_STAGIAIRES_PREMIERE_PAGE = 4;
  const MAX_STAGIAIRES_PAGE_CONTINUATION = 10; // Plus d'espace sur les pages de continuation

  // Calculer le nombre de pages nécessaires
  let nombrePages = 1; // Au moins la première page
  const stagiaireRestants =
    params.stagiaires.length - MAX_STAGIAIRES_PREMIERE_PAGE;

  if (stagiaireRestants > 0) {
    nombrePages += Math.ceil(
      stagiaireRestants / MAX_STAGIAIRES_PAGE_CONTINUATION
    );
  }

  // 1. Générer le template de base avec le bon nombre de pages
  // Première page avec 4 stagiaires max, pages suivantes avec 10 max
  const pdfDoc = await generateEmargementTemplate(
    nombrePages,
    MAX_STAGIAIRES_PAGE_CONTINUATION
  );

  // 2. Charger les polices
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // 3. Récupérer toutes les pages
  const pages = pdfDoc.getPages();

  // Préparer les données communes (formateur, formation, etc.)
  const formateurNomComplet = `${sanitizeText(
    params.formateur.prenom
  )} ${sanitizeText(params.formateur.nom)}`;
  const heureDebut = formatTimeFR(params.heureDebut);
  const heureFin = formatTimeFR(params.heureFin);

  // === REMPLISSAGE DE CHAQUE PAGE ===
  // Diviser les stagiaires selon la capacité de chaque page
  for (let pageIndex = 0; pageIndex < nombrePages; pageIndex++) {
    const page = pages[pageIndex];
    if (!page) continue;

    const isFirstPage = pageIndex === 0;

    // Calculer quels stagiaires vont sur cette page
    let startIndex: number;
    let endIndex: number;

    if (isFirstPage) {
      // Première page : 0 à 4 stagiaires
      startIndex = 0;
      endIndex = Math.min(
        MAX_STAGIAIRES_PREMIERE_PAGE,
        params.stagiaires.length
      );
    } else {
      // Pages suivantes : groupes de 10
      startIndex =
        MAX_STAGIAIRES_PREMIERE_PAGE +
        (pageIndex - 1) * MAX_STAGIAIRES_PAGE_CONTINUATION;
      endIndex = Math.min(
        startIndex + MAX_STAGIAIRES_PAGE_CONTINUATION,
        params.stagiaires.length
      );
    }

    const stagiairesPage = params.stagiaires.slice(startIndex, endIndex);

    // === REMPLISSAGE DYNAMIQUE DE LA PAGE ===

    if (isFirstPage) {
      // PREMIÈRE PAGE : Toutes les informations

      // EN-TÊTE: Nom de l'entreprise cliente en haut à droite
      page.drawText(sanitizeText(params.entrepriseNom), {
        x: COORDS.organismeNom.x,
        y: COORDS.organismeNom.y,
        size: 10,
        font,
        color: rgb(1, 1, 1),
        maxWidth: 165,
      });

      // SECTION 1: FORMATION
      page.drawText(sanitizeText(params.formationNom), {
        x: COORDS.formationNom.x,
        y: COORDS.formationNom.y,
        size: 10,
        font,
        color: rgb(0, 0, 0),
        maxWidth: 340,
      });

      page.drawText(formatDateFR(params.sessionDate), {
        x: COORDS.formationDate.x,
        y: COORDS.formationDate.y,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(sanitizeText(params.lieu), {
        x: COORDS.formationLieu.x,
        y: COORDS.formationLieu.y,
        size: 10,
        font,
        color: rgb(0, 0, 0),
        maxWidth: 360,
      });

      // SECTION 2: FORMATEUR
      page.drawText(formateurNomComplet, {
        x: COORDS.formateurNom.x,
        y: COORDS.formateurNom.y,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(`${heureDebut} - ${heureFin}`, {
        x: COORDS.formateurHeure.x,
        y: COORDS.formateurHeure.y,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });
    }

    // SECTION 3: STAGIAIRES (Tableau)
    // Remplir le tableau avec les stagiaires de cette page
    // Utiliser les coordonnées appropriées selon la page
    const baseYCoord = isFirstPage
      ? COORDS.stagiaireNom.y
      : COORDS.stagiaireNomContinuation.y;
    const baseXNom = isFirstPage
      ? COORDS.stagiaireNom.x
      : COORDS.stagiaireNomContinuation.x;
    const baseXPrenom = isFirstPage
      ? COORDS.stagiairePrenom.x
      : COORDS.stagiaireePrenomContinuation.x;
    const baseXDateNaissance = isFirstPage
      ? COORDS.stagiaireDateNaissance.x
      : COORDS.stagiaireDateNaissanceContinuation.x;

    stagiairesPage.forEach((stagiaire, indexInPage) => {
      const yPosition = baseYCoord - indexInPage * COORDS.stagiaireLineHeight;

      // Nom
      page.drawText(sanitizeText(stagiaire.nom), {
        x: baseXNom,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      // Prénom
      page.drawText(sanitizeText(stagiaire.prenom), {
        x: baseXPrenom,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      // Date de naissance
      page.drawText(formatDateFR(stagiaire.dateNaissanceISO), {
        x: baseXDateNaissance,
        y: yPosition,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      // La colonne "Signature" reste vide pour signature manuscrite
    });
  }

  // 4. Sérialiser le PDF final
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
