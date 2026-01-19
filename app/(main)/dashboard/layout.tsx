import { createMetadata } from '@/lib/metadata';
import { ReactNode } from 'react';

export const metadata = createMetadata({
  title: 'Tableau de bord',
  description: 'Tableau de bord Form Me - Espace personnel',
  noIndex: true,
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
