import {
  FileText,
  Presentation,
  Video,
  Link as LinkIcon,
  File
} from "lucide-react";

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};

export const getFileTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
    case "doc":
    case "docx":
      return FileText;
    case "ppt":
    case "pptx":
      return Presentation;
    case "xls":
    case "xlsx":
      return FileText;
    case "video":
      return Video;
    case "link":
      return LinkIcon;
    default:
      return File;
  }
};
