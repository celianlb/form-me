/**
 * PATCH /api/templates/[id]/fields/[fieldId] - Mettre à jour un champ
 * DELETE /api/templates/[id]/fields/[fieldId] - Supprimer un champ
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { updateTemplateFieldSchema } from '@/lib/validations/pdf';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fieldId: string }> }
) {
  try {
    await requireAdmin();

    const { id, fieldId } = await params;

    const body = await request.json();
    const validationResult = updateTemplateFieldSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation échouée', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Vérifier que le champ appartient au bon template
    const existingField = await prisma.templateField.findUnique({
      where: { id: fieldId },
    });

    if (!existingField) {
      return NextResponse.json(
        { error: 'Champ non trouvé' },
        { status: 404 }
      );
    }

    if (existingField.templateId !== id) {
      return NextResponse.json(
        { error: 'Ce champ n\'appartient pas à ce template' },
        { status: 400 }
      );
    }

    // Vérifier l'unicité de la clé si elle est modifiée
    if (validationResult.data.key && validationResult.data.key !== existingField.key) {
      const duplicateField = await prisma.templateField.findFirst({
        where: {
          templateId: id,
          key: validationResult.data.key,
          id: { not: fieldId },
        },
      });

      if (duplicateField) {
        return NextResponse.json(
          { error: `Un champ avec la clé "${validationResult.data.key}" existe déjà` },
          { status: 400 }
        );
      }
    }

    const field = await prisma.templateField.update({
      where: { id: fieldId },
      data: validationResult.data,
    });

    return NextResponse.json({ field });
  } catch (error) {
    console.error('Error updating field:', error);

    if (error instanceof Error && error.message.includes('Accès refusé')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du champ' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fieldId: string }> }
) {
  try {
    await requireAdmin();

    const { id, fieldId } = await params;

    // Vérifier que le champ appartient au bon template
    const existingField = await prisma.templateField.findUnique({
      where: { id: fieldId },
    });

    if (!existingField) {
      return NextResponse.json(
        { error: 'Champ non trouvé' },
        { status: 404 }
      );
    }

    if (existingField.templateId !== id) {
      return NextResponse.json(
        { error: 'Ce champ n\'appartient pas à ce template' },
        { status: 400 }
      );
    }

    await prisma.templateField.delete({
      where: { id: fieldId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting field:', error);

    if (error instanceof Error && error.message.includes('Accès refusé')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression du champ' },
      { status: 500 }
    );
  }
}
