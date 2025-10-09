/**
 * GET /api/templates/[id]/fields - Liste les champs d'un template
 * POST /api/templates/[id]/fields - Créer un champ
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { createTemplateFieldSchema } from '@/lib/validations/pdf';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const fields = await prisma.templateField.findMany({
      where: { templateId: id },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({ fields });
  } catch (error) {
    console.error('Error fetching fields:', error);

    if (error instanceof Error && error.message.includes('Accès refusé')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Erreur lors de la récupération des champs' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const body = await request.json();
    const validationResult = createTemplateFieldSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation échouée', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Vérifier que le template existe
    const template = await prisma.documentTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que la clé n'existe pas déjà
    const existingField = await prisma.templateField.findFirst({
      where: {
        templateId: id,
        key: validationResult.data.key,
      },
    });

    if (existingField) {
      return NextResponse.json(
        { error: `Un champ avec la clé "${validationResult.data.key}" existe déjà` },
        { status: 400 }
      );
    }

    const field = await prisma.templateField.create({
      data: {
        ...validationResult.data,
        templateId: id,
      },
    });

    return NextResponse.json({ field }, { status: 201 });
  } catch (error) {
    console.error('Error creating field:', error);

    if (error instanceof Error && error.message.includes('Accès refusé')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du champ' },
      { status: 500 }
    );
  }
}
