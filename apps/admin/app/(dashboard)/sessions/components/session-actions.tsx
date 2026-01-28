"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  XCircle,
  Copy,
  CheckCircle,
  PlayCircle,
} from "lucide-react";
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

interface SessionActionsProps {
  session: {
    id: number;
    title: string;
    status: string;
    _count?: {
      quotes?: number;
      childSessions?: number;
    };
  };
}

export function SessionActions({ session }: SessionActionsProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasQuotes = (session._count?.quotes ?? 0) > 0;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/sessions/${session.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression");
      }

      toast.success(hasQuotes ? "Session annulee" : "Session supprimee", {
        description: `"${session.title}" a ete ${hasQuotes ? "annulee" : "supprimee"} avec succes.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Erreur", {
        description: error instanceof Error ? error.message : "Erreur lors de la suppression",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ONGOING": return "demarree";
      case "COMPLETED": return "terminee";
      case "CANCELLED": return "annulee";
      default: return "mise a jour";
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/sessions/${session.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la mise a jour");
      }

      toast.success("Statut mis a jour", {
        description: `La session a ete ${getStatusLabel(newStatus)}.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating session status:", error);
      toast.error("Erreur", {
        description: error instanceof Error ? error.message : "Erreur lors de la mise a jour",
      });
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await handleStatusChange("CANCELLED");
    } finally {
      setIsLoading(false);
      setShowCancelDialog(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const response = await fetch(`/api/sessions/${session.id}/duplicate`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la duplication");
      }

      const result = await response.json();
      toast.success("Session dupliquee", {
        description: "Vous pouvez maintenant modifier la nouvelle session.",
      });
      router.push(`/sessions/${result.id}/edit`);
    } catch (error) {
      console.error("Error duplicating session:", error);
      toast.error("Erreur", {
        description: error instanceof Error ? error.message : "Erreur lors de la duplication",
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
          <DropdownMenuItem onClick={() => router.push(`/sessions/${session.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            Voir
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/sessions/${session.id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Dupliquer
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {session.status === "SCHEDULED" && (
            <DropdownMenuItem onClick={() => handleStatusChange("ONGOING")}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Demarrer
            </DropdownMenuItem>
          )}

          {session.status === "ONGOING" && (
            <DropdownMenuItem onClick={() => handleStatusChange("COMPLETED")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Terminer
            </DropdownMenuItem>
          )}

          {session.status !== "CANCELLED" && session.status !== "COMPLETED" && (
            <DropdownMenuItem
              onClick={() => setShowCancelDialog(true)}
              className="text-orange-600 focus:text-orange-600"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Annuler
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

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la session</AlertDialogTitle>
            <AlertDialogDescription>
              {hasQuotes ? (
                <>
                  Cette session a des devis associes. Elle sera annulee au lieu
                  d&apos;etre supprimee.
                </>
              ) : (
                <>
                  Etes-vous sur de vouloir supprimer la session &quot;{session.title}&quot; ?
                  Cette action est irreversible.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Suppression..." : hasQuotes ? "Annuler la session" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la session</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir annuler la session &quot;{session.title}&quot; ?
              {hasQuotes && (
                <span className="block mt-2 text-orange-600">
                  Attention : {session._count?.quotes} devis sont associes a cette session.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Retour</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-orange-600 text-white hover:bg-orange-700"
            >
              {isLoading ? "Annulation..." : "Annuler la session"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
