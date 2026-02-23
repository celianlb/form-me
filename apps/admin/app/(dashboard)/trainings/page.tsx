import Link from "next/link";
import { Plus, GraduationCap, BookOpen, Target, Users2 } from "lucide-react";
import { prisma } from "@form-me/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingFilters } from "./components/training-filters";
import { TrainingsTable } from "./components/trainings-table";

interface SearchParams {
  search?: string;
  status?: string;
  categoryId?: string;
  page?: string;
  limit?: string;
}

async function getTrainings(searchParams: SearchParams) {
  const search = searchParams.search || "";
  const status = searchParams.status || "";
  const categoryId = searchParams.categoryId;
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "20");

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (categoryId && categoryId !== "all") {
    where.categoryId = parseInt(categoryId);
  }

  const [trainings, total, stats] = await Promise.all([
    prisma.training.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { modules: true, objectives: true, supportGroups: true, quotes: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.training.count({ where }),
    Promise.all([
      prisma.training.count(),
      prisma.training.count({ where: { status: "PUBLISHED" } }),
      prisma.training.count({ where: { status: "DRAFT" } }),
      prisma.training.count({ where: { status: "ARCHIVED" } }),
    ]),
  ]);

  // Convert Decimal fields to plain numbers for Client Components
  const serializedTrainings = trainings.map((t) => ({
    ...t,
    successRate: t.successRate ? parseFloat(t.successRate.toString()) : null,
  }));

  return {
    trainings: serializedTrainings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    stats: {
      total: stats[0],
      published: stats[1],
      draft: stats[2],
      archived: stats[3],
    },
  };
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

export default async function TrainingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [trainingsData, categories] = await Promise.all([
    getTrainings(params),
    getCategories(),
  ]);

  const statCards = [
    { label: "Total", value: trainingsData.stats.total, color: "bg-primary/10 text-primary" },
    { label: "Publiees", value: trainingsData.stats.published, color: "bg-emerald-100 text-emerald-700" },
    { label: "Brouillons", value: trainingsData.stats.draft, color: "bg-amber-100 text-amber-700" },
    { label: "Archivees", value: trainingsData.stats.archived, color: "bg-gray-100 text-gray-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Formations
          </h1>
          <p className="text-muted-foreground">
            Gerez votre catalogue de formations professionnelles.
          </p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link href="/trainings/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle formation
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 p-4 rounded-lg bg-card border">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Liste des formations</CardTitle>
          <CardDescription>
            {trainingsData.pagination.total} formation{trainingsData.pagination.total > 1 ? "s" : ""} au total
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TrainingFilters categories={categories} />
          <TrainingsTable
            trainings={trainingsData.trainings}
            pagination={trainingsData.pagination}
          />
        </CardContent>
      </Card>
    </div>
  );
}
