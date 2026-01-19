"use client";

import Button from "@/components/UI/Button";
import { FolderOpen, Plus } from "lucide-react";
import { Support } from "./types";
import SupportsTable from "./SupportsTable";
import EmptyState from "./EmptyState";

interface SupportsListSectionProps {
  supports: Support[];
  showCreateForm: boolean;
  onEdit: (support: Support) => void;
  onDelete: (supportId: number) => void;
  onAddClick: () => void;
}

export default function SupportsListSection({
  supports,
  showCreateForm,
  onEdit,
  onDelete,
  onAddClick,
}: SupportsListSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-primary/20">
      <div className="p-6 border-b border-grayBlue/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-satoshi font-semibold text-darkBlue flex items-center">
            <FolderOpen className="w-5 h-5 mr-2 text-primary" />
            Supports disponibles ({supports.length})
          </h3>
          {supports.length > 0 && !showCreateForm && (
            <Button
              onClick={onAddClick}
              variant="secondary"
              className="text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          )}
        </div>
      </div>
      <div className="p-6">
        {supports.length === 0 ? (
          <EmptyState onAddClick={onAddClick} />
        ) : (
          <SupportsTable
            supports={supports}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
}
