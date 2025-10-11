/**
 * Service de génération de Convention
 * Génère un PDF unique avec toutes les informations
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { prisma } from '@/lib/prisma';
import { getTemplateBuffer, uploadBuffer } from './cloudinary';
import { formatDateFR, formatTimeFR, formatMoneyEUR, countUniqueDays, sanitizeText, sanitizeFilename, formatDateForFilename } from './format';
import { CONVENTION_FIELDS_COORDS, TABLE_CONFIG } from './coordinates';
import type { ConventionInput, ConventionResult } from './types';

/**
 * Génère un PDF Convention depuis les données saisies
 */
export async function generateConvention(
  input: ConventionInput,
  userId: number
): Promise<ConventionResult> {
  try {
    // 1. Récupérer le template depuis Cloudinary
    let templateBuffer: Buffer;
    try {
      templateBuffer = await getTemplateBuffer('CONVENTION');
    } catch (error) {
      console.warn(`Failed to load template, creating blank PDF:`, error);
      // Créer un PDF vide par défaut
      const blankPdf = await PDFDocument.create();
      blankPdf.addPage([595, 842]); // A4 dimensions
      const pdfBytes = await blankPdf.save();
      templateBuffer = Buffer.from(pdfBytes);
    }

    // 2. Charger le PDF avec pdf-lib
    const pdfDoc = await PDFDocument.load(templateBuffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    const currentPage = pages[0];

    if (!currentPage) {
      throw new Error('Template PDF has no pages');
    }

    // 3. Dessiner les champs fixes

    // === SOCIÉTÉ ===
    const coords = CONVENTION_FIELDS_COORDS;
    currentPage.drawText(sanitizeText(input.societe.nom), {
      x: coords['societe.nom'].x,
      y: coords['societe.nom'].y,
      size: coords['societe.nom'].fontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    currentPage.drawText(`SIRET: ${sanitizeText(input.societe.siret)}`, {
      x: coords['societe.siret'].x,
      y: coords['societe.siret'].y,
      size: coords['societe.siret'].fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    currentPage.drawText(sanitizeText(input.societe.adresse), {
      x: coords['societe.adresse'].x,
      y: coords['societe.adresse'].y,
      size: coords['societe.adresse'].fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    currentPage.drawText(
      `Représenté(e) par: ${sanitizeText(input.societe.representantPrenom)} ${sanitizeText(input.societe.representantNom)}`,
      {
        x: coords['societe.representantPrenom'].x,
        y: coords['societe.representantPrenom'].y,
        size: coords['societe.representantPrenom'].fontSize,
        font,
        color: rgb(0, 0, 0),
      }
    );

    // === FORMATION ===
    currentPage.drawText(sanitizeText(input.formation.nom), {
      x: coords['formation.nom'].x,
      y: coords['formation.nom'].y,
      size: coords['formation.nom'].fontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // Objectifs (concaténés)
    const objectifsText = input.formation.objectifsOperationnels
      .map((obj, i) => `${i + 1}. ${sanitizeText(obj)}`)
      .join('\n');

    currentPage.drawText(objectifsText, {
      x: coords['formation.objectifsOperationnels'].x,
      y: coords['formation.objectifsOperationnels'].y,
      size: coords['formation.objectifsOperationnels'].fontSize,
      font,
      color: rgb(0, 0, 0),
      lineHeight: 12,
    });

    currentPage.drawText(`Durée: ${input.formation.dureeHeures}h`, {
      x: coords['formation.dureeHeures'].x,
      y: coords['formation.dureeHeures'].y,
      size: coords['formation.dureeHeures'].fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    currentPage.drawText(`Lieu: ${sanitizeText(input.formation.lieu)}`, {
      x: coords['formation.lieu'].x,
      y: coords['formation.lieu'].y,
      size: coords['formation.lieu'].fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // 4. Tableau des dates et horaires
    const tableConfig = TABLE_CONFIG.DATES;
    let yPos = tableConfig.startY;

    currentPage.drawText('Dates et Horaires:', {
      x: coords['dates.header'].x,
      y: coords['dates.header'].y,
      size: coords['dates.header'].fontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    for (const session of input.datesEtHoraires) {
      const dateStr = formatDateFR(session.dateISO);
      const debutStr = formatTimeFR(session.debutISO);
      const finStr = formatTimeFR(session.finISO);

      currentPage.drawText(dateStr, {
        x: tableConfig.columns.date.x,
        y: yPos,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      currentPage.drawText(debutStr, {
        x: tableConfig.columns.debut.x,
        y: yPos,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      currentPage.drawText(finStr, {
        x: tableConfig.columns.fin.x,
        y: yPos,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      yPos -= tableConfig.lineHeight;

      // Si débordement, dupliquer la page (MVP: on suppose que ça tient)
      // TODO: gérer le débordement si nécessaire
    }

    // 5. Tableau effectif
    const effectifConfig = TABLE_CONFIG.EFFECTIF;
    yPos = effectifConfig.startY;

    currentPage.drawText('Effectif:', {
      x: coords['effectif.header'].x,
      y: coords['effectif.header'].y,
      size: coords['effectif.header'].fontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    for (const candidat of input.effectif) {
      currentPage.drawText(sanitizeText(candidat.prenom), {
        x: effectifConfig.columns.prenom.x,
        y: yPos,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      currentPage.drawText(sanitizeText(candidat.nom), {
        x: effectifConfig.columns.nom.x,
        y: yPos,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      currentPage.drawText(formatDateFR(candidat.dateNaissanceISO), {
        x: effectifConfig.columns.dateNaissance.x,
        y: yPos,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      yPos -= effectifConfig.lineHeight;
    }

    // 6. Calcul des frais
    const nbJours = countUniqueDays(input.datesEtHoraires.map(d => d.dateISO));
    const total = input.tarifJournalierEUR * nbJours;

    currentPage.drawText(`Tarif journalier: ${formatMoneyEUR(input.tarifJournalierEUR)}`, {
      x: coords['frais.tarifJournalier'].x,
      y: coords['frais.tarifJournalier'].y,
      size: coords['frais.tarifJournalier'].fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    currentPage.drawText(`Nombre de jours: ${nbJours}`, {
      x: coords['frais.nbJours'].x,
      y: coords['frais.nbJours'].y,
      size: coords['frais.nbJours'].fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    currentPage.drawText(`TOTAL: ${formatMoneyEUR(total)}`, {
      x: coords['frais.total'].x,
      y: coords['frais.total'].y,
      size: coords['frais.total'].fontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // Signature date (aujourd'hui)
    const today = new Date().toISOString();
    currentPage.drawText(`Fait le: ${formatDateFR(today)}`, {
      x: coords['signature.date'].x,
      y: coords['signature.date'].y,
      size: coords['signature.date'].fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // 7. Sérialiser le PDF
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    // 8. Générer le nom de fichier: convention_[nom-entreprise]_[date]
    const companyName = sanitizeFilename(input.societe.nom);
    const date = formatDateForFilename(input.datesEtHoraires[0]?.dateISO || new Date().toISOString());
    const filename = `convention_${companyName}_${date}`;

    // 9. Upload vers Cloudinary
    const { secure_url, public_id } = await uploadBuffer(pdfBuffer, 'conventions', filename);

    // 9. Persister en base
    const doc = await prisma.generatedDocument.create({
      data: {
        kind: 'CONVENTION',
        createdByUserId: userId,
        payloadJson: input as unknown as Record<string, string | number | boolean | null>,
        pdfUrl: secure_url,
        cloudinaryPublicId: public_id,
      },
    });

    return {
      documentId: doc.id,
      pdfUrl: doc.pdfUrl,
    };
  } catch (error) {
    console.error('Error generating Convention:', error);
    throw error;
  }
}
