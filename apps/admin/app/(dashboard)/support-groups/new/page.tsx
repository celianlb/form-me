import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@form-me/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportGroupForm } from "./components/support-group-form";

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

export default async function NewSupportGroupPage() {
  const trainings = await getTrainings();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/support-groups">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nouveau groupe de support</h1>
          <p className="text-muted-foreground">
            Creez un nouveau groupe pour une session de formation.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du groupe</CardTitle>
          <CardDescription>
            Renseignez les informations du groupe et les emails des participants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupportGroupForm trainings={trainings} />
        </CardContent>
      </Card>
    </div>
  );
}
