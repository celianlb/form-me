"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/UI/Button";
import { Save, X } from "lucide-react";
import { Support, SupportFormData } from "./types";
import FileUploadSection from "./FileUploadSection";

interface SupportFormProps {
  editingSupport: Support | null;
  onSubmit: (formData: SupportFormData) => Promise<void>;
  onCancel: () => void;
}

export default function SupportForm({
  editingSupport,
  onSubmit,
  onCancel,
}: SupportFormProps) {
  const [formData, setFormData] = useState<SupportFormData>({
    title: editingSupport?.title || "",
    description: editingSupport?.description || "",
    type: editingSupport?.type || "pdf",
    fileUrl: editingSupport?.fileUrl || "",
    fileSize: editingSupport?.fileSize?.toString() || "",
  });

  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">(
    editingSupport?.fileUrl.includes('cloudinary.com') ? "upload" : "url"
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUploaded = (fileData: {
    url: string;
    size: number;
    type: string;
    originalName: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      title: prev.title || fileData.originalName,
      fileUrl: fileData.url,
      fileSize: fileData.size.toString(),
      type: fileData.type
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden mb-8">
      {/* Header du formulaire */}
      <div className="relative p-8 bg-gradient-to-r from-white to-primary/5 border-b border-b-grayBlue/20">
        <Image
          src="/formation/dot-pattern.svg"
          width={150}
          height={150}
          alt=""
          className="absolute top-0 right-0"
        />
        <h3 className="text-2xl font-satoshi font-bold text-darkBlue mb-2">
          {editingSupport
            ? "Modifier le support"
            : "Ajouter un nouveau support"}
        </h3>
        <p className="text-gray-600">
          {editingSupport
            ? "Modifiez les informations du support"
            : "Ajoutez un nouveau support pour cette formation"
          }
        </p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
              >
                Titre *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                placeholder="Ex: Guide de formation Excel"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
              >
                Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi bg-white"
              >
                <option value="pdf">PDF</option>
                <option value="ppt">PowerPoint</option>
                <option value="pptx">PowerPoint (PPTX)</option>
                <option value="doc">Word</option>
                <option value="docx">Word (DOCX)</option>
                <option value="xls">Excel</option>
                <option value="xlsx">Excel (XLSX)</option>
                <option value="video">Vidéo</option>
                <option value="link">Lien</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>

          {/* Méthode d'ajout du fichier */}
          <FileUploadSection
            uploadMethod={uploadMethod}
            fileUrl={formData.fileUrl}
            onMethodChange={setUploadMethod}
            onFileUploaded={handleFileUploaded}
            onUrlChange={handleInputChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi resize-none"
                placeholder="Description du support..."
              />
            </div>

            <div>
              <label
                htmlFor="fileSize"
                className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
              >
                Taille du fichier (en bytes)
              </label>
              <input
                type="number"
                id="fileSize"
                name="fileSize"
                value={formData.fileSize}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                placeholder="Ex: 2048000"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" onClick={onCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              <Save className="w-4 h-4 mr-2" />
              {editingSupport ? "Enregistrer les modifications" : "Créer le support"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
