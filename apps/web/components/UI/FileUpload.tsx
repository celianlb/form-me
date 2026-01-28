"use client";

import { AlertCircle, CheckCircle, File, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import Button from "./Button";

interface FileUploadProps {
  onFileUploaded: (fileData: {
    url: string;
    size: number;
    type: string;
    originalName: string;
  }) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  className?: string;
}

interface UploadedFile {
  url: string;
  size: number;
  type: string;
  originalName: string;
  publicId: string;
}

export default function FileUpload({
  onFileUploaded,
  acceptedTypes = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "video/mp4",
    "video/avi",
    "video/mov",
  ],
  maxSizeMB = 50,
  className = "",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileTypeDisplay = (type: string): string => {
    const types: { [key: string]: string } = {
      pdf: "PDF",
      pptx: "PowerPoint",
      ppt: "PowerPoint",
      docx: "Word",
      doc: "Word",
      xlsx: "Excel",
      xls: "Excel",
      video: "Vidéo",
      other: "Autre",
    };
    return types[type] || type.toUpperCase();
  };

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return "Type de fichier non autorisé";
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Fichier trop volumineux (max ${maxSizeMB}MB)`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const fileData = result.data;
        setUploadedFile(fileData);
        onFileUploaded(fileData);
      } else {
        setError(result.error || "Erreur lors de l'upload");
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      setError("Erreur lors de l'upload du fichier");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (uploadedFile) {
    return (
      <div
        className={`bg-green-50 border border-green-200 rounded-xl p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-satoshi font-medium text-green-800">
                {uploadedFile.originalName}
              </p>
              <p className="text-sm text-green-600">
                {getFileTypeDisplay(uploadedFile.type)} •{" "}
                {formatFileSize(uploadedFile.size)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={clearFile}
            variant="outline"
            className="text-sm"
          >
            <X className="w-4 h-4 mr-1" />
            Changer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-primary/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {uploading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-satoshi text-primary font-medium">
              Upload en cours...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="font-satoshi font-medium text-darkBlue mb-2">
                Glissez votre fichier ici ou
              </p>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
                className="text-sm"
              >
                <File className="w-4 h-4 mr-2" />
                Parcourir les fichiers
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              PDF, PPT, DOC, XLS, Vidéos • Max {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm font-satoshi text-red-800">{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
