import { prisma } from "@form-me/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Calendar, FileQuestion, TrendingUp, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getStats() {
  const [
    usersCount,
    trainingsCount,
    sessionsCount,
    quotesCount,
    recentQuotes,
    upcomingSessions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.training.count({ where: { status: "PUBLISHED" } }),
    prisma.trainingSession.count({ where: { status: "SCHEDULED" } }),
    prisma.quote.count({ where: { status: "received" } }),
    prisma.quote.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        city: true,
        status: true,
        createdAt: true,
        training: { select: { title: true } },
      },
    }),
    prisma.trainingSession.findMany({
      where: { status: "SCHEDULED", startDate: { gte: new Date() } },
      take: 5,
      orderBy: { startDate: "asc" },
      select: {
        id: true,
        title: true,
        startDate: true,
        training: { select: { title: true } },
        _count: { select: { quotes: true } },
      },
    }),
  ]);

  return { usersCount, trainingsCount, sessionsCount, quotesCount, recentQuotes, upcomingSessions };
}

const statusColors: Record<string, string> = {
  received: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  processed: "bg-purple-100 text-purple-700",
  converted: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  received: "Recu",
  contacted: "Contacte",
  processed: "Traite",
  converted: "Converti",
  archived: "Archive",
};

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      title: "Utilisateurs",
      value: stats.usersCount,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      href: "/users",
      description: "Comptes actifs",
    },
    {
      title: "Formations",
      value: stats.trainingsCount,
      icon: GraduationCap,
      color: "from-emerald-500 to-emerald-600",
      href: "/trainings",
      description: "Publiees",
    },
    {
      title: "Sessions",
      value: stats.sessionsCount,
      icon: Calendar,
      color: "from-violet-500 to-violet-600",
      href: "/sessions",
      description: "Planifiees",
    },
    {
      title: "Devis",
      value: stats.quotesCount,
      icon: FileQuestion,
      color: "from-amber-500 to-amber-600",
      href: "/quotes",
      description: "En attente",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenue sur le backoffice Form-Me. Voici un apercu de votre activite.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href} className="group">
            <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`rounded-lg bg-linear-to-br ${card.color} p-2`}>
                  <card.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{card.value}</span>
                  <span className="text-xs text-muted-foreground">{card.description}</span>
                </div>
                <div className="mt-2 flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span>Voir les details</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two columns: Recent Quotes & Upcoming Sessions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Quotes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary" />
                Derniers devis
              </CardTitle>
              <CardDescription>Les demandes les plus recentes</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/quotes">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentQuotes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun devis pour le moment
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentQuotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/quotes/${quote.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {quote.firstName?.[0]}{quote.lastName?.[0]}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {quote.firstName} {quote.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {quote.city || quote.training?.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={statusColors[quote.status] || ""}>
                        {statusLabels[quote.status] || quote.status}
                      </Badge>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Prochaines sessions
              </CardTitle>
              <CardDescription>Sessions a venir</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/sessions">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.upcomingSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune session planifiee
              </p>
            ) : (
              <div className="space-y-4">
                {stats.upcomingSessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/sessions/${session.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4 text-violet-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{session.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.training?.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-right shrink-0">
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(session.startDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session._count.quotes} inscription{session._count.quotes > 1 ? "s" : ""}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Actions rapides
          </CardTitle>
          <CardDescription>Acces rapide aux fonctionnalites principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/trainings/new">
                <GraduationCap className="mr-2 h-4 w-4" />
                Nouvelle formation
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sessions/new">
                <Calendar className="mr-2 h-4 w-4" />
                Nouvelle session
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/support-groups/new">
                <Users className="mr-2 h-4 w-4" />
                Nouveau groupe
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs/new">
                <FileQuestion className="mr-2 h-4 w-4" />
                Generer un document
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
