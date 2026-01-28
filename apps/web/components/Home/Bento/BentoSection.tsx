import Heading from "@/components/UI/Heading";
import BentoGrid from "./BentoGrid";

export default async function BentoSection() {
  return (
    <section className="px-[40px] md:px-[120px] py-[90px] flex flex-col gap-8 md:gap-12">
      <div>
        <h2 className="text-[28px] md:text-[32px] tracking-[-1.5px] text-darkBlue font-sora font-bold">
          Une formation en 4 étapes{" "}
          <span className="text-darkBlue/60 italic">simples</span>
        </h2>
        <p className="max-w-[600px] text-grayBlue mt-4">
          Découvrez comment nous rendons la formation professionnelle simple et
          efficace, de la sélection à la certification.
        </p>
      </div>
      <BentoGrid />
    </section>
  );
}
