"use client";

import {
  FormationWithDetails,
  TrainingModule,
  TrainingObjective,
} from "@/types/formationDetails";
import { useEffect, useState } from "react";

interface FormationDetailsProps {
  formation: FormationWithDetails;
}

const sections = [
  {
    id: "targetAudience",
    title: "Public visé",
    key: "targetAudience",
    type: "text",
  },
  {
    id: "trainingModules",
    title: "Modules de formation",
    key: "trainingModules",
    type: "modules",
  },
  {
    id: "trainingObjectives",
    title: "Objectifs pédagogiques",
    key: "trainingObjectives",
    type: "objectives",
  },
  {
    id: "teachingMeans",
    title: "Méthodes d'apprentissage",
    key: "teachingMeans",
    type: "text",
  },
  {
    id: "evaluationMethods",
    title: "Méthodes d'évaluation",
    key: "evaluationMethods",
    type: "text",
  },
  {
    id: "validationMethods",
    title: "Méthodes de validation",
    key: "validationMethods",
    type: "text",
  },
  {
    id: "monitoringMethods",
    title: "Méthodes de suivi",
    key: "monitoringMethods",
    type: "text",
  },
  {
    id: "renewalRecommendation",
    title: "Recommandation de renouvellement",
    key: "renewalRecommendation",
    type: "text",
  },
];

export default function FormationDetails({ formation }: FormationDetailsProps) {
  const [activeSection, setActiveSection] = useState("targetAudience");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset pour la détection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderContent = (content: unknown, type: string) => {
    if (!content) {
      return <p className="text-darkBlue/60 italic">Contenu non disponible</p>;
    }

    switch (type) {
      case "text":
        // Si le contenu contient des sauts de ligne, on les convertit en paragraphes
        if (typeof content !== "string")
          return <p className="text-darkBlue/60 italic">Contenu invalide</p>;
        const paragraphs = content
          .split("\n")
          .filter((p: string) => p.trim() !== "");

        return (
          <div className="space-y-4">
            {paragraphs.map((paragraph: string, index: number) => (
              <p key={index} className="text-darkBlue leading-relaxed">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        );

      case "objectives":
        if (!Array.isArray(content) || content.length === 0) {
          return (
            <p className="text-darkBlue/60 italic">Aucun objectif défini</p>
          );
        }

        return (
          <ul className="space-y-3">
            {content.map((objective: TrainingObjective) => (
              <li key={objective.id} className="flex items-center gap-3">
                <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
                <p className="text-grayBlue leading-relaxed font-satoshi">
                  {objective.text}
                </p>
              </li>
            ))}
          </ul>
        );

      case "modules":
        if (!Array.isArray(content) || content.length === 0) {
          return <p className="text-darkBlue/60 italic">Aucun module défini</p>;
        }

        return (
          <div className="space-y-6">
            {content.map((module: TrainingModule) => (
              <div
                key={module.id}
                className="border border-grayBlue/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium font-satoshi">
                    Module {module.order}
                  </span>
                  {module.type && (
                    <span className="bg-darkBlue/10 text-darkBlue px-3 py-1 rounded-full text-sm font-satoshi">
                      {module.type === "THEORETICAL" ? "Théorique" : "Pratique"}
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-satoshi font-semibold text-grayBlue mb-3">
                  {module.title}
                </h4>
                {module.content && (
                  <div className=" leading-relaxed">
                    {module.content.split("\n").map((line, index) => (
                      <p
                        key={index}
                        className="mb-2 font-satoshi text-grayBlue"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return (
          <p className="text-darkBlue/60 italic">Type de contenu non reconnu</p>
        );
    }
  };

  return (
    <section className="px-[40px] md:px-[120px] py-[80px]">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Menu de navigation à gauche */}
        <div className="lg:w-1/3">
          <div className="sticky top-32">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-satoshi ${
                    activeSection === section.id
                      ? "bg-primary text-white font-medium"
                      : "text-darkBlue hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu à droite */}
        <div className="lg:w-2/3">
          <div className="space-y-16">
            {sections.map((section) => {
              const content =
                formation[section.key as keyof FormationWithDetails];

              return (
                <div key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="text-xl font-satoshi font-bold text-darkBlue mb-6">
                    {section.title}
                  </h2>
                  <div className="prose max-w-none">
                    {renderContent(content, section.type)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
