/**
 * Service de génération de Convention - VERSION TEMPLATE PROGRAMMATIQUE
 * Génère un PDF de 2 pages avec un template créé programmatiquement
 * Plus besoin de masquer des placeholders, le template est généré à la volée
 */
import { prisma } from "@/lib/prisma";
import { StandardFonts, rgb } from "pdf-lib";
import { generateConventionTemplate } from "../templates/conventionTemplate";
import { uploadBuffer } from "./cloudinary";
import {
  countUniqueDays,
  formatDateFR,
  formatDateForFilename,
  formatMoneyEUR,
  formatTimeFR,
  sanitizeFilename,
  sanitizeText,
} from "./format";
import type { ConventionInput, ConventionResult } from "./types";

/**
 * Coordonnées pour le remplissage dynamique
 * Les valeurs doivent correspondre aux labels dans conventionTemplate.ts
 */
const COORDS = {
  // Page 1 - Préambule
  entrepriseInfo: { x: 60, y: 685 }, // Ligne "2 - [entreprise]"

  // Page 1 - Article 1 (encadré formation)
  // Les valeurs sont positionnées À DROITE des labels (sur la même ligne)
  // labelX = 60, les labels font environ 160-170px de large
  formationNom: { x: 150, y: 585 }, // Après "Intitulé du stage:" (label à x:60)
  formationDuree: { x: 80, y: 562 }, // Après "Durée:" (label court, à x:60)
  formationLieu: { x: 160, y: 542 }, // Après "Lieu (adresse exacte):" (label à x:60)
  formationDates: { x: 155, y: 527 }, // Après "Dates et horaires:" (label à x:60)

  // Page 1 - Article 2 (tableau stagiaires)
  tableStartY: 363,
  colNomX: 135,
  colPrenomX: 275,
  colDateNaissanceX: 415,
  lineHeight: 15,

  // Page 1 - Article 3 (tarifs)
  tarifUnitaire: { x: 300, y: 240 }, // Après "Frais de formation : coût unitaire/stagiaire Net de TVA:"
  totalGeneral: { x: 150, y: 222 }, // Après "TOTAL GENERAL :" en gras
} as const;

/**
 * Génère un PDF Convention depuis les données saisies
 */
export async function generateConvention(
  input: ConventionInput,
  userId: number
): Promise<ConventionResult> {
  try {
    // 1. Générer le template de base (2 pages)
    const pdfDoc = await generateConventionTemplate();

    // 2. Charger les polices
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // 3. Récupérer les pages
    const pages = pdfDoc.getPages();
    const page1 = pages[0];
    if (!page1) throw new Error("Page 1 not found");

    // === REMPLISSAGE DYNAMIQUE - PAGE 1 ===

    // Informations entreprise (ligne complète)
    const entrepriseText = `${sanitizeText(input.societe.nom)}, ${sanitizeText(
      input.societe.siret
    )}, ${sanitizeText(input.societe.adresse)}, représentée par ${sanitizeText(
      input.societe.representantPrenom
    )} ${sanitizeText(input.societe.representantNom)}`;

    page1.drawText(entrepriseText, {
      x: COORDS.entrepriseInfo.x,
      y: COORDS.entrepriseInfo.y,
      size: 10,
      font,
      color: rgb(0, 0, 0),
      maxWidth: 475,
      lineHeight: 12,
    });

    // Formation - Intitulé
    page1.drawText(sanitizeText(input.formation.nom), {
      x: COORDS.formationNom.x,
      y: COORDS.formationNom.y,
      size: 10,
      font,
      color: rgb(0, 0, 0),
      maxWidth: 280,
    });

    // Formation - Durée
    page1.drawText(`${input.formation.dureeHeures} heures`, {
      x: COORDS.formationDuree.x,
      y: COORDS.formationDuree.y,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    // Formation - Lieu
    page1.drawText(sanitizeText(input.formation.lieu), {
      x: COORDS.formationLieu.x,
      y: COORDS.formationLieu.y,
      size: 10,
      font,
      color: rgb(0, 0, 0),
      maxWidth: 250,
    });

    // Formation - Dates et horaires
    const datesHorairesText = input.datesEtHoraires
      .map((session) => {
        const dateStr = formatDateFR(session.dateISO);
        const debutStr = formatTimeFR(session.debutISO);
        const finStr = formatTimeFR(session.finISO);
        return `${dateStr} de ${debutStr} à ${finStr}`;
      })
      .join(", ");

    page1.drawText(datesHorairesText, {
      x: COORDS.formationDates.x,
      y: COORDS.formationDates.y,
      size: 10,
      font,
      color: rgb(0, 0, 0),
      maxWidth: 275,
      lineHeight: 12,
    });

    // === TABLEAU DES STAGIAIRES ===
    let yPos = COORDS.tableStartY;

    for (const candidat of input.effectif) {
      // Arrêter si on déborde
      if (yPos < 220) {
        console.warn("Too many trainees, some may overflow the page");
        break;
      }

      // Nom
      page1.drawText(sanitizeText(candidat.nom), {
        x: COORDS.colNomX,
        y: yPos,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      // Prénom
      page1.drawText(sanitizeText(candidat.prenom), {
        x: COORDS.colPrenomX,
        y: yPos,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      // Date de naissance
      page1.drawText(formatDateFR(candidat.dateNaissanceISO), {
        x: COORDS.colDateNaissanceX,
        y: yPos,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      yPos -= COORDS.lineHeight;
    }

    // === TARIFS ===
    const nbJours = countUniqueDays(
      input.datesEtHoraires.map((d) => d.dateISO)
    );
    const total = input.tarifJournalierEUR * nbJours;

    // Tarif unitaire (ajouter "euros" après le montant)
    page1.drawText(
      formatMoneyEUR(input.tarifJournalierEUR).replace("€", "euros"),
      {
        x: COORDS.tarifUnitaire.x,
        y: COORDS.tarifUnitaire.y,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      }
    );

    // Total général (en gras, taille 11)
    page1.drawText(formatMoneyEUR(total) + " Net", {
      x: COORDS.totalGeneral.x,
      y: COORDS.totalGeneral.y,
      size: 11,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // 4. Sérialiser le PDF final
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    // 5. Générer le nom de fichier: convention_[nom-entreprise]_[date]
    const companyName = sanitizeFilename(input.societe.nom);
    const date = formatDateForFilename(
      input.datesEtHoraires[0]?.dateISO || new Date().toISOString()
    );
    const filename = `convention_${companyName}_${date}`;

    // 6. Upload vers Cloudinary
    const { secure_url, public_id } = await uploadBuffer(
      pdfBuffer,
      "conventions",
      filename
    );

    // 7. Persister en base
    const doc = await prisma.generatedDocument.create({
      data: {
        kind: "CONVENTION",
        createdByUserId: userId,
        payloadJson: input as unknown as Record<
          string,
          string | number | boolean | null
        >,
        pdfUrl: secure_url,
        cloudinaryPublicId: public_id,
      },
    });

    return {
      documentId: doc.id,
      pdfUrl: doc.pdfUrl,
    };
  } catch (error) {
    console.error("Error generating Convention:", error);
    throw error;
  }
}
