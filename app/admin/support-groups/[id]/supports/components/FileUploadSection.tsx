"use client";

import FileUpload from "@/components/UI/FileUpload";

interface FileUploadSectionProps {
  uploadMethod: "upload" | "url";
  fileUrl: string;
  onMethodChange: (method: "upload" | "url") => void;
  onFileUploaded: (fileData: {
    url: string;
    size: number;
    type: string;
    originalName: string;
  }) => void;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUploadSection({
  uploadMethod,
  fileUrl,
  onMethodChange,
  onFileUploaded,
  onUrlChange,
}: FileUploadSectionProps) {
  return (
    <div>
      <label className="block text-sm font-satoshi font-medium text-darkBlue mb-4">
        Méthode d&apos;ajout du fichier *
      </label>
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          onClick={() => onMethodChange("upload")}
          className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-satoshi font-medium transition-colors ${
            uploadMethod === "upload"
              ? "border-primary bg-primary/10 text-primary"
              : "border-gray-200 text-gray-700 hover:border-gray-300"
          }`}
        >
          📤 Upload fichier
        </button>
        <button
          type="button"
          onClick={() => onMethodChange("url")}
          className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-satoshi font-medium transition-colors ${
            uploadMethod === "url"
              ? "border-primary bg-primary/10 text-primary"
              : "border-gray-200 text-gray-700 hover:border-gray-300"
          }`}
        >
          🔗 URL externe
        </button>
      </div>

      {uploadMethod === "upload" ? (
        <div>
          <label className="block text-sm font-satoshi font-medium text-darkBlue mb-3">
            Fichier à uploader *
          </label>
          <FileUpload onFileUploaded={onFileUploaded} />
        </div>
      ) : (
        <div>
          <label
            htmlFor="fileUrl"
            className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
          >
            URL du fichier *
          </label>
          <input
            type="url"
            id="fileUrl"
            name="fileUrl"
            value={fileUrl}
            onChange={onUrlChange}
            required={uploadMethod === "url"}
            className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
            placeholder="https://example.com/fichier.pdf"
          />
        </div>
      )}
    </div>
  );
}
