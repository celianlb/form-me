import Heading from "@/components/UI/Heading";
import BentoGrid from "./BentoGrid";

export default async function BentoSection() {
  return (
    <section className="px-[40px] md:px-[120px] py-[90px] flex flex-col gap-[100px]">
      <div>
        <Heading level={2}>Une formation en 4 étapes simples</Heading>
        <p className="max-w-[600px] text-grayBlue mt-4">
          Découvrez comment nous rendons la formation professionnelle simple et
          efficace, de la sélection à la certification.
        </p>
      </div>
      <BentoGrid />
    </section>
  );
}
