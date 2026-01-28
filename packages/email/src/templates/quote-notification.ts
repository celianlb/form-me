interface QuoteNotificationData {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  profile: string;
  city: string;
  postalCode: string;
  formationTitle: string;
  categoryName?: string;
  sessionTitle?: string;
  sessionDate?: string;
  numberLearners: number;
  mode?: string;
  message?: string;
}

export function getQuoteNotificationHtml(data: QuoteNotificationData): string {
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
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1e3a5f; }
        .value { margin-top: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouvelle demande de devis</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Formation demandée</div>
            <div class="value">${data.formationTitle}${data.categoryName ? ` (${data.categoryName})` : ''}</div>
          </div>
          ${data.sessionTitle ? `
          <div class="field">
            <div class="label">Session</div>
            <div class="value">${data.sessionTitle}${data.sessionDate ? ` - ${data.sessionDate}` : ''}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Contact</div>
            <div class="value">${data.firstName} ${data.lastName || ''}</div>
            <div class="value">${data.email}</div>
            ${data.phone ? `<div class="value">${data.phone}</div>` : ''}
          </div>
          <div class="field">
            <div class="label">Profil</div>
            <div class="value">${data.profile === 'PROFESSIONAL' ? 'Professionnel / Entreprise' : 'Particulier'}</div>
          </div>
          <div class="field">
            <div class="label">Localisation</div>
            <div class="value">${data.postalCode} ${data.city}</div>
          </div>
          <div class="field">
            <div class="label">Nombre d'apprenants</div>
            <div class="value">${data.numberLearners}</div>
          </div>
          ${data.mode ? `
          <div class="field">
            <div class="label">Modalité souhaitée</div>
            <div class="value">${data.mode === 'E_LEARNING' ? 'E-learning' : 'En centre partenaire'}</div>
          </div>
          ` : ''}
          ${data.message ? `
          <div class="field">
            <div class="label">Message</div>
            <div class="value">${data.message}</div>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>Cet email a été envoyé automatiquement par Form-Me</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
