import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const kind = searchParams.get("kind");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (kind && kind !== "ALL") {
      where.kind = kind;
    }

    const documents = await prisma.generatedDocument.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Erreur lors de la recuperation des documents:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
