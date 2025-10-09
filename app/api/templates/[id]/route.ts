/**
 * GET /api/templates/[id] - Récupérer un template
 * PATCH /api/templates/[id] - Mettre à jour un template
 * DELETE /api/templates/[id] - Supprimer un template
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { updateTemplateSchema } from '@/lib/validations/pdf';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const template = await prisma.documentTemplate.findUnique({
      where: { id },
      include: {
        fields: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            generatedDocuments: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error fetching template:', error);

    if (error instanceof Error && error.message.includes('Accès refusé')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Erreur lors de la récupération du template' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const body = await request.json();
    const validationResult = updateTemplateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation échouée', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const template = await prisma.documentTemplate.update({
      where: { id },
      data: validationResult.data,
      include: {
        fields: true,
      },
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error updating template:', error);

    if (error instanceof Error) {
      if (error.message.includes('Accès refusé')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { error: 'Template non trouvé' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du template' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    // Vérifier si des documents ont été générés avec ce template
    const documentsCount = await prisma.generatedDocument.count({
      where: { templateId: id },
    });

    if (documentsCount > 0) {
      return NextResponse.json(
        {
          error: `Impossible de supprimer: ${documentsCount} document(s) généré(s) avec ce template`,
        },
        { status: 400 }
      );
    }

    await prisma.documentTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);

    if (error instanceof Error) {
      if (error.message.includes('Accès refusé')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      if (error.message.includes('Record to delete does not exist')) {
        return NextResponse.json(
          { error: 'Template non trouvé' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression du template' },
      { status: 500 }
    );
  }
}
