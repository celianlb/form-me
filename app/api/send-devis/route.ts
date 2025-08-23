import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nom,
      prenom,
      email,
      telephone,
      profil,
      modalite,
      apprenants,
      ville,
      codePostal,
      message,
      formationTitle,
    } = body;

    // Validation des champs requis
    if (
      !nom ||
      !prenom ||
      !email ||
      !telephone ||
      !profil ||
      !apprenants ||
      !ville ||
      !codePostal ||
      !formationTitle
    ) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être renseignés" },
        { status: 400 }
      );
    }

    // Construction du contenu HTML de l'email
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouvelle demande de devis - ${formationTitle}</title>
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
            <h1>🎓 Nouvelle demande de devis</h1>
            <p>Une nouvelle demande de devis vient d'être soumise</p>
          </div>

          <div class="formation-title">
            <h2>Formation : ${formationTitle}</h2>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <strong>👤 Nom complet</strong>
              ${prenom} ${nom}
            </div>
            <div class="info-item">
              <strong>📧 Email</strong>
              <a href="mailto:${email}">${email}</a>
            </div>
            <div class="info-item">
              <strong>📱 Téléphone</strong>
              <a href="tel:${telephone}">${telephone}</a>
            </div>
            <div class="info-item">
              <strong>🏢 Profil</strong>
              ${profil === "entreprise" ? "Entreprise" : "Particulier"}
            </div>
            <div class="info-item">
              <strong>📍 Localisation</strong>
              ${ville}, ${codePostal}
            </div>
            <div class="info-item">
              <strong>👥 Nombre d'apprenants</strong>
              ${apprenants} personne${apprenants > 1 ? "s" : ""}
            </div>
          </div>

          ${
            modalite
              ? `
            <div class="info-item" style="margin: 20px 0;">
              <strong>🎯 Modalité souhaitée</strong>
              ${modalite === "elearning" ? "E-learning" : "Sur site"}
            </div>
          `
              : ""
          }

          ${
            message
              ? `
            <div class="message-section">
              <strong>💬 Message complémentaire :</strong>
              <p style="margin: 10px 0 0 0; white-space: pre-line;">${message}</p>
            </div>
          `
              : ""
          }

          <div class="footer">
            <p>Cette demande a été envoyée automatiquement depuis votre site web.</p>
            <p>Pensez à répondre rapidement pour offrir la meilleure expérience client ! ⚡</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoi de l'email
    const data = await resend.emails.send({
      from: "Form-Me <onboarding@resend.dev>", // Utilisez onboarding@resend.dev pour les tests
      to: ["celianlebacle06@gmail.com"], // Remplacez par votre vraie adresse email
      subject: `📋 Nouvelle demande de devis - ${formationTitle}`,
      html: htmlContent,
      text: `
Nouvelle demande de devis pour la formation : ${formationTitle}

Informations du contact :
- Nom : ${prenom} ${nom}
- Email : ${email}
- Téléphone : ${telephone}
- Profil : ${profil === "entreprise" ? "Entreprise" : "Particulier"}
- Localisation : ${ville}, ${codePostal}
- Nombre d'apprenants : ${apprenants}
${
  modalite
    ? `- Modalité : ${modalite === "elearning" ? "E-learning" : "Sur site"}`
    : ""
}

${message ? `Message : ${message}` : ""}
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Demande de devis envoyée avec succès",
      data: data,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de l'envoi de la demande. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}
