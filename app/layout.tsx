import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import "./globals.css";
import { CategoriesService } from "@/services/categories.service";
import Providers from "@/components/Providers/SessionProvider";
import { defaultMetadata } from "@/lib/metadata";

export const metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await CategoriesService.getCategoriesWithTrainingCount();
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={` antialiased`}>
        <Providers>
          <Header categories={categories} />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
