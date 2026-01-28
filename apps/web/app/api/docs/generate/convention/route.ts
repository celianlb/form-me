/**
 * POST /api/docs/generate/convention
 * Génère un PDF Convention
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { conventionInputSchema } from '@/lib/validations/docs';
import { generateConvention } from '@/src/server/pdf/docs/generateConvention';

export async function POST(request: NextRequest) {
  try {
    // Vérification authentification + rôle admin
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé: droits administrateur requis' },
        { status: 403 }
      );
    }

    // Validation du body
    const body = await request.json();
    const validationResult = conventionInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation échouée',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Génération du PDF
    const result = await generateConvention(
      validationResult.data,
      Number(session.user.id)
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error generating Convention:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: {
            code: 'GENERATION_FAILED',
            message: error.message,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: { code: 'UNKNOWN_ERROR', message: 'Une erreur est survenue' } },
      { status: 500 }
    );
  }
}
