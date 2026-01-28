import { Mail, Phone, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "../UI/Button";

export default function CTADevis() {
  const contactOptions = [
    {
      icon: Mail,
      title: "Par email",
      value: "contact@form-me.fr",
      href: "mailto:contact@form-me.fr",
    },
    {
      icon: Phone,
      title: "Par téléphone",
      value: "+33 7 66 76 39 11",
      href: "tel:+33766763911",
    },
    {
      icon: MessageCircle,
      title: "Par WhatsApp",
      value: "Discutons ensemble",
      href: "https://wa.me/33766763911",
    },
  ];

  return (
    <section className="px-10 md:px-[120px] py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Card principale - CTA Devis */}
        <div className="lg:col-span-3 bg-darkBlue rounded-4xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
          <Image
            src="/bento/dot-pattern-bento.svg"
            width={400}
            height={400}
            alt=""
            className="absolute bottom-0 right-0 opacity-10"
          />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4">
              <span className="text-xs font-satoshi font-semibold text-white">
                Contactez-nous
              </span>
            </div>

            {/* Titre */}
            <h2 className="font-sora font-bold text-2xl md:text-3xl text-white mb-3 tracking-tight">
              Prêt à vous{" "}
              <span className="text-white/80 italic">former</span> ?
            </h2>

            {/* Description */}
            <p className="text-white/70 font-satoshi max-w-md mb-6">
              Nous sommes à votre écoute pour répondre à vos questions et vous
              accompagner dans votre projet de formation.
            </p>
          </div>

          {/* CTA Button */}
          <div className="relative z-10">
            <Button variant="light" href="/devis-&-contact">
              Demander un devis
            </Button>
          </div>
        </div>

        {/* Cards contact - style badges */}
        <div className="lg:col-span-2 flex flex-col gap-5 justify-center">
          {contactOptions.map((contact, index) => (
            <Link
              key={index}
              href={contact.href}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`border-2 border-dashed border-gray-300 bg-white rounded-xl px-5 py-4 flex items-center gap-4 hover:border-primary/50 hover:shadow-sm transition-all ${
                index === 1 ? "rotate-2" : index === 2 ? "-rotate-1" : ""
              }`}
            >
              <contact.icon className="w-5 h-5 text-primary shrink-0" />
              <div>
                <h3 className="font-satoshi font-bold text-darkBlue text-sm">
                  {contact.title}
                </h3>
                <p className="text-grayBlue text-xs font-satoshi">
                  {contact.value}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
