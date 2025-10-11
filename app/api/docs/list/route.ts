/**
 * GET /api/docs/list
 * Liste tous les documents générés (Convention, Émargement, et anciens templates)
 * Accessible aux admins uniquement
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé - Admin requis' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const kindFilter = searchParams.get('kind'); // CONVENTION | EMARGEMENT | null (all)

    const whereClause: {
      kind?: 'CONVENTION' | 'EMARGEMENT';
    } = {};

    if (kindFilter && (kindFilter === 'CONVENTION' || kindFilter === 'EMARGEMENT')) {
      whereClause.kind = kindFilter as 'CONVENTION' | 'EMARGEMENT';
    }

    const documents = await prisma.generatedDocument.findMany({
      where: whereClause,
      include: {
        template: {
          select: {
            id: true,
            name: true,
            mode: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        batch: {
          select: {
            id: true,
            kind: true,
            count: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 200,
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);

    return NextResponse.json(
      { error: 'Erreur lors de la récupération des documents' },
      { status: 500 }
    );
  }
}
