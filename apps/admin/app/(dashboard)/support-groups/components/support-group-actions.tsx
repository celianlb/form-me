"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { MoreHorizontal, Eye, Edit, Trash2, FolderOpen } from "lucide-react";
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

interface SupportGroup {
  id: number;
  name: string;
  companyName: string;
}

interface SupportGroupActionsProps {
  group: SupportGroup;
}

export function SupportGroupActions({ group }: SupportGroupActionsProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/support-groups/${group.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Groupe supprime", {
          description: `"${group.name}" a ete supprime avec succes.`,
        });
        router.refresh();
      } else {
        const result = await response.json();
        toast.error("Erreur", { description: result.error || "Erreur lors de la suppression" });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur", { description: "Erreur lors de la suppression" });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/support-groups/${group.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Voir les details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/support-groups/${group.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/support-groups/${group.id}/supports`}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Gerer les supports
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le groupe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer le groupe &quot;{group.name}&quot; ? Cette
              action supprimera egalement tous les membres associes et est irreversible.
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
