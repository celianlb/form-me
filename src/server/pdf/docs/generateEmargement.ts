/**
 * Service de génération d'Émargement
 * Génère 1 PDF par session (date + créneaux)
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { prisma } from '@/lib/prisma';
import { getTemplateUrl, uploadBuffer } from './cloudinary';
import { formatDateFR, formatTimeFR, sanitizeText } from './format';
import { EMARGEMENT_FIELDS_COORDS } from './coordinates';
import type { EmargementInput, EmargementResult } from './types';

/**
 * Télécharge le template PDF depuis Cloudinary
 */
async function loadTemplateBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load template: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Génère un label lisible pour une session
 */
function generateSessionLabel(session: EmargementInput['sessions'][0]): string {
  const dateStr = formatDateFR(session.dateISO);

  if (session.journeeEntiere) {
    return `Émargement - ${dateStr} Journée`;
  }

  const parts: string[] = [];
  if (session.matin) parts.push('Matin');
  if (session.apresMidi) parts.push('Après-midi');

  return `Émargement - ${dateStr} ${parts.join(' + ')}`;
}

/**
 * Génère le texte horaires pour affichage
 */
function generateHorairesText(session: EmargementInput['sessions'][0]): string {
  const lines: string[] = [];

  if (session.journeeEntiere) {
    if (session.matin) {
      const debut = formatTimeFR(session.matin.debutISO);
      const fin = formatTimeFR(session.matin.finISO);
      lines.push(`Matin: ${debut} - ${fin}`);
    }
    if (session.apresMidi) {
      const debut = formatTimeFR(session.apresMidi.debutISO);
      const fin = formatTimeFR(session.apresMidi.finISO);
      lines.push(`Après-midi: ${debut} - ${fin}`);
    }
  } else {
    if (session.matin) {
      const debut = formatTimeFR(session.matin.debutISO);
      const fin = formatTimeFR(session.matin.finISO);
      lines.push(`Matin: ${debut} - ${fin}`);
    }
    if (session.apresMidi) {
      const debut = formatTimeFR(session.apresMidi.debutISO);
      const fin = formatTimeFR(session.apresMidi.finISO);
      lines.push(`Après-midi: ${debut} - ${fin}`);
    }
  }

  return lines.join('\n');
}

/**
 * Génère un PDF Émargement pour une session
 */
async function generateSingleEmargement(
  input: EmargementInput,
  session: EmargementInput['sessions'][0],
  templateUrl: string
): Promise<Buffer> {
  const templateBuffer = await loadTemplateBuffer(templateUrl);
  const pdfDoc = await PDFDocument.load(templateBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  const page = pages[0];

  if (!page) {
    throw new Error('Template PDF has no pages');
  }

  const coords = EMARGEMENT_FIELDS_COORDS;

  // === FORMATION ===
  page.drawText(sanitizeText(input.formationNom), {
    x: coords['formation.nom'].x,
    y: coords['formation.nom'].y,
    size: coords['formation.nom'].fontSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // === ORGANISME ===
  page.drawText(`Organisme: ${sanitizeText(input.organismeNom)}`, {
    x: coords['organisme.nom'].x,
    y: coords['organisme.nom'].y,
    size: coords['organisme.nom'].fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  // === LIEU ===
  page.drawText(`Lieu: ${sanitizeText(input.lieu)}`, {
    x: coords['lieu'].x,
    y: coords['lieu'].y,
    size: coords['lieu'].fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  // === FORMATEUR ===
  page.drawText(
    `Formateur: ${sanitizeText(input.formateur.prenom)} ${sanitizeText(input.formateur.nom)}`,
    {
      x: coords['formateur.prenom'].x,
      y: coords['formateur.prenom'].y,
      size: coords['formateur.prenom'].fontSize,
      font,
      color: rgb(0, 0, 0),
    }
  );

  // === SESSION (date) ===
  const dateStr = formatDateFR(session.dateISO);
  page.drawText(`Date: ${dateStr}`, {
    x: coords['session.date'].x,
    y: coords['session.date'].y,
    size: coords['session.date'].fontSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // === HORAIRES ===
  const horairesText = generateHorairesText(session);
  page.drawText(horairesText, {
    x: coords['session.horaires'].x,
    y: coords['session.horaires'].y,
    size: coords['session.horaires'].fontSize,
    font,
    color: rgb(0, 0, 0),
    lineHeight: 12,
  });

  // Le reste du tableau de signatures est géré par le template PDF
  // (lignes pré-imprimées pour signatures stagiaires)

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Génère tous les PDFs Émargement (1 par session) et retourne le batch
 */
export async function generateEmargement(
  input: EmargementInput,
  userId: number
): Promise<EmargementResult> {
  try {
    // 1. Récupérer l'URL du template
    const templateUrl = await getTemplateUrl('EMARGEMENT');

    // 2. Créer un batch
    const batch = await prisma.documentBatch.create({
      data: {
        kind: 'EMARGEMENT',
        createdByUserId: userId,
        count: input.sessions.length,
      },
    });

    // 3. Générer 1 PDF par session
    const documents: EmargementResult['documents'] = [];

    for (const session of input.sessions) {
      const label = generateSessionLabel(session);

      // Générer le PDF
      const pdfBuffer = await generateSingleEmargement(input, session, templateUrl);

      // Upload vers Cloudinary
      const { secure_url, public_id } = await uploadBuffer(pdfBuffer, 'emargements');

      // Persister en base
      const doc = await prisma.generatedDocument.create({
        data: {
          kind: 'EMARGEMENT',
          createdByUserId: userId,
          batchId: batch.id,
          payloadJson: {
            ...input,
            session, // Session spécifique pour ce PDF
          } as Record<string, string | number | boolean | null>,
          pdfUrl: secure_url,
          cloudinaryPublicId: public_id,
        },
      });

      documents.push({
        documentId: doc.id,
        pdfUrl: doc.pdfUrl,
        label,
      });
    }

    return {
      batchId: batch.id,
      documents,
    };
  } catch (error) {
    console.error('Error generating Émargement:', error);
    throw error;
  }
}
