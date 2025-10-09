/**
 * POST /api/documents/generate
 * Génère un PDF depuis un template avec les valeurs fournies
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateDocumentSchema } from '@/lib/validations/pdf';
import { generateAndStorePdf } from '@/src/server/pdf';

export async function POST(request: NextRequest) {
  try {
    // Vérification authentification (pas forcément admin)
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = generateDocumentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation échouée', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { templateId, values } = validationResult.data;

    // Génération et stockage du PDF
    const result = await generateAndStorePdf(
      templateId,
      values,
      Number(session.user.id)
    );

    return NextResponse.json(
      {
        success: true,
        document: {
          id: result.id,
          pdfUrl: result.pdfUrl,
          templateId: result.templateId,
          createdAt: result.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error generating document:', error);

    if (error instanceof Error) {
      // Erreurs métier (template non trouvé, champs manquants, etc.)
      if (
        error.message.includes('not found') ||
        error.message.includes('Missing required fields')
      ) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erreur lors de la génération du document' },
      { status: 500 }
    );
  }
}
