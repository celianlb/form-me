"use client";

import HeroSection from "@/components/HeroSection";
import CTA from "@/components/Section/CTA";
import Badge from "@/components/UI/Badge";
import Button from "@/components/UI/Button";
import FileUpload from "@/components/UI/FileUpload";
import Heading from "@/components/UI/Heading";
import { Building2, FileText, Mail, Phone, User } from "lucide-react";
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

  return (
    <main>
      {/* Hero Section */}
      <HeroSection className="flex flex-col gap-8 md:gap-12 min-h-0 pt-[180px] pb-[80px] ">
        <div className="text-center">
          <Badge className="mb-4">Rejoignez-nous</Badge>
          <Heading level={1} className="mb-4 max-w-xl mx-auto">
            Construisons ensemble l&apos;avenir de la formation
          </Heading>
          <p className="text-lg text-grayBlue max-w-xl mx-auto font-satoshi">
            Que vous soyez formateur expérimenté ou organisme de formation,
            rejoignez notre écosystème et développons ensemble des solutions
            innovantes.
          </p>
        </div>
      </HeroSection>

      {/* CTA Section */}
      <CTA />

      {/* Opportunités Section */}
      <section className="py-20 px-12 md:px-[120px] ">
        <div className=" mx-auto">
          <div className="mb-16">
            <Heading level={2} className="mb-4">
              Deux façons de nous rejoindre
            </Heading>
            <p className="text-grayBlue font-satoshi text-[16px]">
              Choisissez l&apos;opportunité qui correspond le mieux à votre
              profil
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Section Formateur */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_0px_10px_rgba(18,94,255,0.1)] border border-primary/20">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/5 rounded-xl flex items-center justify-center mb-4">
                  <Image
                    src={"/nous-rejoindre/Account.svg"}
                    width={48}
                    height={48}
                    alt="Partenaire"
                  />
                </div>
                <Heading level={3} className="mb-4">
                  Devenez formateur
                </Heading>
                <p className="text-grayBlue font-satoshi mb-6">
                  Partagez votre expertise et accompagnez les apprenants dans
                  leur développement professionnel.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-satoshi text-sm">
                    Flexibilité des horaires
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-satoshi text-sm">
                    Rémunération attractive
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-satoshi text-sm">
                    Support pédagogique
                  </span>
                </div>
              </div>
            </div>

            {/* Section Partenaire */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_0px_10px_rgba(18,94,255,0.1)] border border-primary/20">
              <div className="mb-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Image
                    src={"/nous-rejoindre/Company.svg"}
                    width={48}
                    height={48}
                    alt="Partenaire"
                  />
                </div>
                <Heading level={3} className="mb-4">
                  Devenez partenaire
                </Heading>
                <p className="text-grayBlue font-satoshi mb-6">
                  Intégrez notre réseau de partenaires et développez votre
                  activité de formation avec des tarifs préférentiels.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-grayBlue rounded-full"></div>
                  <span className="font-satoshi text-sm">
                    <strong>Tarifs préférentiels</strong> à la journée sur
                    toutes nos formations
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-grayBlue rounded-full"></div>
                  <span className="font-satoshi text-sm">
                    Facturation <strong>au forfait journalier</strong> (non par
                    stagiaire)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-grayBlue rounded-full"></div>
                  <span className="font-satoshi text-sm">
                    Réseau de distribution et outils marketing
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-grayBlue rounded-full"></div>
                  <span className="font-satoshi text-sm">
                    Accompagnement business personnalisé
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-grayBlue rounded-full"></div>
                  <span className="font-satoshi text-sm">
                    Accès prioritaire aux nouvelles formations
                  </span>
                </div>
              </div>

              {/* Encadré tarif exemple */}
              <div className="mt-6 bg-primary/10 border border-primary rounded-xl p-4">
                <p className="text-xs font-satoshi text-grayBlue mb-2">
                  Exemple de tarifs partenaire
                </p>
                <div className="space-y-2 text-sm font-satoshi">
                  <div className="flex justify-between items-center">
                    <span className="text-grayBlue">ATEX</span>
                    <span className="font-bold text-darkBlue">910€ HT/j</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-grayBlue">CACES R489</span>
                    <span className="font-bold text-darkBlue">790€ HT/j</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-grayBlue">Travail en Hauteur</span>
                    <span className="font-bold text-darkBlue">790€ HT/j</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire Section */}
      <section className="py-20 px-4 md:px-8 relative">
        <Image
          src={"/top10/dot-pattern-left.svg"}
          width={700}
          height={700}
          alt="Formulaire"
          className="absolute left-0 -z-10"
        />
        <Image
          src={"/top10/dot-pattern-right.svg"}
          width={700}
          height={700}
          alt="Formulaire"
          className="absolute right-0 -z-10"
        />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              Candidater maintenant
            </Heading>
            <p className="text-grayBlue font-satoshi">
              Remplissez le formulaire correspondant à votre profil
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-1 shadow-[0_0px_10px_rgba(18,94,255,0.1)] border border-primary/20">
              <button
                onClick={() => setActiveForm("formateur")}
                className={`px-6 cursor-pointer py-3 rounded-full font-satoshi font-medium transition-all ${
                  activeForm === "formateur"
                    ? "bg-primary text-white shadow-md"
                    : "text-grayBlue hover:text-primary"
                }`}
              >
                Formateur
              </button>
              <button
                onClick={() => setActiveForm("partenaire")}
                className={`px-6 cursor-pointer py-3 rounded-full font-satoshi font-medium transition-all ${
                  activeForm === "partenaire"
                    ? "bg-primary text-white shadow-md"
                    : "text-grayBlue hover:text-primary"
                }`}
              >
                Partenaire
              </button>
            </div>
          </div>

          {/* Formulaire */}
          <div className=" rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champs communs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-satoshi font-medium text-darkBlue mb-2">
                    Prénom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none font-satoshi"
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-satoshi font-medium text-darkBlue mb-2">
                    Nom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none font-satoshi"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-satoshi font-medium text-darkBlue mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none font-satoshi"
                      placeholder="votre.email@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-satoshi font-medium text-darkBlue mb-2">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none font-satoshi"
                      placeholder="06 12 34 56 78"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Champs spécifiques partenaire */}
              {activeForm === "partenaire" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-satoshi font-medium text-darkBlue mb-2">
                      Nom de l&apos;entreprise *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="nomEntreprise"
                        value={formData.nomEntreprise}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none font-satoshi"
                        placeholder="Nom de votre entreprise"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-satoshi font-medium text-darkBlue mb-2">
                      Numéro SIRET *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="numSiret"
                        value={formData.numSiret}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none font-satoshi"
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
                  <label className="block font-satoshi font-medium text-darkBlue mb-4">
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

              <div className="pt-6">
                <Button type="submit" className="w-full md:w-auto px-8">
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
