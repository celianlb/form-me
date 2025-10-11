import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GroupDetail } from "./types";

export function useGroupManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroupDetail = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/support-groups/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setGroup(data);
      } else {
        setError("Groupe non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du groupe:", error);
      setError("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchGroupDetail();
  }, [session, status, router, params.id, fetchGroupDetail]);

  const handleDeleteGroup = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/support-groups/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Groupe supprimé avec succès");
        router.push("/admin/support-groups");
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const resendInvitations = async () => {
    try {
      const pendingMembers =
        group?.members.filter((m) => m.status === "INVITED") || [];

      if (pendingMembers.length === 0) {
        alert("Aucune invitation en attente à renvoyer");
        return;
      }

      const response = await fetch("/api/admin/send-invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: group?.id,
          members: pendingMembers.map((m) => ({ userId: m.user.id })),
        }),
      });

      if (response.ok) {
        alert("Invitations renvoyées avec succès");
      } else {
        alert("Erreur lors de l'envoi des invitations");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'envoi des invitations");
    }
  };

  return {
    session,
    status,
    router,
    group,
    isLoading,
    error,
    handleDeleteGroup,
    resendInvitations,
  };
}
