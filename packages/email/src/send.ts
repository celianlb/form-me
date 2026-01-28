import { resend } from './client';
import { getQuoteNotificationHtml } from './templates/quote-notification';
import { getInvitationHtml } from './templates/invitation';

const FROM_EMAIL = 'Form-Me <noreply@form-me.com>';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@form-me.com';

interface SendQuoteNotificationParams {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  profile: 'INDIVIDUAL' | 'PROFESSIONAL';
  city: string;
  postalCode: string;
  formationTitle: string;
  categoryName?: string;
  sessionTitle?: string;
  sessionDate?: string;
  numberLearners: number;
  mode?: 'PARTNER_CENTER' | 'E_LEARNING';
  message?: string;
}

export async function sendQuoteNotification(params: SendQuoteNotificationParams) {
  const html = getQuoteNotificationHtml({
    ...params,
    profile: params.profile,
  });

  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Nouvelle demande de devis - ${params.formationTitle}`,
    html,
  });
}

interface SendInvitationParams {
  firstName?: string;
  email: string;
  temporaryPassword: string;
  groupName: string;
  trainingTitle: string;
  companyName: string;
}

export async function sendInvitation(params: SendInvitationParams) {
  const loginUrl = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/auth/signin` : 'https://form-me.com/auth/signin';

  const html = getInvitationHtml({
    ...params,
    loginUrl,
  });

  return resend.emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject: `Invitation à rejoindre le groupe ${params.groupName} - Form-Me`,
    html,
  });
}
