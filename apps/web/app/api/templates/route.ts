/**
 * GET /api/templates - Liste tous les templates
 * POST /api/templates - Créer un template (alternative à /upload)
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const templates = await prisma.documentTemplate.findMany({
      where: isActive !== null ? { isActive: isActive === 'true' } : undefined,
      include: {
        fields: {
          select: {
            id: true,
            key: true,
            label: true,
            type: true,
            required: true,
          },
        },
        _count: {
          select: {
            generatedDocuments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);

    if (error instanceof Error && error.message.includes('Accès refusé')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Erreur lors de la récupération des templates' },
      { status: 500 }
    );
  }
}
