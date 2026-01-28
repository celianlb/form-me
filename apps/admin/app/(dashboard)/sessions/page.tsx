import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@form-me/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionFilters } from "./components/session-filters";
import { SessionsTable } from "./components/sessions-table";

interface SearchParams {
  search?: string;
  trainingId?: string;
  status?: string;
  upcoming?: string;
  page?: string;
  limit?: string;
}

async function getSessions(searchParams: SearchParams) {
  const trainingId = searchParams.trainingId;
  const status = searchParams.status || "";
  const upcoming = searchParams.upcoming === "true";
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "20");

  const where: any = {};

  if (trainingId && trainingId !== "all") {
    where.trainingId = parseInt(trainingId);
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (upcoming) {
    where.startDate = { gte: new Date() };
    where.status = { not: "CANCELLED" };
  }

  const [sessions, total] = await Promise.all([
    prisma.trainingSession.findMany({
      where,
      include: {
        training: {
          select: { id: true, title: true, slug: true, category: { select: { name: true } } },
        },
        createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
        _count: { select: { quotes: true, childSessions: true } },
      },
      orderBy: { startDate: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.trainingSession.count({ where }),
  ]);

  return {
    sessions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

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

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [sessionsData, trainings] = await Promise.all([
    getSessions(params),
    getTrainings(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
          <p className="text-muted-foreground">
            Gerez les sessions de formation planifiees.
          </p>
        </div>
        <Button asChild>
          <Link href="/sessions/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle session
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SessionFilters trainings={trainings} />
          <SessionsTable
            sessions={sessionsData.sessions}
            pagination={sessionsData.pagination}
          />
        </CardContent>
      </Card>
    </div>
  );
}
