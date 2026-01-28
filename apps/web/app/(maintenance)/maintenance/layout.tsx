import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance en cours - Form Me',
  description:
    'Form Me est actuellement en maintenance. Nous serons de retour très bientôt.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
