import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";

// Note: This is a placeholder implementation.
// The actual PDF generation logic would need to be implemented
// based on the existing PDF generation system in src/server/pdf/

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "companyName",
      "companyAddress",
      "representativeName",
      "trainingTitle",
      "trainingDuration",
      "trainingDates",
      "price",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Champ requis manquant: ${field}` },
          { status: 400 }
        );
      }
    }

    // TODO: Implement actual PDF generation
    // This would call the PDF generation service from src/server/pdf/
    // For now, we'll create a placeholder document record

    const batchId = crypto.randomUUID();

    // Create the document record (placeholder URL for now)
    const document = await prisma.generatedDocument.create({
      data: {
        kind: "CONVENTION",
        pdfUrl: `https://placeholder.com/convention-${batchId}.pdf`,
        batchId,
        createdByUserId: parseInt(session.user.id),
        payloadJson: data,
      },
    });

    return NextResponse.json({
      success: true,
      documentId: document.id,
      pdfUrl: document.pdfUrl,
      message: "Convention generee avec succes (placeholder)",
    });
  } catch (error) {
    console.error("Erreur lors de la generation de la convention:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
