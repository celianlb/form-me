/**
 * Façade principale du système de génération PDF
 * Point d'entrée unique pour générer et stocker un PDF
 */

import { prisma } from '@/lib/prisma';
import { generatePdfFromTemplate } from './generatePdfFromTemplate';
import { uploadGeneratedPdf } from './uploadToCloudinary';

interface GenerateAndStorePdfResult {
  id: string;
  pdfUrl: string;
  templateId: string | null;
  createdAt: Date;
}

/**
 * Génère un PDF depuis un template et le stocke dans Cloudinary
 * Crée une entrée GeneratedDocument en base
 */
export async function generateAndStorePdf(
  templateId: string,
  values: Record<string, unknown>,
  userId: number
): Promise<GenerateAndStorePdfResult> {
  // 1. Récupérer le template avec ses champs
  const template = await prisma.documentTemplate.findUnique({
    where: { id: templateId, isActive: true },
    include: { fields: true },
  });

  if (!template) {
    throw new Error(`Template ${templateId} not found or inactive`);
  }

  // 2. Valider les champs requis
  const missingFields: string[] = [];
  for (const field of template.fields) {
    if (field.required && !values[field.key]) {
      missingFields.push(field.label);
    }
  }

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields: ${missingFields.join(', ')}`
    );
  }

  // 3. Générer le PDF
  const pdfBuffer = await generatePdfFromTemplate(template, values);

  // 4. Upload vers Cloudinary
  const { url, publicId } = await uploadGeneratedPdf(pdfBuffer, templateId);

  // 5. Persister en base
  const generatedDoc = await prisma.generatedDocument.create({
    data: {
      kind: 'CONVENTION', // Default kind for generic template system
      templateId,
      createdByUserId: userId,
      payloadJson: values as unknown as Record<string, string | number | boolean | null>,
      pdfUrl: url,
      cloudinaryPublicId: publicId,
    },
  });

  return {
    id: generatedDoc.id,
    pdfUrl: generatedDoc.pdfUrl,
    templateId: generatedDoc.templateId,
    createdAt: generatedDoc.createdAt,
  };
}

// Ré-exporter les autres fonctions utiles
export { loadTemplatePdf } from './loadTemplatePdf';
export { uploadTemplatePdf, uploadGeneratedPdf } from './uploadToCloudinary';
export { generatePdfFromTemplate } from './generatePdfFromTemplate';
