import { prisma } from "@form-me/database";
import {
  FileQuestion,
  Inbox,
  Phone,
  FileCheck,
  CheckCircle,
  Archive,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteFilters } from "./components/quote-filters";
import { QuotesTable } from "./components/quotes-table";

interface SearchParams {
  search?: string;
  status?: string;
  trainingId?: string;
  page?: string;
  limit?: string;
}

async function getQuotes(searchParams: SearchParams) {
  const search = searchParams.search || "";
  const status = searchParams.status || "";
  const trainingId = searchParams.trainingId;
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "20");

  const where: any = {};

  if (status && status !== "all") {
    where.status = status;
  }

  if (trainingId && trainingId !== "all") {
    where.trainingId = parseInt(trainingId);
  }

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      include: {
        training: { select: { id: true, title: true, slug: true } },
        session: {
          select: { id: true, title: true, startDate: true, location: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.quote.count({ where }),
  ]);

  return {
    quotes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getStats() {
  const [
    totalQuotes,
    receivedCount,
    contactedCount,
    processedCount,
    convertedCount,
    archivedCount,
  ] = await Promise.all([
    prisma.quote.count(),
    prisma.quote.count({ where: { status: "received" } }),
    prisma.quote.count({ where: { status: "contacted" } }),
    prisma.quote.count({ where: { status: "processed" } }),
    prisma.quote.count({ where: { status: "converted" } }),
    prisma.quote.count({ where: { status: "archived" } }),
  ]);

  return {
    total: totalQuotes,
    received: receivedCount,
    contacted: contactedCount,
    processed: processedCount,
    converted: convertedCount,
    archived: archivedCount,
  };
}

async function getTrainings() {
  return prisma.training.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
    },
  });
}

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [quotesData, stats, trainings] = await Promise.all([
    getQuotes(params),
    getStats(),
    getTrainings(),
  ]);

  const statCards = [
    { label: "Total", value: stats.total, icon: FileQuestion, color: "bg-primary/10 text-primary" },
    { label: "Recus", value: stats.received, icon: Inbox, color: "bg-amber-100 text-amber-700" },
    { label: "Contactes", value: stats.contacted, icon: Phone, color: "bg-blue-100 text-blue-700" },
    { label: "Traites", value: stats.processed, icon: FileCheck, color: "bg-violet-100 text-violet-700" },
    { label: "Convertis", value: stats.converted, icon: CheckCircle, color: "bg-emerald-100 text-emerald-700" },
    { label: "Archives", value: stats.archived, icon: Archive, color: "bg-gray-100 text-gray-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileQuestion className="h-6 w-6 text-primary" />
          Devis
        </h1>
        <p className="text-muted-foreground">
          Gerez les demandes de devis et de contact.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 p-4 rounded-lg bg-card border">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
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
          <CardTitle>Liste des devis</CardTitle>
          <CardDescription>
            {quotesData.pagination.total} demande{quotesData.pagination.total > 1 ? "s" : ""} au total
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <QuoteFilters trainings={trainings} />
          <QuotesTable
            quotes={quotesData.quotes.map((quote) => ({
              ...quote,
              createdAt: quote.createdAt.toISOString(),
              session: quote.session
                ? {
                    ...quote.session,
                    startDate: quote.session.startDate.toISOString(),
                  }
                : null,
            }))}
            pagination={quotesData.pagination}
          />
        </CardContent>
      </Card>
    </div>
  );
}
