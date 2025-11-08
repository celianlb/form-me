/**
 * Page: Liste des documents générés
 * /admin/docs
 */
"use client";

import Badge from "@/components/UI/Badge";
import Button from "@/components/UI/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { ClipboardList, Download, FileText, Loader2, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Document {
  id: string;
  kind: "CONVENTION" | "EMARGEMENT";
  pdfUrl: string;
  createdAt: string;
  batchId?: string;
  createdBy: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

export default function DocumentsListPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kindFilter, setKindFilter] = useState<string>("ALL");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
      toast.error("Accès refusé");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchDocuments();
    }
  }, [status, session]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/docs/list");
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Erreur lors du chargement des documents");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments =
    kindFilter === "ALL"
      ? documents
      : documents.filter((doc) => doc.kind === kindFilter);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-[200px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Documents générés</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos Conventions et Feuilles d&apos;Émargement
          </p>
        </div>

        <Button onClick={() => router.push("/admin/docs/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau document
        </Button>
      </div>

      <div className="mb-6">
        <Select value={kindFilter} onValueChange={setKindFilter}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les documents</SelectItem>
            <SelectItem value="CONVENTION">Conventions</SelectItem>
            <SelectItem value="EMARGEMENT">Émargements</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">Aucun document</p>
          <p className="text-muted-foreground mb-4">
            Commencez par générer votre premier document
          </p>
          <Button onClick={() => router.push("/admin/docs/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Générer un document
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Créé par</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <Badge className="flex items-center gap-2 w-fit">
                      {doc.kind === "CONVENTION" ? (
                        <FileText className="w-3 h-3" />
                      ) : (
                        <ClipboardList className="w-3 h-3" />
                      )}
                      {doc.kind}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{doc.id}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {doc.batchId || "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(doc.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    {doc.createdBy.firstName && doc.createdBy.lastName
                      ? `${doc.createdBy.firstName} ${doc.createdBy.lastName}`
                      : doc.createdBy.email}
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={doc.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
