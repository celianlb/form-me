import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@form-me/database";
import { Button } from "@/components/ui/button";
import { TrainingForm } from "../components/training-form";

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}

export default async function NewTrainingPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/trainings">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nouvelle formation</h1>
          <p className="text-muted-foreground">
            Creez une nouvelle formation professionnelle.
          </p>
        </div>
      </div>

      <TrainingForm categories={categories} mode="create" />
    </div>
  );
}
