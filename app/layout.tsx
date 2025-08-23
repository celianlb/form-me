import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import type { Metadata } from "next";
import "./globals.css";
import { CategoriesService } from "@/services/categories.service";
import Providers from "@/components/Providers/SessionProvider";

export const metadata: Metadata = {
  title: "Form Me",
  description: "Form Me is a platform to study and learn",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await CategoriesService.getCategoriesWithTrainingCount();
  return (
    <html lang="en">
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
