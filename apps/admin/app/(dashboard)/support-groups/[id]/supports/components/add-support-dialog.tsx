"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddSupportDialogProps {
  trainingId: number;
}

export function AddSupportDialog({ trainingId }: AddSupportDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "PDF",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.title) {
        // Auto-fill title from filename
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setFormData({ ...formData, title: fileName });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Veuillez selectionner un fichier");
      return;
    }

    setIsLoading(true);

    try {
      // First, upload the file
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);
      uploadFormData.append("folder", "supports");

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Erreur lors de l'upload du fichier");
      }

      const uploadResult = await uploadResponse.json();

      // Then, create the support
      const response = await fetch("/api/supports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainingId,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          fileUrl: uploadResult.url,
          fileSize: selectedFile.size,
        }),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({ title: "", description: "", type: "PDF" });
        setSelectedFile(null);
        router.refresh();
      } else {
        const result = await response.json();
        alert(result.error || "Erreur lors de la creation du support");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la creation du support");
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} Mo`;
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} Ko`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un support
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un support</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau support de formation (PDF, video, document).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File upload */}
          <div className="space-y-2">
            <Label>Fichier *</Label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.webm,.mov"
            />
            {selectedFile ? (
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Selectionner un fichier
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre du support"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description optionnelle"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="DOCUMENT">Document</SelectItem>
                <SelectItem value="OTHER">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !selectedFile}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
