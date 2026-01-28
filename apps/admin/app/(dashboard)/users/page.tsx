import { prisma } from "@form-me/database";
import { Users, UserCheck, UserX, Shield, GraduationCap, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable } from "./components/users-table";
import { UserFilters } from "./components/user-filters";

interface SearchParams {
  search?: string;
  role?: string;
  page?: string;
  limit?: string;
}

async function getUsers(searchParams: SearchParams) {
  const search = searchParams.search || "";
  const role = searchParams.role || "";
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "20");

  const where: any = {};

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role && role !== "all") {
    where.role = role;
  }

  const [users, total, stats] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            supportGroupMemberships: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
    Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "LEARNER" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
    ]),
  ]);

  return {
    users,
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
      admins: stats[3],
      learners: stats[4],
      clients: stats[5],
    },
  };
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { users, pagination, stats } = await getUsers(params);

  const statCards = [
    { label: "Total", value: stats.total, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Actifs", value: stats.active, icon: UserCheck, color: "bg-emerald-100 text-emerald-700" },
    { label: "Inactifs", value: stats.inactive, icon: UserX, color: "bg-red-100 text-red-700" },
    { label: "Admins", value: stats.admins, icon: Shield, color: "bg-violet-100 text-violet-700" },
    { label: "Apprenants", value: stats.learners, icon: GraduationCap, color: "bg-blue-100 text-blue-700" },
    { label: "Clients", value: stats.clients, icon: Building2, color: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Utilisateurs
        </h1>
        <p className="text-muted-foreground">
          Gerez les utilisateurs et leurs roles.
        </p>
      </div>

      {/* Quick Stats */}
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
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {pagination.total} utilisateur{pagination.total > 1 ? "s" : ""} au total
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserFilters />
          <UsersTable users={users} pagination={pagination} />
        </CardContent>
      </Card>
    </div>
  );
}
