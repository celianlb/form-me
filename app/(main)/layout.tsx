import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { CategoriesService } from "@/services/categories.service";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await CategoriesService.getCategoriesWithTrainingCount();
  return (
    <>
      <Header categories={categories} />
      {children}
      <Footer />
    </>
  );
}
