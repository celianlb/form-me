import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@form-me/database";
import { Button } from "@/components/ui/button";
import { SessionForm } from "../components/session-form";

async function getTrainings() {
  return prisma.training.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
    },
  });
}

export default async function NewSessionPage() {
  const trainings = await getTrainings();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/sessions">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nouvelle session</h1>
          <p className="text-muted-foreground">
            Planifiez une nouvelle session de formation.
          </p>
        </div>
      </div>

      <SessionForm trainings={trainings} mode="create" />
    </div>
  );
}
