"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Edit2, Trash2, UserCheck, UserX } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "ADMIN" | "LEARNER" | "CLIENT";
  isActive: boolean;
  mustChangePassword: boolean;
}

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  });

  const handleToggleActive = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          updates: { isActive: !user.isActive },
        }),
      });

      if (response.ok) {
        toast.success(user.isActive ? "Utilisateur desactive" : "Utilisateur active", {
          description: `${user.email} a ete ${user.isActive ? "desactive" : "active"}.`,
        });
        router.refresh();
      } else {
        const result = await response.json();
        toast.error("Erreur", { description: result.error || "Erreur lors de la mise a jour" });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur", { description: "Erreur lors de la mise a jour" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users?userId=${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Utilisateur supprime", {
          description: `${user.email} a ete supprime avec succes.`,
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

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          updates: formData,
        }),
      });

      if (response.ok) {
        toast.success("Utilisateur mis a jour", {
          description: "Les modifications ont ete enregistrees.",
        });
        router.refresh();
        setShowEditDialog(false);
      } else {
        const result = await response.json();
        toast.error("Erreur", { description: result.error || "Erreur lors de la mise a jour" });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur", { description: "Erreur lors de la mise a jour" });
    } finally {
      setIsLoading(false);
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
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleActive} disabled={isLoading}>
            {user.isActive ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Desactiver
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Activer
              </>
            )}
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
            <DialogDescription>{user.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prenom</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Prenom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Nom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "ADMIN" | "LEARNER" | "CLIENT") =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEARNER">Apprenant</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                  <SelectItem value="CLIENT">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mustChangePassword"
                checked={formData.mustChangePassword}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, mustChangePassword: checked as boolean })
                }
              />
              <Label htmlFor="mustChangePassword" className="text-sm font-normal">
                Doit changer de mot de passe a la prochaine connexion
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleEdit} disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l&apos;utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer l&apos;utilisateur {user.email} ? Cette
              action est irreversible.
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
