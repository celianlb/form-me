import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { id } = await params;
    const supportId = parseInt(id);

    if (isNaN(supportId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await request.json();
    const { isActive, title, description, type } = body;

    // Build update data
    const updateData: any = {};
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type) updateData.type = type;

    const support = await prisma.support.update({
      where: { id: supportId },
      data: updateData,
    });

    return NextResponse.json({
      ...support,
      fileSize: support.fileSize ? Number(support.fileSize) : null,
    });
  } catch (error) {
    console.error("Erreur lors de la mise a jour du support:", error);
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
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { id } = await params;
    const supportId = parseInt(id);

    if (isNaN(supportId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.support.delete({
      where: { id: supportId },
    });

    return NextResponse.json({
      success: true,
      message: "Support supprime avec succes",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du support:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
