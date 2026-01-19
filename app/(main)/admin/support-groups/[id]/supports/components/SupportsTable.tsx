"use client";

import { Download, Edit2, Trash2 } from "lucide-react";
import { Support } from "./types";
import { formatFileSize, getFileTypeIcon } from "./utils";

interface SupportsTableProps {
  supports: Support[];
  onEdit: (support: Support) => void;
  onDelete: (supportId: number) => void;
}

export default function SupportsTable({
  supports,
  onEdit,
  onDelete,
}: SupportsTableProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {supports.map((support) => {
        const IconComponent = getFileTypeIcon(support.type);
        return (
          <div
            key={support.id}
            className="group border border-gray-100 rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-satoshi font-semibold text-darkBlue truncate mb-1">
                  {support.title}
                </h4>
                <div className="text-xs font-satoshi text-grayBlue bg-gray-50 px-2 py-1 rounded-md inline-block">
                  {support.type.toUpperCase()}
                  {support.fileSize &&
                    ` • ${formatFileSize(Number(support.fileSize))}`}
                </div>
              </div>
            </div>

            {support.description && (
              <p className="text-sm font-satoshi text-grayBlue mb-4 leading-relaxed">
                {support.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <a
                href={support.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm font-satoshi font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Download className="w-4 h-4 mr-1" />
                {support.type === "link" ? "Ouvrir" : "Télécharger"}
              </a>

              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(support)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(support.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
