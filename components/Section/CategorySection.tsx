import { CategoriesService } from "@/services/categories.service";
import FormationCategory from "../FormationCategory";
import Heading from "../UI/Heading";

export default async function CategorySection() {
  const categoriesSection =
    await CategoriesService.getCategoriesWithTrainingCount();
  return (
    <section className="flex flex-col gap-16 ml-10 md:ml-[120px] py-[90px]">
      <div className="flex flex-col gap-6">
        <Heading level={2}>Les catégories de formations</Heading>
        <p className="max-w-[460px] text-grayBlue">
          Explorez les différentes catégories de formations que nous proposons
          et trouvez ce qui vous corresponds{" "}
        </p>
      </div>

      <FormationCategory categories={categoriesSection} />
    </section>
  );
}
