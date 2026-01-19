import { createMetadata } from '@/lib/metadata';
import { ReactNode } from 'react';

export const metadata = createMetadata({
  title: 'Authentification',
  description: 'Connexion et authentification sur Form Me',
  noIndex: true,
});

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
