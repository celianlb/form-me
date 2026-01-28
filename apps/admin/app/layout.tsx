import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Form-Me Admin",
  description: "Backoffice d'administration Form-Me",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
