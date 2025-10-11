import { createMetadata } from '@/lib/metadata';
import { ReactNode } from 'react';

export const metadata = createMetadata({
  title: 'Administration',
  description: 'Espace d\'administration Form Me - Gestion de la plateforme',
  noIndex: true,
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
