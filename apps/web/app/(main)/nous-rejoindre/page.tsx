"use client";

import HeroSection from "@/components/HeroSection";
import Button from "@/components/UI/Button";
import FileUpload from "@/components/UI/FileUpload";
import Heading from "@/components/UI/Heading";
import {
  Banknote,
  BookOpen,
  Building2,
  Check,
  Clock,
  FileText,
  Headphones,
  Mail,
  Percent,
  Phone,
  Receipt,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function NousRejoindre() {
  const [activeForm, setActiveForm] = useState<"formateur" | "partenaire">(
    "formateur"
  );
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    nomEntreprise: "",
    numSiret: "",
    cv: null as {
      url: string;
      size: number;
      type: string;
      originalName: string;
    } | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileUploaded = (fileData: {
    url: string;
    size: number;
    type: string;
    originalName: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      cv: fileData,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { type: activeForm, data: formData });
  };

  const formateurBenefits = [
    { icon: Clock, label: "Flexibilité des horaires" },
    { icon: Banknote, label: "Rémunération attractive" },
    { icon: BookOpen, label: "Support pédagogique" },
  ];

  const partenaireBenefits = [
    { icon: Percent, label: "Tarifs préférentiels à la journée" },
    { icon: Receipt, label: "Facturation au forfait journalier" },
    { icon: Users, label: "Réseau de distribution" },
    { icon: Headphones, label: "Accompagnement personnalisé" },
    { icon: Sparkles, label: "Accès prioritaire aux nouveautés" },
  ];

  const tarifExemples = [
    { formation: "ATEX", prix: "910€ HT/j" },
    { formation: "CACES R489", prix: "790€ HT/j" },
    { formation: "Travail en Hauteur", prix: "790€ HT/j" },
  ];

  return (
    <main>
      {/* Hero Section */}
      <HeroSection className="pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-satoshi font-semibold text-darkBlue">
              Rejoignez-nous
            </span>
          </div>

          <Heading level={1} className="mb-4 max-w-2xl">
            Construisons ensemble l&apos;avenir de la{" "}
            <span className="text-darkBlue/60 italic">formation</span>
          </Heading>

          <p className="text-lg text-grayBlue max-w-xl font-satoshi">
            Que vous soyez formateur expérimenté ou organisme de formation,
            rejoignez notre écosystème et développons ensemble des solutions
            innovantes.
          </p>
        </div>
      </HeroSection>

      {/* Opportunités Section - Style Bento */}
      <section className="px-4 md:px-10 lg:px-[120px] py-16">
        <div className="mb-12 text-center">
          <Heading level={2} className="mb-4">
            Deux façons de nous rejoindre
          </Heading>
          <p className="text-grayBlue font-satoshi text-lg max-w-lg mx-auto">
            Choisissez l&apos;opportunité qui correspond le mieux à votre profil
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Card Formateur - Style clair */}
          <div className="bg-gray-100 rounded-4xl p-6 md:p-8 flex flex-col">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 mb-6 w-fit">
              <User className="w-4 h-4 text-primary" />
              <span className="text-xs font-satoshi font-semibold text-darkBlue">
                Pour les formateurs
              </span>
            </div>

            <Heading level={3} className="mb-3">
              Devenez formateur
            </Heading>

            <p className="text-grayBlue font-satoshi mb-6">
              Partagez votre expertise et accompagnez les apprenants dans leur
              développement professionnel.
            </p>

            {/* Benefits badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {formateurBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`border-2 border-dashed border-gray-300 bg-white rounded-xl px-4 py-2 flex items-center gap-2 ${
                    index === 1 ? "rotate-1" : index === 2 ? "-rotate-1" : ""
                  }`}
                >
                  <benefit.icon className="w-4 h-4 text-primary" />
                  <span className="font-satoshi font-semibold text-sm text-darkBlue">
                    {benefit.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <Button
                variant="dark"
                onClick={() => {
                  setActiveForm("formateur");
                  document
                    .getElementById("formulaire")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Devenir formateur
              </Button>
            </div>
          </div>

          {/* Card Partenaire - Style sombre */}
          <div className="bg-darkBlue rounded-4xl p-6 md:p-8 flex flex-col relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
            <Image
              src="/bento/dot-pattern-bento.svg"
              width={300}
              height={300}
              alt=""
              className="absolute bottom-0 right-0 opacity-10"
            />

            <div className="relative z-10 flex flex-col h-full">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 mb-6 w-fit">
                <Building2 className="w-4 h-4 text-white" />
                <span className="text-xs font-satoshi font-semibold text-white">
                  Pour les entreprises
                </span>
              </div>

              <h3 className="font-sora font-bold text-2xl text-white mb-3 tracking-tight">
                Devenez partenaire
              </h3>

              <p className="text-white/70 font-satoshi mb-6">
                Intégrez notre réseau de partenaires et développez votre
                activité de formation avec des tarifs préférentiels.
              </p>

              {/* Benefits list */}
              <div className="space-y-2 mb-6">
                {partenaireBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-satoshi text-sm text-white/90">
                      {benefit.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <Button
                  variant="light"
                  onClick={() => {
                    setActiveForm("partenaire");
                    document
                      .getElementById("formulaire")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Devenir partenaire
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire Section */}
      <section id="formulaire" className="px-4 md:px-10 lg:px-[120px] py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Heading level={2} className="mb-4">
              Candidater maintenant
            </Heading>
            <p className="text-grayBlue font-satoshi text-lg">
              Remplissez le formulaire correspondant à votre profil
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-10">
            <div className="bg-gray-100 rounded-full p-1.5">
              <button
                onClick={() => setActiveForm("formateur")}
                className={`px-6 cursor-pointer py-3 rounded-full font-satoshi font-semibold text-sm transition-all ${
                  activeForm === "formateur"
                    ? "bg-darkBlue text-white shadow-md"
                    : "text-grayBlue hover:text-darkBlue"
                }`}
              >
                Formateur
              </button>
              <button
                onClick={() => setActiveForm("partenaire")}
                className={`px-6 cursor-pointer py-3 rounded-full font-satoshi font-semibold text-sm transition-all ${
                  activeForm === "partenaire"
                    ? "bg-darkBlue text-white shadow-md"
                    : "text-grayBlue hover:text-darkBlue"
                }`}
              >
                Partenaire
              </button>
            </div>
          </div>

          {/* Formulaire Card */}
          <div className="bg-gray-100 rounded-4xl p-6 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champs communs */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-satoshi font-semibold text-darkBlue mb-2 text-sm">
                    Prénom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grayBlue" />
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:outline-none font-satoshi text-sm"
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-satoshi font-semibold text-darkBlue mb-2 text-sm">
                    Nom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grayBlue" />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:outline-none font-satoshi text-sm"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-satoshi font-semibold text-darkBlue mb-2 text-sm">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grayBlue" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:outline-none font-satoshi text-sm"
                      placeholder="votre.email@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-satoshi font-semibold text-darkBlue mb-2 text-sm">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grayBlue" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:outline-none font-satoshi text-sm"
                      placeholder="06 12 34 56 78"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Champs spécifiques partenaire */}
              {activeForm === "partenaire" && (
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-satoshi font-semibold text-darkBlue mb-2 text-sm">
                      Nom de l&apos;entreprise *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grayBlue" />
                      <input
                        type="text"
                        name="nomEntreprise"
                        value={formData.nomEntreprise}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:outline-none font-satoshi text-sm"
                        placeholder="Nom de votre entreprise"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-satoshi font-semibold text-darkBlue mb-2 text-sm">
                      Numéro SIRET *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grayBlue" />
                      <input
                        type="text"
                        name="numSiret"
                        value={formData.numSiret}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:outline-none font-satoshi text-sm"
                        placeholder="12345678901234"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Upload CV pour formateur */}
              {activeForm === "formateur" && (
                <div>
                  <label className="block font-satoshi font-semibold text-darkBlue mb-3 text-sm">
                    CV *
                  </label>
                  <FileUpload
                    onFileUploaded={handleFileUploaded}
                    acceptedTypes={[
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ]}
                    maxSizeMB={5}
                  />
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="dark"
                  className="w-full md:w-auto"
                >
                  Envoyer ma candidature
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
