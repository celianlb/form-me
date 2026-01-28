import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@form-me/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentFilters } from "./components/document-filters";
import { DocumentsTable } from "./components/documents-table";

interface SearchParams {
  kind?: string;
  page?: string;
  limit?: string;
}

async function getDocuments(searchParams: SearchParams) {
  const kind = searchParams.kind || "";
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "20");

  const where: any = {};

  if (kind && kind !== "all") {
    where.kind = kind;
  }

  const [documents, total] = await Promise.all([
    prisma.generatedDocument.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.generatedDocument.count({ where }),
  ]);

  return {
    documents,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { documents, pagination } = await getDocuments(params);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents PDF</h1>
          <p className="text-muted-foreground">
            Gerez vos conventions et feuilles d&apos;emargement.
          </p>
        </div>
        <Button asChild>
          <Link href="/docs/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau document
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents generes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DocumentFilters />
          <DocumentsTable documents={documents} pagination={pagination} />
        </CardContent>
      </Card>
    </div>
  );
}
