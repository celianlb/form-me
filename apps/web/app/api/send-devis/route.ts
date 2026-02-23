import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const quoteSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  email: z.string().email(),
  telephone: z.string().optional(),
  profil: z.enum(["entreprise", "particulier"]),
  modalite: z.enum(["elearning", "presentiel", "intra"]).optional(),
  apprenants: z.coerce.number().min(1).default(1),
  ville: z.string().min(1).default("Non renseigné"),
  codePostal: z.string().min(1).default("00000"),
  message: z.string().optional(),
  formationId: z.number().optional(),
  sessionId: z.number().optional(),
  formationTitle: z.string(),
  categoryName: z.string().optional(),
  isReservation: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = quoteSchema.parse(body);

    // Save to database
    const quote = await prisma.quote.create({
      data: {
        firstName: validatedData.prenom,
        lastName: validatedData.nom,
        email: validatedData.email,
        phone: validatedData.telephone,
        profile: validatedData.profil === "entreprise" ? "PROFESSIONAL" : "INDIVIDUAL",
        city: validatedData.ville,
        postalCode: validatedData.codePostal,
        message: validatedData.message,
        trainingId: validatedData.formationId,
        sessionId: validatedData.sessionId,
        mode: validatedData.modalite === "elearning"
          ? "E_LEARNING"
          : validatedData.modalite === "intra"
            ? "INTRA_COMPANY"
            : "PARTNER_CENTER",
        numberLearners: validatedData.apprenants,
        source: "website",
        status: "received",
      },
    });

    // Get session info if provided
    let sessionInfo = null;
    if (validatedData.sessionId) {
      const session = await prisma.trainingSession.findUnique({
        where: { id: validatedData.sessionId },
        select: { title: true, startDate: true },
      });
      sessionInfo = session;
    }

    // Determine if this is a session reservation or quote request
    const isReservation = validatedData.isReservation && sessionInfo;
    const emailTitle = isReservation
      ? "Nouvelle réservation de session"
      : "Nouvelle demande de devis";
    const emailSubtitle = isReservation
      ? "Une nouvelle réservation de session vient d'être soumise"
      : "Une nouvelle demande de devis vient d'être soumise";

    // Construction du contenu HTML de l'email
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailTitle} - ${validatedData.formationTitle}</title>
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
          .formation-title {
            background: #f0f7ff;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #125eff;
            margin: 20px 0;
          }
          .formation-title h2 {
            color: #125eff;
            margin: 0;
            font-size: 18px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
          }
          .info-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
          }
          .info-item strong {
            color: #2c3e50;
            display: block;
            margin-bottom: 5px;
          }
          .message-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
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
          @media (max-width: 600px) {
            .info-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${emailTitle}</h1>
            <p>${emailSubtitle}</p>
          </div>

          <div class="formation-title">
            <h2>Formation : ${validatedData.formationTitle}</h2>
            ${validatedData.categoryName ? `<p style="margin: 5px 0; color: #666;">Categorie : ${validatedData.categoryName}</p>` : ""}
            ${sessionInfo ? `<p style="margin: 5px 0; color: #666;">Session : ${sessionInfo.title} - ${sessionInfo.startDate?.toLocaleDateString("fr-FR")}</p>` : ""}
          </div>

          <div class="info-grid">
            <div class="info-item">
              <strong>Nom complet</strong>
              ${validatedData.prenom} ${validatedData.nom}
            </div>
            <div class="info-item">
              <strong>Email</strong>
              <a href="mailto:${validatedData.email}">${validatedData.email}</a>
            </div>
            <div class="info-item">
              <strong>Telephone</strong>
              ${validatedData.telephone ? `<a href="tel:${validatedData.telephone}">${validatedData.telephone}</a>` : "Non renseigne"}
            </div>
            <div class="info-item">
              <strong>Profil</strong>
              ${validatedData.profil === "entreprise" ? "Entreprise" : "Particulier"}
            </div>
            <div class="info-item">
              <strong>Localisation</strong>
              ${validatedData.ville}, ${validatedData.codePostal}
            </div>
            <div class="info-item">
              <strong>Nombre d'apprenants</strong>
              ${validatedData.apprenants} personne${validatedData.apprenants > 1 ? "s" : ""}
            </div>
          </div>

          ${
            validatedData.modalite
              ? `
            <div class="info-item" style="margin: 20px 0;">
              <strong>Modalite souhaitee</strong>
              ${validatedData.modalite === "elearning" ? "E-learning" : "Sur site"}
            </div>
          `
              : ""
          }

          ${
            validatedData.message
              ? `
            <div class="message-section">
              <strong>Message complementaire :</strong>
              <p style="margin: 10px 0 0 0; white-space: pre-line;">${validatedData.message}</p>
            </div>
          `
              : ""
          }

          <div class="footer">
            <p>Cette demande a ete envoyee automatiquement depuis votre site web.</p>
            <p>Pensez a repondre rapidement pour offrir la meilleure experience client !</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoi de l'email
    try {
      await resend.emails.send({
        from: "Form-Me <onboarding@resend.dev>",
        to: ["celianlebacle06@gmail.com"],
        subject: `${isReservation ? "Réservation" : "Devis"} - ${validatedData.formationTitle}${sessionInfo ? ` (${sessionInfo.startDate?.toLocaleDateString("fr-FR")})` : ""}`,
        html: htmlContent,
        text: `
${emailTitle} pour la formation : ${validatedData.formationTitle}
${validatedData.categoryName ? `Categorie : ${validatedData.categoryName}` : ""}
${sessionInfo ? `Session : ${sessionInfo.title} - ${sessionInfo.startDate?.toLocaleDateString("fr-FR")}` : ""}

Informations du contact :
- Nom : ${validatedData.prenom} ${validatedData.nom}
- Email : ${validatedData.email}
- Telephone : ${validatedData.telephone || "Non renseigne"}
- Profil : ${validatedData.profil === "entreprise" ? "Entreprise" : "Particulier"}
- Localisation : ${validatedData.ville}, ${validatedData.codePostal}
- Nombre d'apprenants : ${validatedData.apprenants}
${
  validatedData.modalite
    ? `- Modalite : ${validatedData.modalite === "elearning" ? "E-learning" : "Sur site"}`
    : ""
}

${validatedData.message ? `Message : ${validatedData.message}` : ""}
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Demande de devis envoyee avec succes",
      quoteId: quote.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Donnees invalides", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error processing quote:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la demande." },
      { status: 500 }
    );
  }
}
