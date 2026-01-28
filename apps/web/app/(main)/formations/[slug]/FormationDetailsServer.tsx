import {
  FormationWithDetails,
  TrainingModule,
  TrainingObjective,
} from "@/types/formationDetails";
import FormationDetailsNav from "./FormationDetailsNav";

interface FormationDetailsProps {
  formation: FormationWithDetails;
}

// Section configuration - shared between server content and client nav
export const sections = [
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
] as const;

export type SectionConfig = (typeof sections)[number];

// Helper to check if a section has content
function hasContent(content: unknown, type: string): boolean {
  if (!content) return false;

  switch (type) {
    case "text":
      return typeof content === "string" && content.trim().length > 0;
    case "objectives":
    case "modules":
      return Array.isArray(content) && content.length > 0;
    default:
      return false;
  }
}

// Get sections that have content for a formation
export function getAvailableSections(formation: FormationWithDetails) {
  return sections.filter((section) => {
    const content = formation[section.key as keyof FormationWithDetails];
    return hasContent(content, section.type);
  });
}

// Render text content with paragraphs
function TextContent({ content }: { content: string }) {
  const paragraphs = content.split("\n").filter((p) => p.trim() !== "");

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-darkBlue leading-relaxed">
          {paragraph.trim()}
        </p>
      ))}
    </div>
  );
}

// Render objectives list
function ObjectivesContent({
  objectives,
}: {
  objectives: TrainingObjective[];
}) {
  if (objectives.length === 0) {
    return <p className="text-darkBlue/60 italic">Aucun objectif défini</p>;
  }

  return (
    <ul className="space-y-3">
      {objectives.map((objective) => (
        <li key={objective.id} className="flex items-center gap-3">
          <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
          <p className="text-grayBlue leading-relaxed font-satoshi">
            {objective.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

// Render modules list
function ModulesContent({ modules }: { modules: TrainingModule[] }) {
  if (modules.length === 0) {
    return <p className="text-darkBlue/60 italic">Aucun module défini</p>;
  }

  return (
    <div className="space-y-6">
      {modules.map((module) => (
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
            <div className="leading-relaxed">
              {module.content.split("\n").map((line, index) => (
                <p key={index} className="mb-2 font-satoshi text-grayBlue">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Render content based on type
function SectionContent({
  content,
  type,
}: {
  content: unknown;
  type: string;
}) {
  if (!content) return null;

  switch (type) {
    case "text":
      if (typeof content !== "string") {
        return <p className="text-darkBlue/60 italic">Contenu invalide</p>;
      }
      return <TextContent content={content} />;

    case "objectives":
      if (!Array.isArray(content)) {
        return <p className="text-darkBlue/60 italic">Contenu invalide</p>;
      }
      return <ObjectivesContent objectives={content as TrainingObjective[]} />;

    case "modules":
      if (!Array.isArray(content)) {
        return <p className="text-darkBlue/60 italic">Contenu invalide</p>;
      }
      return <ModulesContent modules={content as TrainingModule[]} />;

    default:
      return (
        <p className="text-darkBlue/60 italic">Type de contenu non reconnu</p>
      );
  }
}

// Server Component - renders all SEO content
export default function FormationDetailsServer({
  formation,
}: FormationDetailsProps) {
  const availableSections = getAvailableSections(formation);

  // If no sections have content, don't render anything
  if (availableSections.length === 0) {
    return null;
  }

  return (
    <section className="px-[40px] md:px-[120px] py-[80px]">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Navigation menu - Client Component for scroll tracking */}
        <div className="md:w-1/3 hidden md:block">
          <FormationDetailsNav availableSections={availableSections} />
        </div>

        {/* Content - Server rendered for SEO */}
        <div className="lg:w-2/3">
          <div className="space-y-16">
            {availableSections.map((section) => {
              const content =
                formation[section.key as keyof FormationWithDetails];

              return (
                <div key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="text-xl font-satoshi font-bold text-darkBlue mb-6">
                    {section.title}
                  </h2>
                  <div className="prose max-w-none">
                    <SectionContent content={content} type={section.type} />
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
