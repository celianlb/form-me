import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { trainingId, title, description, type, fileUrl, fileSize } =
      await request.json();

    if (!trainingId || !title || !fileUrl) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Convert fileSize to BigInt safely
    const fileSizeBigInt = fileSize ? BigInt(Math.floor(Number(fileSize))) : null;

    const support = await prisma.support.create({
      data: {
        trainingId: parseInt(trainingId),
        title,
        description: description || null,
        type: type || "PDF",
        fileUrl,
        fileSize: fileSizeBigInt,
        isActive: true,
      },
    });

    // Convert BigInt to number for JSON serialization
    return NextResponse.json({
      ...support,
      fileSize: support.fileSize ? Number(support.fileSize) : null,
    });
  } catch (error) {
    console.error("Erreur lors de la creation du support:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
