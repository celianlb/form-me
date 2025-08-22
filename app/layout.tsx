import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import type { Metadata } from "next";
import "./globals.css";
import { CategoriesService } from "@/services/categories.service";

export const metadata: Metadata = {
  title: "Form Me",
  description: "Form Me is a platform to study and learn",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await CategoriesService.getAllCategories();
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <Header categories={categories} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
