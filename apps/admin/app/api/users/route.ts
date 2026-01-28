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
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const whereConditions: Record<string, unknown> = {};

    if (search) {
      whereConditions.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && role !== "all") {
      whereConditions.role = role;
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereConditions,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          mustChangePassword: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              supportGroupMemberships: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereConditions }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la recuperation des utilisateurs:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { userId, updates } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    // Validation des champs autorises
    const allowedFields = [
      "firstName",
      "lastName",
      "role",
      "isActive",
      "mustChangePassword",
    ];
    const filteredUpdates: Record<string, unknown> = {};

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { error: "Aucun champ valide a mettre a jour" },
        { status: 400 }
      );
    }

    // Empecher l'admin de se desactiver lui-meme
    if (
      filteredUpdates.isActive === false &&
      parseInt(userId) === parseInt(session.user.id)
    ) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas desactiver votre propre compte" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: filteredUpdates,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Utilisateur mis a jour avec succes",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur lors de la mise a jour de l'utilisateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    // Empecher l'admin de se supprimer lui-meme
    if (parseInt(userId) === parseInt(session.user.id)) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte" },
        { status: 400 }
      );
    }

    // Supprimer d'abord toutes les relations
    await Promise.all([
      prisma.supportGroupMember.deleteMany({
        where: { userId: parseInt(userId) },
      }),
      prisma.inviteToken.deleteMany({
        where: { userId: parseInt(userId) },
      }),
    ]);

    // Puis supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: parseInt(userId) },
    });

    return NextResponse.json({
      success: true,
      message: "Utilisateur supprime avec succes",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
