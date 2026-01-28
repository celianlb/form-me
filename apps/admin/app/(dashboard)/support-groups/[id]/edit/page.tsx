import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@form-me/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EditSupportGroupForm } from "./components/edit-support-group-form";

async function getSupportGroup(id: number) {
  return prisma.supportGroup.findUnique({
    where: { id },
    include: {
      training: {
        select: { id: true, title: true },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
}

async function getTrainings() {
  return prisma.training.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
    },
    orderBy: { title: "asc" },
  });
}

export default async function EditSupportGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const groupId = parseInt(id);

  if (isNaN(groupId)) {
    notFound();
  }

  const [group, trainings] = await Promise.all([
    getSupportGroup(groupId),
    getTrainings(),
  ]);

  if (!group) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/support-groups/${group.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Modifier le groupe</h1>
          <p className="text-muted-foreground">{group.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du groupe</CardTitle>
          <CardDescription>
            Modifiez les informations du groupe de support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditSupportGroupForm group={group} trainings={trainings} />
        </CardContent>
      </Card>
    </div>
  );
}
