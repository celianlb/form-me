import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { PrismaClient } from "../../../../generated/prisma";
import { authOptions } from "../../../../lib/auth";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

function generateRandomPassword(length = 12): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { groupId, members } = await request.json();

    if (!groupId || !members?.length) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Récupérer les informations du groupe
    const group = await prisma.supportGroup.findUnique({
      where: { id: groupId },
      include: {
        training: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Groupe non trouvé" }, { status: 404 });
    }

    const invitationResults = [];

    for (const member of members) {
      try {
        // Récupérer l'utilisateur
        const user = await prisma.user.findUnique({
          where: { id: member.userId },
        });

        if (!user) {
          console.log(`Utilisateur ${member.userId} non trouvé`);
          continue;
        }

        // Si l'utilisateur n'a pas de mot de passe, en générer un
        let temporaryPassword = null;
        if (!user.passwordHash) {
          temporaryPassword = generateRandomPassword();
          const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

          await prisma.user.update({
            where: { id: user.id },
            data: {
              passwordHash: hashedPassword,
              mustChangePassword: true,
            },
          });
        }

        // Créer un token d'invitation
        const token =
          Math.random().toString(36).substring(2) + Date.now().toString(36);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

        await prisma.inviteToken.create({
          data: {
            userId: user.id,
            token,
            type: "SET_PASSWORD",
            expiresAt,
          },
        });

        // Construire l'email d'invitation
        const isNewUser = !!temporaryPassword;
        const loginUrl = `${process.env.NEXTAUTH_URL}/auth/signin`;

        const htmlContent = `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invitation - Accès aux supports de formation</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
              }
              .container {
                background: white;
                border-radius: 12px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                border-bottom: 2px solid #125eff;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .header h1 {
                color: #125eff;
                margin: 0;
                font-size: 24px;
              }
              .formation-info {
                background: #f0f7ff;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #125eff;
                margin: 20px 0;
              }
              .credentials {
                background: #fff3cd;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #ffeaa7;
                margin: 20px 0;
              }
              .credentials h3 {
                color: #856404;
                margin-top: 0;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #125eff;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                text-align: center;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 Accès à vos supports de formation</h1>
                <p>Vous avez été invité(e) à accéder aux supports de votre formation</p>
              </div>

              <div class="formation-info">
                <h2>📚 Formation : ${group.training.title}</h2>
                <p><strong>Entreprise :</strong> ${group.companyName}</p>
                <p><strong>Date de formation :</strong> ${new Date(
                  group.trainingDate
                ).toLocaleDateString("fr-FR")}</p>
              </div>

              ${
                isNewUser
                  ? `
                <div class="credentials">
                  <h3>🔐 Vos identifiants de connexion</h3>
                  <p><strong>Email :</strong> ${user.email}</p>
                  <p><strong>Mot de passe temporaire :</strong> ${temporaryPassword}</p>
                  <p style="color: #856404;">
                    <strong>⚠️ Important :</strong> Vous devrez modifier votre mot de passe lors de votre première connexion pour des raisons de sécurité.
                  </p>
                </div>
              `
                  : `
                <p>Utilisez votre email et mot de passe existants pour vous connecter.</p>
              `
              }

              <div style="text-align: center;">
                <a href="${loginUrl}" class="button">
                  Se connecter aux supports de formation
                </a>
              </div>

              <div style="margin: 30px 0;">
                <h3>📋 Ce que vous trouverez :</h3>
                <ul>
                  <li>Supports de cours de votre formation</li>
                  <li>Ressources complémentaires</li>
                  <li>Documents à télécharger</li>
                  <li>Liens utiles</li>
                </ul>
              </div>

              <div class="footer">
                <p>Cette invitation est valide pendant 7 jours.</p>
                <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
                <p>Équipe Form-Me</p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Envoyer l'email
        const emailData = await resend.emails.send({
          from: "Form-Me <onboarding@resend.dev>",
          to: [user.email],
          subject: `🎓 Accès aux supports - ${group.training.title}`,
          html: htmlContent,
          text: `
Bonjour,

Vous avez été invité(e) à accéder aux supports de formation pour :
Formation : ${group.training.title}
Entreprise : ${group.companyName}
Date : ${new Date(group.trainingDate).toLocaleDateString("fr-FR")}

${
  isNewUser
    ? `
Vos identifiants de connexion :
Email : ${user.email}
Mot de passe temporaire : ${temporaryPassword}

⚠️ Vous devrez modifier votre mot de passe lors de votre première connexion.
`
    : "Utilisez vos identifiants existants pour vous connecter."
}

Lien de connexion : ${loginUrl}

Cette invitation est valide pendant 7 jours.

Équipe Form-Me
          `,
        });

        invitationResults.push({
          userId: user.id,
          email: user.email,
          success: true,
          isNewUser,
          emailId: emailData.data?.id,
        });
      } catch (error) {
        console.error(`Erreur pour l'utilisateur ${member.userId}:`, error);
        invitationResults.push({
          userId: member.userId,
          success: false,
          error: error instanceof Error ? error.message : "Erreur inconnue",
        });
      }
    }

    // Mettre à jour le statut des membres
    for (const result of invitationResults) {
      if (result.success) {
        await prisma.supportGroupMember.updateMany({
          where: {
            groupId: groupId,
            userId: result.userId,
          },
          data: {
            status: "INVITED",
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      results: invitationResults,
      message: `${
        invitationResults.filter((r) => r.success).length
      } invitation(s) envoyée(s) avec succès`,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi des invitations:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi des invitations" },
      { status: 500 }
    );
  }
}
