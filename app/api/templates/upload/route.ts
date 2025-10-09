/**
 * POST /api/templates/upload
 * Upload d'un template PDF avec mode de génération
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { uploadTemplateSchema } from '@/lib/validations/pdf';
import { uploadTemplatePdf } from '@/src/server/pdf';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Vérification admin
    await requireAdmin();

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const mode = formData.get('mode') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Fichier PDF requis' },
        { status: 400 }
      );
    }

    // Validation du PDF
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Le fichier doit être un PDF' },
        { status: 400 }
      );
    }

    // Validation des autres champs
    const validationResult = uploadTemplateSchema.safeParse({
      name,
      description: description || undefined,
      mode,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation échouée', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Conversion du File en Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload vers Cloudinary
    const { url, publicId } = await uploadTemplatePdf(buffer, name);

    // Création en base
    const template = await prisma.documentTemplate.create({
      data: {
        name: validationResult.data.name,
        description: validationResult.data.description,
        mode: validationResult.data.mode,
        pdfUrl: url,
        cloudinaryPublicId: publicId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        template: {
          id: template.id,
          name: template.name,
          description: template.description,
          mode: template.mode,
          pdfUrl: template.pdfUrl,
          isActive: template.isActive,
          createdAt: template.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading template:', error);

    if (error instanceof Error) {
      if (error.message.includes('authentifié') || error.message.includes('Accès refusé')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }

    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du template' },
      { status: 500 }
    );
  }
}
