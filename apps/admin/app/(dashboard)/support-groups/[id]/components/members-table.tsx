"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, MoreHorizontal, Trash2, RefreshCw } from "lucide-react";
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

interface Member {
  id: number;
  status: string;
  user: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    lastLoginAt: Date | null;
  };
}

interface MembersTableProps {
  members: Member[];
  groupId: number;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  ACTIVE: { label: "Actif", variant: "default" },
  INVITED: { label: "Invite", variant: "secondary" },
  REMOVED: { label: "Retire", variant: "outline" },
};

export function MembersTable({ members, groupId }: MembersTableProps) {
  const router = useRouter();
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/support-groups/${groupId}/members/${memberToRemove.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        const result = await response.json();
        alert(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
      setMemberToRemove(null);
    }
  };

  const handleResendInvitation = async (memberId: number) => {
    try {
      const response = await fetch("/api/send-invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          memberIds: [memberId],
        }),
      });

      if (response.ok) {
        alert("Invitation renvoyee avec succes");
      } else {
        alert("Erreur lors de l'envoi de l'invitation");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'envoi de l'invitation");
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Jamais connecte";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <UserIcon className="h-10 w-10 text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">
          Aucun participant dans ce groupe
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
              <TableHead>Participant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Derniere connexion</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const status = statusConfig[member.status] || statusConfig.REMOVED;
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {member.user.firstName && member.user.lastName
                            ? `${member.user.firstName} ${member.user.lastName}`
                            : member.user.email}
                        </p>
                        <p className="text-sm text-muted-foreground">{member.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(member.user.lastLoginAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {member.status === "INVITED" && (
                          <DropdownMenuItem onClick={() => handleResendInvitation(member.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Renvoyer l&apos;invitation
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => setMemberToRemove(member)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Retirer du groupe
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer le participant ?</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir retirer {memberToRemove?.user.email} de ce groupe ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Suppression..." : "Retirer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
