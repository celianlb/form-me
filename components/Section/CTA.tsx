import Button from "../UI/Button";
import Heading from "../UI/Heading";

function Stats({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex flex-col gap-2 md:gap-4 items-start w-full">
      <p className=" leading-none text-primary font-satoshi font-bold text-[48px] tracking-[-2px]">
        {number}
      </p>
      <p className="font-satoshi tracking-tight text-grayBlue">{label}</p>
    </div>
  );
}

export default function CTA() {
  return (
    <section className="bg-[#DBE6FF]/20 border border-primary/10 p-6 md:p-12 flex flex-col gap-16 md:gap-20 mx-[40px] md:mx-[120px] rounded-[32px] md:rounded-[50px] my-[80px]">
      <div className="flex justify-between items-center">
        <Heading level={2}>Nous privilégions la qualité</Heading>
        <Button className="hidden md:block" variant="secondary">
          Demander un devis
        </Button>
      </div>
      <div className="flex flex-col md:flex-row w-fit justify-between mx-auto gap-12">
        <Stats number={"99%"} label="de satisfaction des apprenants" />
        <Stats number={"29K+"} label="apprenants formés" />
        <Stats number={"4990"} label="sessions de formations effectuées" />
      </div>
      <Button className="block md:hidden" variant="secondary">
        Demander un devis
      </Button>
    </section>
  );
}
