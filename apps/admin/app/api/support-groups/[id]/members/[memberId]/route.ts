import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { id, memberId } = await params;
    const groupId = parseInt(id);
    const memberIdNum = parseInt(memberId);

    if (isNaN(groupId) || isNaN(memberIdNum)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // Verifier que le membre existe
    const member = await prisma.supportGroupMember.findFirst({
      where: {
        id: memberIdNum,
        groupId: groupId,
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Membre non trouve" }, { status: 404 });
    }

    // Supprimer le membre
    await prisma.supportGroupMember.delete({
      where: { id: memberIdNum },
    });

    return NextResponse.json({
      success: true,
      message: "Membre retire avec succes",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du membre:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
