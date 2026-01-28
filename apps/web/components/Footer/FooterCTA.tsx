"use client";

import { Mail, Phone, MessageCircle, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "../UI/Button";

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

const formationCategories = [
  { label: "CACES® et autorisation de conduite", href: "/formations/category/caces-autorisation-conduite" },
  { label: "AIPR", href: "/formations/category/aipr" },
  { label: "Habilitations électriques", href: "/formations/category/habilitations-electriques" },
  { label: "Travaux en hauteurs", href: "/formations/category/travaux-hauteurs-echafaudage" },
  { label: "Incendie & évacuation", href: "/formations/category/incendie-&-evacuation" },
  { label: "SST", href: "/formations/category/sauveteurs-secouristes-au-travail" },
];

const menuLinks = [
  { label: "Toutes les formations", href: "/formations" },
  { label: "Nous rejoindre", href: "/nous-rejoindre" },
  { label: "Certifications & qualité", href: "/certifications-qualite" },
  { label: "Devis & Contact", href: "/devis-&-contact" },
];

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politiques-de-confidentialite" },
];

export default function FooterCTA() {
  return (
    <footer className="bg-white px-4 md:px-10 lg:px-[120px] pt-10 md:pt-16 pb-8">
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 mb-8">
        {/* Left Column - CTA Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4 md:gap-5">
          {/* Card 1 - Prêt à vous former */}
          <div className="bg-gray-200/80 rounded-4xl p-6 md:p-8 relative overflow-hidden">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4">
              <span className="text-xs font-satoshi font-semibold text-darkBlue">
                Contactez-nous
              </span>
            </div>

            {/* Titre */}
            <h2 className="font-sora font-bold text-2xl md:text-3xl text-darkBlue mb-3 tracking-tight">
              Prêt à vous{" "}
              <span className="text-grayBlue italic">former</span> ?
            </h2>

            {/* Description */}
            <p className="text-grayBlue font-satoshi max-w-md mb-6">
              Nous sommes à votre écoute pour répondre à vos questions et vous
              accompagner dans votre projet de formation.
            </p>

            {/* CTA Button */}
            <Button variant="dark" href="/devis-&-contact">
              Demander un devis
            </Button>
          </div>

          {/* Card 2 - Restons en contact */}
          <div className="bg-gray-200/80 rounded-4xl p-6 md:p-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4">
              <span className="text-xs font-satoshi font-semibold text-darkBlue uppercase tracking-wide">
                Restons en contact
              </span>
            </div>

            {/* Description */}
            <p className="text-grayBlue font-satoshi mb-5 max-w-md">
              Suivez-nous sur LinkedIn pour rester informé de nos actualités et nouveautés.
            </p>

            {/* LinkedIn Button */}
            <Link
              href="https://www.linkedin.com/company/form-me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-darkBlue text-white font-satoshi font-semibold text-sm rounded-full pl-5 pr-2 py-2 hover:bg-darkBlue/90 transition-all duration-200 group mb-6"
            >
              Suivez-nous sur LinkedIn
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Linkedin className="w-4 h-4 text-white" />
              </div>
            </Link>

            {/* Contact Cards */}
            <div className="flex flex-wrap gap-3">
              {contactOptions.map((contact, index) => (
                <Link
                  key={index}
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`border-2 border-dashed border-gray-300 bg-white rounded-xl px-4 py-3 flex items-center gap-3 hover:border-primary/50 hover:shadow-sm transition-all ${
                    index === 1 ? "rotate-1" : index === 2 ? "-rotate-1" : ""
                  }`}
                >
                  <contact.icon className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <h3 className="font-satoshi font-bold text-darkBlue text-xs">
                      {contact.title}
                    </h3>
                    <p className="text-grayBlue text-[10px] font-satoshi">
                      {contact.value}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Menu */}
        <div className="lg:col-span-5 bg-gray-200/80 rounded-4xl p-6 md:p-8 flex flex-col relative overflow-hidden">
          {/* Background Logo - Decorative */}
          <div className="absolute bottom-20 right-0 w-64 h-64 opacity-[0.07] pointer-events-none z-0">
            <Image
              src="/logo/logoBlack.png"
              fill
              alt=""
              className="object-contain"
            />
          </div>

          {/* Menu Title */}
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 mb-5 w-fit relative z-10">
            <span className="text-xs font-satoshi font-semibold text-darkBlue uppercase tracking-wide">
              Menu
            </span>
          </div>

          {/* Menu Links */}
          <nav className="flex flex-col gap-2 mb-6 relative z-10">
            {menuLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="font-sora font-semibold text-lg md:text-xl text-darkBlue hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Formation Categories */}
          <div className="mt-auto pt-4 border-t border-gray-300/50 relative z-10">
            <p className="text-xs font-satoshi font-semibold text-grayBlue uppercase tracking-wide mb-3">
              Nos formations
            </p>
            <div className="flex flex-wrap gap-2">
              {formationCategories.map((cat, index) => (
                <Link
                  key={index}
                  href={cat.href}
                  className="text-xs font-satoshi text-grayBlue hover:text-primary transition-colors duration-200"
                >
                  {cat.label}
                  {index < formationCategories.length - 1 && <span className="ml-2 text-gray-300">•</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-300/50">
        {/* Legal Links */}
        <div className="flex items-center gap-4 text-sm font-satoshi text-grayBlue">
          {legalLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="hover:text-darkBlue transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-sm font-satoshi text-grayBlue">
          © {new Date().getFullYear()} FormMe
        </p>
      </div>
    </footer>
  );
}
