import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const quote = await prisma.quote.findUnique({
      where: { id: parseInt(id) },
      include: {
        training: {
          select: {
            id: true,
            title: true,
            slug: true,
            durationHours: true,
            durationDays: true,
            category: { select: { name: true } }
          }
        },
        session: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            location: true,
            mode: true
          }
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const quote = await prisma.quote.findUnique({
      where: { id: parseInt(id) },
    });

    if (!quote) {
      return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 });
    }

    // Archive instead of hard delete
    await prisma.quote.update({
      where: { id: parseInt(id) },
      data: { status: "archived" },
    });

    return NextResponse.json({ message: "Devis archivé" });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
