import Heading from "@/components/UI/Heading";
import BentoGrid from "./BentoGrid";

export default async function BentoSection() {
  return (
    <section className="px-[40px] md:px-[120px] py-[90px] flex flex-col gap-[100px]">
      <Heading level={2}>Comment ça fonctionne ?</Heading>
      <BentoGrid />
    </section>
  );
}
