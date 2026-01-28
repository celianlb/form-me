interface InvitationData {
  firstName?: string;
  email: string;
  temporaryPassword: string;
  groupName: string;
  trainingTitle: string;
  companyName: string;
  loginUrl: string;
}

export function getInvitationHtml(data: InvitationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .credentials { background: #fff; border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bienvenue sur Form-Me</h1>
        </div>
        <div class="content">
          <p>Bonjour${data.firstName ? ` ${data.firstName}` : ''},</p>
          <p>Vous avez été ajouté(e) au groupe de formation <strong>${data.groupName}</strong> pour la formation <strong>${data.trainingTitle}</strong> chez <strong>${data.companyName}</strong>.</p>
          <p>Vous pouvez maintenant accéder à vos supports de cours en vous connectant à votre espace.</p>
          <div class="credentials">
            <p><strong>Vos identifiants de connexion :</strong></p>
            <p>Email : ${data.email}</p>
            <p>Mot de passe temporaire : ${data.temporaryPassword}</p>
            <p><em>Vous devrez changer ce mot de passe lors de votre première connexion.</em></p>
          </div>
          <center>
            <a href="${data.loginUrl}" class="button">Accéder à mon espace</a>
          </center>
        </div>
        <div class="footer">
          <p>Cet email a été envoyé automatiquement par Form-Me</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
