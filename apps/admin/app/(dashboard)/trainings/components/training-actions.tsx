"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Eye, Pencil, Trash2, Archive, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

interface TrainingActionsProps {
  training: {
    id: number;
    title: string;
    status: string;
    _count?: {
      sessions?: number;
      supportGroups?: number;
      quotes?: number;
    };
  };
}

export function TrainingActions({ training }: TrainingActionsProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasDependencies =
    (training._count?.sessions ?? 0) > 0 ||
    (training._count?.supportGroups ?? 0) > 0 ||
    (training._count?.quotes ?? 0) > 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/trainings/${training.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression");
      }

      toast.success(hasDependencies ? "Formation archivee" : "Formation supprimee", {
        description: `"${training.title}" a ete ${hasDependencies ? "archivee" : "supprimee"} avec succes.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error deleting training:", error);
      toast.error("Erreur", {
        description: error instanceof Error ? error.message : "Erreur lors de la suppression",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "publiee";
      case "DRAFT": return "mise en brouillon";
      case "ARCHIVED": return "archivee";
      default: return "mise a jour";
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/trainings/${training.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la mise a jour");
      }

      toast.success("Statut mis a jour", {
        description: `La formation a ete ${getStatusLabel(newStatus)}.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating training status:", error);
      toast.error("Erreur", {
        description: error instanceof Error ? error.message : "Erreur lors de la mise a jour",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/trainings/${training.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            Voir
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/trainings/${training.id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {training.status === "DRAFT" && (
            <DropdownMenuItem onClick={() => handleStatusChange("PUBLISHED")}>
              <Globe className="mr-2 h-4 w-4" />
              Publier
            </DropdownMenuItem>
          )}

          {training.status === "PUBLISHED" && (
            <DropdownMenuItem onClick={() => handleStatusChange("DRAFT")}>
              <Pencil className="mr-2 h-4 w-4" />
              Repasser en brouillon
            </DropdownMenuItem>
          )}

          {training.status !== "ARCHIVED" && (
            <DropdownMenuItem onClick={() => handleStatusChange("ARCHIVED")}>
              <Archive className="mr-2 h-4 w-4" />
              Archiver
            </DropdownMenuItem>
          )}

          {training.status === "ARCHIVED" && (
            <DropdownMenuItem onClick={() => handleStatusChange("DRAFT")}>
              <Pencil className="mr-2 h-4 w-4" />
              Desarchiver
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la formation</AlertDialogTitle>
            <AlertDialogDescription>
              {hasDependencies ? (
                <>
                  Cette formation a des dependances (sessions, groupes ou devis).
                  Elle sera archivee au lieu d&apos;etre supprimee.
                </>
              ) : (
                <>
                  Etes-vous sur de vouloir supprimer la formation &quot;{training.title}&quot; ?
                  Cette action est irreversible.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Suppression..." : hasDependencies ? "Archiver" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
