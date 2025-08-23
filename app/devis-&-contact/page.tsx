import Heading from "@/components/UI/Heading";
import Image from "next/image";

export default function DevisContactPage() {
  return (
    <main>
      <section className="px-5 lg:px-[120px] pt-[200px] pb-[80px] relative z-10">
        <div className="flex flex-col gap-8 w-1/3">
          <Heading level={1}>Bienvenue sur notre formulaire de devis !</Heading>
          <div className="bg-white border border-primary/30 p-8 flex flex-col gap-8 rounded-[32px]">
            <div className="flex flex-col gap-4 md:flex-row justify-between">
              <div className="flex gap-2 items-center">
                <Image
                  src={"/contact/devis/mail.svg"}
                  width={40}
                  height={40}
                  alt="mail svg"
                />
                <p>form.me@gmail.com</p>
              </div>
              <div className="flex gap-2 items-center">
                <Image
                  src={"/contact/devis/phone.svg"}
                  width={40}
                  height={40}
                  alt="mail svg"
                />
                <p>+33766763911</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
