/**
 * Schémas de validation Zod pour le système PDF
 */
import { z } from 'zod';
import { PdfGenerationMode, PdfFieldType, PdfFieldAlign } from '@/generated/prisma';

export const uploadTemplateSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  mode: z.nativeEnum(PdfGenerationMode),
});

export const createTemplateFieldSchema = z.object({
  key: z.string().min(1, 'La clé est requise'),
  label: z.string().min(1, 'Le label est requis'),
  type: z.nativeEnum(PdfFieldType),
  required: z.boolean().default(false),
  pageIndex: z.number().int().min(0).optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  fontSize: z.number().int().min(1).max(72).default(12),
  fontName: z.string().default('Helvetica'),
  align: z.nativeEnum(PdfFieldAlign).default(PdfFieldAlign.LEFT),
  acroformFieldName: z.string().optional(),
  defaultValue: z.string().optional(),
});

export const updateTemplateFieldSchema = createTemplateFieldSchema.partial();

export const updateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  mode: z.nativeEnum(PdfGenerationMode).optional(),
  isActive: z.boolean().optional(),
});

export const generateDocumentSchema = z.object({
  templateId: z.string().min(1, 'Le template ID est requis'),
  values: z.record(z.string(), z.unknown()),
});

export type UploadTemplateInput = z.infer<typeof uploadTemplateSchema>;
export type CreateTemplateFieldInput = z.infer<typeof createTemplateFieldSchema>;
export type UpdateTemplateFieldInput = z.infer<typeof updateTemplateFieldSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type GenerateDocumentInput = z.infer<typeof generateDocumentSchema>;
