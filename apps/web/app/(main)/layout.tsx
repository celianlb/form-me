import FooterCTA from "@/components/Footer/FooterCTA";
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
      <FooterCTA />
    </>
  );
}
