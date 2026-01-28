import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@form-me/database";
import { Button } from "@/components/ui/button";
import { TrainingForm } from "../../components/training-form";

async function getTraining(id: string) {
  const training = await prisma.training.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
      objectives: true,
      modules: { orderBy: { order: "asc" } },
    },
  });

  return training;
}

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

export default async function EditTrainingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [training, categories] = await Promise.all([
    getTraining(id),
    getCategories(),
  ]);

  if (!training) {
    notFound();
  }

  // Transform the data for the form
  const formData = {
    id: training.id,
    title: training.title,
    slug: training.slug,
    categoryId: training.categoryId,
    shortDescription: training.shortDescription || "",
    longDescription: training.longDescription || "",
    imageUrl: training.imageUrl || "",
    durationHours: training.durationHours,
    durationDays: training.durationDays,
    successRate: training.successRate ? parseFloat(training.successRate.toString()) : null,
    targetAudience: training.targetAudience || "",
    prerequisites: training.prerequisites || "",
    technicalMeans: training.technicalMeans || "",
    teachingMeans: training.teachingMeans || "",
    evaluationMethods: training.evaluationMethods || "",
    validationMethod: training.validationMethod || "",
    monitoringMethods: training.monitoringMethods || "",
    renewalRecommendation: training.renewalRecommendation || "",
    status: training.status,
    objectives: training.objectives.map((obj) => ({
      id: obj.id,
      text: obj.text,
    })),
    modules: training.modules.map((mod) => ({
      id: mod.id,
      title: mod.title,
      order: mod.order,
      type: mod.type,
      content: mod.content,
    })),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/trainings/${training.id}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Modifier la formation</h1>
          <p className="text-muted-foreground">{training.title}</p>
        </div>
      </div>

      <TrainingForm categories={categories} initialData={formData} mode="edit" />
    </div>
  );
}
