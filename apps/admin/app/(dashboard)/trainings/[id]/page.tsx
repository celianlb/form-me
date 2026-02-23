import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@form-me/database";
import {
  ChevronLeft,
  Pencil,
  Clock,
  Users,
  MessageSquare,
  Target,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TrainingActions } from "../components/training-actions";

async function getTraining(id: string) {
  const training = await prisma.training.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
      objectives: true,
      modules: { orderBy: { order: "asc" } },
      _count: { select: { supportGroups: true, quotes: true } },
    },
  });

  if (!training) return null;

  // Convert Decimal fields to plain numbers for Client Components
  return {
    ...training,
    successRate: training.successRate ? parseFloat(training.successRate.toString()) : null,
  };
}

const statusConfig = {
  DRAFT: { label: "Brouillon", variant: "secondary" as const },
  PUBLISHED: { label: "Publie", variant: "default" as const },
  ARCHIVED: { label: "Archive", variant: "outline" as const },
};

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const training = await getTraining(id);

  if (!training) {
    notFound();
  }

  const status = statusConfig[training.status];

  const formatDuration = (hours: number | null, days: number | null) => {
    const parts = [];
    if (days && days > 0) {
      parts.push(`${days} jour${days > 1 ? "s" : ""}`);
    }
    if (hours && hours > 0) {
      parts.push(`${hours} heures`);
    }
    return parts.length > 0 ? parts.join(" / ") : "Non defini";
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Non defini";
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/trainings">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            {training.imageUrl && (
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image
                  src={training.imageUrl}
                  alt={training.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{training.title}</h1>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <p className="text-muted-foreground">
                {training.category.name} - {training.slug}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/trainings/${training.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <TrainingActions training={training} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duree</p>
                <p className="font-semibold">
                  {formatDuration(training.durationHours, training.durationDays)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux de reussite</p>
                <p className="font-semibold">
                  {training.successRate ? `${training.successRate}%` : "Non defini"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Groupes</p>
                <p className="font-semibold">{training._count.supportGroups}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <MessageSquare className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Devis</p>
                <p className="font-semibold">{training._count.quotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="objectives">
            Objectifs ({training.objectives.length})
          </TabsTrigger>
          <TabsTrigger value="modules">Modules ({training.modules.length})</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Description */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {training.shortDescription && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Description courte
                    </h4>
                    <p>{training.shortDescription}</p>
                  </div>
                )}
                {training.longDescription && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Description detaillee
                    </h4>
                    <p className="whitespace-pre-wrap">{training.longDescription}</p>
                  </div>
                )}
                {!training.shortDescription && !training.longDescription && (
                  <p className="text-muted-foreground">Aucune description</p>
                )}
              </CardContent>
            </Card>

            {/* Public & Prerequisites */}
            <Card>
              <CardHeader>
                <CardTitle>Public et prerequis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Public cible
                  </h4>
                  <p className="whitespace-pre-wrap">
                    {training.targetAudience || "Non defini"}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Prerequis
                  </h4>
                  <p className="whitespace-pre-wrap">
                    {training.prerequisites || "Aucun prerequis"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pedagogical Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Methodes pedagogiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {training.technicalMeans && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Moyens techniques
                    </h4>
                    <p className="whitespace-pre-wrap">{training.technicalMeans}</p>
                  </div>
                )}
                {training.teachingMeans && (
                  <>
                    {training.technicalMeans && <Separator />}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Methodes pedagogiques
                      </h4>
                      <p className="whitespace-pre-wrap">{training.teachingMeans}</p>
                    </div>
                  </>
                )}
                {!training.technicalMeans && !training.teachingMeans && (
                  <p className="text-muted-foreground">Non defini</p>
                )}
              </CardContent>
            </Card>

            {/* Evaluation & Validation */}
            <Card>
              <CardHeader>
                <CardTitle>Evaluation et validation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {training.evaluationMethods && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Methodes d&apos;evaluation
                    </h4>
                    <p className="whitespace-pre-wrap">{training.evaluationMethods}</p>
                  </div>
                )}
                {training.validationMethod && (
                  <>
                    {training.evaluationMethods && <Separator />}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Modalites de validation
                      </h4>
                      <p className="whitespace-pre-wrap">{training.validationMethod}</p>
                    </div>
                  </>
                )}
                {training.monitoringMethods && (
                  <>
                    {(training.evaluationMethods || training.validationMethod) && (
                      <Separator />
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Modalites de suivi
                      </h4>
                      <p className="whitespace-pre-wrap">{training.monitoringMethods}</p>
                    </div>
                  </>
                )}
                {!training.evaluationMethods &&
                  !training.validationMethod &&
                  !training.monitoringMethods && (
                    <p className="text-muted-foreground">Non defini</p>
                  )}
              </CardContent>
            </Card>

            {/* Renewal */}
            <Card>
              <CardHeader>
                <CardTitle>Renouvellement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">
                  {training.renewalRecommendation || "Non defini"}
                </p>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informations supplementaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Date de creation
                    </h4>
                    <p>{formatDate(training.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Derniere modification
                    </h4>
                    <p>{formatDate(training.updatedAt)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Date de publication
                    </h4>
                    <p>{formatDate(training.publishedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Objectives Tab */}
        <TabsContent value="objectives">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objectifs pedagogiques
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/trainings/${training.id}/edit?tab=objectives`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {training.objectives.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Target className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    Aucun objectif pedagogique defini
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href={`/trainings/${training.id}/edit?tab=objectives`}>
                      Ajouter des objectifs
                    </Link>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {training.objectives.map((objective, index) => (
                    <li key={objective.id} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                        {index + 1}
                      </span>
                      <span>{objective.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Programme de formation
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/trainings/${training.id}/edit?tab=modules`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {training.modules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    Aucun module de formation defini
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href={`/trainings/${training.id}/edit?tab=modules`}>
                      Ajouter des modules
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {training.modules.map((module) => (
                    <div
                      key={module.id}
                      className="rounded-lg border bg-card p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                          {module.order}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{module.title}</h4>
                            {module.type && (
                              <Badge variant="outline" className="text-xs">
                                {module.type === "THEORETICAL" ? "Theorique" : "Pratique"}
                              </Badge>
                            )}
                          </div>
                          {module.content && (
                            <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                              {module.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
