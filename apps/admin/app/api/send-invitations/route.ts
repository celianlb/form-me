import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { groupId, members, memberIds } = await request.json();

    if (!groupId) {
      return NextResponse.json(
        { error: "ID de groupe requis" },
        { status: 400 }
      );
    }

    // Get the group details
    const group = await prisma.supportGroup.findUnique({
      where: { id: parseInt(groupId) },
      include: {
        training: {
          select: { title: true },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Groupe non trouve" }, { status: 404 });
    }

    // Get members to invite
    let membersToInvite;
    if (memberIds && memberIds.length > 0) {
      membersToInvite = await prisma.supportGroupMember.findMany({
        where: {
          id: { in: memberIds.map((id: number) => parseInt(String(id))) },
          groupId: parseInt(groupId),
          status: "INVITED",
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    } else if (members && members.length > 0) {
      membersToInvite = await prisma.supportGroupMember.findMany({
        where: {
          userId: { in: members.map((m: { userId: number }) => m.userId) },
          groupId: parseInt(groupId),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    } else {
      return NextResponse.json(
        { error: "Aucun membre a inviter" },
        { status: 400 }
      );
    }

    const sentInvitations: string[] = [];
    const failedInvitations: string[] = [];

    console.log(`[send-invitations] Envoi d'invitations pour ${membersToInvite.length} membre(s)`);

    for (const member of membersToInvite) {
      console.log(`[send-invitations] Traitement de ${member.user.email}`);
      try {
        // Generate an invite token
        const token = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

        await prisma.inviteToken.create({
          data: {
            token,
            userId: member.user.id,
            expiresAt,
          },
        });

        // Build the invitation URL
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const inviteUrl = `${baseUrl}/auth/setup-password?token=${token}`;

        // Send the email
        console.log(`[send-invitations] Envoi email a ${member.user.email} via Resend...`);
        const emailResult = await resend.emails.send({
          from: "Form Me <noreply@form-me.fr>",
          to: member.user.email,
          subject: `Invitation a la formation: ${group.training.title}`,
          html: `
            <h1>Bienvenue sur Form Me</h1>
            <p>Bonjour${member.user.firstName ? ` ${member.user.firstName}` : ""},</p>
            <p>Vous avez ete invite a participer a la formation <strong>${group.training.title}</strong>.</p>
            <p>Pour acceder a vos supports de formation, veuillez configurer votre mot de passe en cliquant sur le lien ci-dessous:</p>
            <p><a href="${inviteUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Configurer mon mot de passe</a></p>
            <p>Ce lien est valide pendant 7 jours.</p>
            <p>Si vous n'etes pas concerne par cette invitation, vous pouvez ignorer cet email.</p>
            <p>Cordialement,<br>L'equipe Form Me</p>
          `,
        });

        console.log(`[send-invitations] Email envoyé avec succès:`, emailResult);
        sentInvitations.push(member.user.email);
      } catch (error) {
        console.error(
          `Erreur lors de l'envoi de l'invitation a ${member.user.email}:`,
          error
        );
        failedInvitations.push(member.user.email);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${sentInvitations.length} invitation(s) envoyee(s)`,
      sentInvitations,
      failedInvitations,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi des invitations:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
