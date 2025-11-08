import Image from "next/image";
import Button from "../UI/Button";
import Heading from "../UI/Heading";

export default function CTADevis() {
  return (
    <section className="bg-[#DBE6FF]/20 border items-center border-primary/10 p-6 md:p-12 flex flex-col md:flex-row gap-16 md:gap-20 mx-[40px] md:mx-[120px] rounded-[32px] md:rounded-[50px] my-[80px]">
      <div className="flex flex-col gap-4 md:w-1/2">
        <Heading level={2}>Prêt à vous former ?</Heading>
        <p className="text-grayBlue">
          Nous sommes à votre écoute pour répondre à vos questions et vous
          accompagner dans votre projet de formation.
        </p>
      </div>
      <div className="bg-white border border-primary/30 md:w-1/2 p-8 flex flex-col gap-8 rounded-[32px]">
        <div className="flex flex-col gap-4 md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <Image
              src={"/contact/Devis/mail.svg"}
              width={40}
              height={40}
              alt="mail svg"
            />
            <p>contact@form-me.fr</p>
          </div>
          <div className="flex gap-2 items-center">
            <Image
              src={"/contact/Devis/phone.svg"}
              width={40}
              height={40}
              alt="mail svg"
            />
            <p>+33766763911</p>
          </div>
        </div>

        <Button variant="primary" href="/devis-&-contact">
          Demander un devis
        </Button>
      </div>
    </section>
  );
}
