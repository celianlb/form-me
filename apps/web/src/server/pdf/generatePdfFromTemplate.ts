/**
 * Service: Génération PDF depuis template
 * Supporte deux modes:
 * - ACROFORM: Remplissage de champs PDF existants
 * - OVERLAY: Superposition de texte à des coordonnées X/Y
 */

import { PDFDocument, PDFFont, rgb, StandardFonts } from 'pdf-lib';
import type { DocumentTemplate, TemplateField } from '@form-me/database';
import { loadTemplatePdf } from './loadTemplatePdf';

type TemplateWithFields = DocumentTemplate & {
  fields: TemplateField[];
};

type FieldValues = Record<string, unknown>;

/**
 * Formatte une valeur selon son type
 */
function formatValue(value: unknown, type: string): string {
  if (value === null || value === undefined) return '';

  switch (type) {
    case 'DATE':
      if (value instanceof Date) {
        return value.toLocaleDateString('fr-FR');
      }
      if (typeof value === 'string') {
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : date.toLocaleDateString('fr-FR');
      }
      return String(value);

    case 'NUMBER':
      return typeof value === 'number' ? value.toString() : String(value);

    case 'BOOLEAN':
      return value ? 'Oui' : 'Non';

    case 'STRING':
    default:
      return String(value);
  }
}

/**
 * Mode ACROFORM: Remplissage des champs PDF
 */
async function fillAcroForm(
  pdfDoc: PDFDocument,
  fields: TemplateField[],
  values: FieldValues
): Promise<void> {
  const form = pdfDoc.getForm();

  for (const field of fields) {
    if (!field.acroformFieldName) continue;

    const value = values[field.key];
    if (value === undefined || value === null) {
      // Utiliser defaultValue si défini
      if (field.defaultValue) {
        try {
          const formField = form.getTextField(field.acroformFieldName);
          formField.setText(field.defaultValue);
        } catch (error) {
          console.warn(
            `[fillAcroForm] Field ${field.acroformFieldName} not found in PDF`,
            error
          );
        }
      }
      continue;
    }

    const formattedValue = formatValue(value, field.type);

    try {
      // Tente de récupérer le champ (peut être TextField, Checkbox, etc.)
      const formField = form.getTextField(field.acroformFieldName);
      formField.setText(formattedValue);
    } catch (error) {
      console.warn(
        `[fillAcroForm] Could not set field ${field.acroformFieldName}:`,
        error
      );
    }
  }

  // Flatten le formulaire pour rendre les champs non-modifiables
  try {
    form.flatten();
  } catch (error) {
    console.warn('[fillAcroForm] Could not flatten form:', error);
  }
}

/**
 * Mode OVERLAY: Dessin de texte sur le PDF
 */
async function overlayText(
  pdfDoc: PDFDocument,
  fields: TemplateField[],
  values: FieldValues
): Promise<void> {
  const pages = pdfDoc.getPages();

  // Pré-charger les fonts pour éviter de les recharger à chaque fois
  const fontCache: Record<string, PDFFont> = {};

  const getFont = async (fontName: string): Promise<PDFFont> => {
    if (fontCache[fontName]) return fontCache[fontName];

    let font: PDFFont;
    switch (fontName.toLowerCase()) {
      case 'helvetica-bold':
        font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        break;
      case 'times-roman':
        font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        break;
      case 'courier':
        font = await pdfDoc.embedFont(StandardFonts.Courier);
        break;
      case 'helvetica':
      default:
        font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }

    fontCache[fontName] = font;
    return font;
  };

  for (const field of fields) {
    // Vérifier que les coordonnées sont définies
    if (
      field.pageIndex === null ||
      field.x === null ||
      field.y === null ||
      field.pageIndex === undefined ||
      field.x === undefined ||
      field.y === undefined
    ) {
      console.warn(
        `[overlayText] Field ${field.key} missing coordinates, skipping`
      );
      continue;
    }

    const value = values[field.key];
    if (value === undefined || value === null) {
      // Utiliser defaultValue si défini
      if (!field.defaultValue) continue;
    }

    const formattedValue =
      value !== undefined && value !== null
        ? formatValue(value, field.type)
        : field.defaultValue || '';

    if (!formattedValue) continue;

    // Récupérer la page
    const page = pages[field.pageIndex];
    if (!page) {
      console.warn(
        `[overlayText] Page ${field.pageIndex} not found for field ${field.key}`
      );
      continue;
    }

    // Récupérer la font
    const fontName = field.fontName || 'Helvetica';
    const font = await getFont(fontName);
    const fontSize = field.fontSize || 12;

    // Calculer la position selon l'alignement
    let x = field.x;
    const textWidth = font.widthOfTextAtSize(formattedValue, fontSize);

    switch (field.align) {
      case 'CENTER':
        x = field.x - textWidth / 2;
        break;
      case 'RIGHT':
        x = field.x - textWidth;
        break;
      case 'LEFT':
      default:
        x = field.x;
    }

    // Dessiner le texte
    try {
      page.drawText(formattedValue, {
        x,
        y: field.y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    } catch (error) {
      console.error(
        `[overlayText] Error drawing text for field ${field.key}:`,
        error
      );
    }
  }
}

/**
 * Fonction principale: Génère un PDF depuis un template
 */
export async function generatePdfFromTemplate(
  template: TemplateWithFields,
  values: FieldValues
): Promise<Buffer> {
  try {
    // 1. Charger le template PDF
    const templateBuffer = await loadTemplatePdf(template.pdfUrl);

    // 2. Charger le document PDF avec pdf-lib
    const pdfDoc = await PDFDocument.load(templateBuffer);

    // 3. Appliquer le mode approprié
    if (template.mode === 'ACROFORM') {
      await fillAcroForm(pdfDoc, template.fields, values);
    } else {
      // OVERLAY
      await overlayText(pdfDoc, template.fields, values);
    }

    // 4. Sauvegarder et retourner le Buffer
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('[generatePdfFromTemplate] Error:', error);
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
