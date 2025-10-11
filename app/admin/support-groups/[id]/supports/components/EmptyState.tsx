"use client";

import Button from "@/components/UI/Button";
import { FolderOpen, Plus } from "lucide-react";

interface EmptyStateProps {
  onAddClick: () => void;
}

export default function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h4 className="text-lg font-satoshi font-medium text-darkBlue mb-2">
        Aucun support disponible
      </h4>
      <p className="text-gray-500 mb-6">
        Commencez par ajouter le premier support pour cette formation
      </p>
      <Button onClick={onAddClick} variant="primary">
        <Plus className="w-4 h-4 mr-2" />
        Ajouter le premier support
      </Button>
    </div>
  );
}
