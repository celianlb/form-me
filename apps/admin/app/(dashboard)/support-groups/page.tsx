import Link from "next/link";
import { Plus, UserCircle, Users, CheckCircle, XCircle, Building2 } from "lucide-react";
import { prisma } from "@form-me/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportGroupFilters } from "./components/support-group-filters";
import { SupportGroupsTable } from "./components/support-groups-table";

interface SearchParams {
  search?: string;
  status?: string;
  page?: string;
  limit?: string;
}

async function getSupportGroups(searchParams: SearchParams) {
  const search = searchParams.search || "";
  const status = searchParams.status || "";
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "20");

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { companyName: { contains: search, mode: "insensitive" } },
      { training: { title: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (status === "active") {
    where.isActive = true;
  } else if (status === "inactive") {
    where.isActive = false;
  }

  const [groups, total, stats] = await Promise.all([
    prisma.supportGroup.findMany({
      where,
      include: {
        training: {
          select: { id: true, title: true, slug: true },
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
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.supportGroup.count({ where }),
    Promise.all([
      prisma.supportGroup.count(),
      prisma.supportGroup.count({ where: { isActive: true } }),
      prisma.supportGroup.count({ where: { isActive: false } }),
      prisma.supportGroupMember.count(),
    ]),
  ]);

  return {
    groups,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    stats: {
      total: stats[0],
      active: stats[1],
      inactive: stats[2],
      totalMembers: stats[3],
    },
  };
}

export default async function SupportGroupsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { groups, pagination, stats } = await getSupportGroups(params);

  const statCards = [
    { label: "Total groupes", value: stats.total, icon: UserCircle, color: "bg-primary/10 text-primary" },
    { label: "Actifs", value: stats.active, icon: CheckCircle, color: "bg-emerald-100 text-emerald-700" },
    { label: "Inactifs", value: stats.inactive, icon: XCircle, color: "bg-red-100 text-red-700" },
    { label: "Participants", value: stats.totalMembers, icon: Users, color: "bg-blue-100 text-blue-700" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UserCircle className="h-6 w-6 text-primary" />
            Groupes de support
          </h1>
          <p className="text-muted-foreground">
            Gerez les groupes de formation et leurs participants.
          </p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link href="/support-groups/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau groupe
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <CardTitle>Liste des groupes</CardTitle>
          <CardDescription>
            {pagination.total} groupe{pagination.total > 1 ? "s" : ""} au total
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SupportGroupFilters />
          <SupportGroupsTable groups={groups} pagination={pagination} />
        </CardContent>
      </Card>
    </div>
  );
}
