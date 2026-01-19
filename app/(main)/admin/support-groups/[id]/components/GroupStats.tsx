import Image from "next/image";
import { GroupDetail } from "./types";

interface GroupStatsProps {
  group: GroupDetail;
}

export function GroupStats({ group }: GroupStatsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden mb-8">
      <div className="relative p-8 bg-gradient-to-r from-white to-primary/5 border-b border-b-grayBlue/20">
        <Image
          src="/formation/dot-pattern.svg"
          width={150}
          height={150}
          alt=""
          className="absolute top-0 right-0"
        />
        <div className="flex flex-col lg:flex-row justify-between gap-6 items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-satoshi font-bold text-darkBlue mb-2">
              Détails du Groupe
            </h2>
            <div className="flex flex-col md:flex-row gap-2 text-sm">
              <p className="bg-primary text-white px-3 py-1 rounded-full inline-block w-fit">
                <strong>Entreprise :</strong> {group.companyName}
              </p>
              <p className="bg-primary/5 text-primary px-3 py-1 rounded-full inline-block w-fit">
                <strong>Formation :</strong> {group.training.title}
              </p>
              <p className="bg-platinium/60 text-darkBlue px-3 py-1 rounded-full inline-block w-fit">
                <strong>Date :</strong>{" "}
                {new Date(group.trainingDate).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                group.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {group.isActive ? "✅ Actif" : "❌ Inactif"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
