import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["received", "contacted", "processed", "converted", "archived"]),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);

    const quote = await prisma.quote.findUnique({
      where: { id: parseInt(id) },
    });

    if (!quote) {
      return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 });
    }

    const updatedQuote = await prisma.quote.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        training: { select: { title: true } },
        session: { select: { title: true, startDate: true } },
      },
    });

    return NextResponse.json(updatedQuote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error updating quote status:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
