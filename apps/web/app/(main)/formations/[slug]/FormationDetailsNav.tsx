"use client";

import { useEffect, useState } from "react";
import type { SectionConfig } from "./FormationDetailsServer";

interface FormationDetailsNavProps {
  availableSections: readonly SectionConfig[];
}

export default function FormationDetailsNav({
  availableSections,
}: FormationDetailsNavProps) {
  const [activeSection, setActiveSection] = useState(
    availableSections.length > 0 ? availableSections[0].id : ""
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for detection

      for (let i = availableSections.length - 1; i >= 0; i--) {
        const section = document.getElementById(availableSections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(availableSections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [availableSections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sticky top-32">
      <nav className="space-y-2">
        {availableSections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-satoshi ${
              activeSection === section.id
                ? "text-primary font-medium"
                : "text-darkBlue hover:bg-primary/10 hover:text-primary"
            }`}
          >
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  );
}
