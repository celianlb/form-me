import Button from "@/components/UI/Button";
import {
  BarChart,
  File,
  FileText,
  FolderOpen,
  Link,
  Video,
} from "lucide-react";
import Image from "next/image";
import { GroupDetail } from "./types";

interface SupportsSectionProps {
  supports: GroupDetail["training"]["supports"];
  onManageSupports: () => void;
}

export function SupportsSection({
  supports,
  onManageSupports,
}: SupportsSectionProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-500" />;
      case "ppt":
      case "pptx":
        return <BarChart className="w-6 h-6 text-orange-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-6 h-6 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <BarChart className="w-6 h-6 text-green-500" />;
      case "video":
        return <Video className="w-6 h-6 text-purple-500" />;
      case "link":
        return <Link className="w-6 h-6 text-blue-400" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden">
      <div className="relative p-8 bg-gradient-to-r from-white to-purple-50/50 border-b border-b-grayBlue/20">
        <Image
          src="/formation/dot-pattern.svg"
          width={120}
          height={120}
          alt=""
          className="absolute top-0 right-0 -z-10"
        />
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-satoshi font-bold text-darkBlue mb-2 flex items-center">
              <FolderOpen className="w-6 h-6 mr-2 text-purple-600" />
              Supports de formation ({supports.length})
            </h3>
            <p className="text-gray-600">
              Ressources disponibles pour cette formation
            </p>
          </div>
          <Button
            onClick={onManageSupports}
            variant="outline"
            className="text-sm"
          >
            Gérer
          </Button>
        </div>
      </div>
      <div className="p-6">
        {supports.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun support disponible</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {supports.map((support) => (
              <div
                key={support.id}
                className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getFileTypeIcon(support.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-satoshi font-medium text-darkBlue truncate">
                      {support.title}
                    </h4>
                    {support.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {support.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {support.type}
                        {support.fileSize &&
                          ` • ${formatFileSize(Number(support.fileSize))}`}
                      </span>
                      <a
                        href={support.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-primary text-white px-3 py-1 rounded-lg hover:bg-primary/80 transition-colors"
                      >
                        {support.type === "link" ? "Ouvrir" : "Télécharger"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
