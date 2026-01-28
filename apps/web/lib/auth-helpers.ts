/**
 * Helper pour vérifier les permissions admin
 */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error('Non authentifié');
  }

  if (session.user.role !== 'ADMIN') {
    throw new Error('Accès refusé: droits administrateur requis');
  }

  return session.user;
}
