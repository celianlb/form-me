"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Download, MoreHorizontal, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Support {
  id: number;
  title: string;
  description: string | null;
  type: string;
  fileUrl: string;
  fileSize: number | null;
  isActive: boolean;
  createdAt: Date;
}

interface SupportsTableProps {
  supports: Support[];
  trainingId: number;
}

const typeConfig: Record<string, { label: string; color: string }> = {
  PDF: { label: "PDF", color: "bg-red-100 text-red-700" },
  VIDEO: { label: "Video", color: "bg-purple-100 text-purple-700" },
  DOCUMENT: { label: "Document", color: "bg-blue-100 text-blue-700" },
  OTHER: { label: "Autre", color: "bg-gray-100 text-gray-700" },
};

export function SupportsTable({ supports, trainingId }: SupportsTableProps) {
  const router = useRouter();
  const [supportToDelete, setSupportToDelete] = useState<Support | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} Mo`;
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} Ko`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleToggleActive = async (supportId: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/supports/${supportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Erreur lors de la mise a jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise a jour");
    }
  };

  const handleDelete = async () => {
    if (!supportToDelete) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/supports/${supportToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
      setSupportToDelete(null);
    }
  };

  if (supports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Aucun support</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Aucun support n&apos;a encore ete ajoute a cette formation.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Date d&apos;ajout</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supports.map((support) => {
              const type = typeConfig[support.type] || typeConfig.OTHER;
              return (
                <TableRow key={support.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{support.title}</p>
                      {support.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {support.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={type.color} variant="secondary">
                      {type.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatFileSize(support.fileSize)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(support.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={support.isActive ? "default" : "secondary"}>
                      {support.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={support.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(support.id, support.isActive)}
                          >
                            {support.isActive ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Desactiver
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Activer
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSupportToDelete(support)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!supportToDelete} onOpenChange={() => setSupportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le support ?</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer &quot;{supportToDelete?.title}&quot; ? Cette action est
              irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
