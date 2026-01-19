"use client";

import Button from "@/components/UI/Button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  groupName: string;
  companyName: string;
  trainingTitle: string;
  onBack: () => void;
  onAddSupport: () => void;
}

export default function PageHeader({
  groupName,
  companyName,
  trainingTitle,
  onBack,
  onAddSupport,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center py-6">
      <div>
        <h1 className="text-3xl font-satoshi font-bold text-darkBlue">
          Supports - {groupName}
        </h1>
        <p className="text-gray-600">
          {companyName} • {trainingTitle}
        </p>
      </div>
      <div className="flex space-x-3">
        <Button onClick={onBack} variant="outline">
          ← Retour au groupe
        </Button>
        <Button onClick={onAddSupport} variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un support
        </Button>
      </div>
    </div>
  );
}
