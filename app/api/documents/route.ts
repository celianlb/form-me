/**
 * GET /api/documents - Liste les documents générés
 * Accessible aux admins pour voir tous les documents
 * Accessible aux utilisateurs pour voir leurs propres documents
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

    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('templateId');

    // Les admins peuvent voir tous les documents
    // Les utilisateurs normaux ne voient que les leurs
    const whereClause: {
      createdByUserId?: number;
      templateId?: string;
    } = {};

    if (session.user.role !== 'ADMIN') {
      whereClause.createdByUserId = Number(session.user.id);
    }

    if (templateId) {
      whereClause.templateId = templateId;
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
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limite à 100 documents
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
