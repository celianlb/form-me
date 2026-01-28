import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { prisma } from "@form-me/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportsTable } from "./components/supports-table";
import { AddSupportDialog } from "./components/add-support-dialog";

async function getSupportGroup(id: number) {
  return prisma.supportGroup.findUnique({
    where: { id },
    include: {
      training: {
        select: {
          id: true,
          title: true,
          supports: {
            select: {
              id: true,
              title: true,
              description: true,
              type: true,
              fileUrl: true,
              fileSize: true,
              isActive: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });
}

export default async function SupportGroupSupportsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const groupId = parseInt(id);

  if (isNaN(groupId)) {
    notFound();
  }

  const group = await getSupportGroup(groupId);

  if (!group) {
    notFound();
  }

  // Convert BigInt to number for serialization
  const supports = group.training.supports.map((support) => ({
    ...support,
    fileSize: support.fileSize ? Number(support.fileSize) : null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/support-groups/${group.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestion des supports</h1>
            <p className="text-muted-foreground">
              {group.name} - {group.training.title}
            </p>
          </div>
        </div>
        <AddSupportDialog trainingId={group.training.id} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supports de formation</CardTitle>
          <CardDescription>
            {supports.length} support{supports.length > 1 ? "s" : ""} disponible{supports.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupportsTable supports={supports} trainingId={group.training.id} />
        </CardContent>
      </Card>
    </div>
  );
}
