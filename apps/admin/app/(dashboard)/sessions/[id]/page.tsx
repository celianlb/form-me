import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@form-me/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ChevronLeft,
  Pencil,
  Calendar,
  Users,
  MapPin,
  Monitor,
  Building,
  MessageSquare,
  RefreshCw,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionActions } from "../components/session-actions";

async function getSession(id: string) {
  const session = await prisma.trainingSession.findUnique({
    where: { id: parseInt(id) },
    include: {
      training: {
        select: { id: true, title: true, slug: true, category: { select: { name: true } } },
      },
      createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
      quotes: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          profile: true,
          numberLearners: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      childSessions: {
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          status: true,
          registeredCount: true,
          maxLearners: true,
          _count: { select: { quotes: true } },
        },
        orderBy: { startDate: "asc" },
      },
      parentSession: {
        select: { id: true, title: true, startDate: true },
      },
    },
  });

  return session;
}

const statusConfig = {
  SCHEDULED: { label: "Planifiee", variant: "secondary" as const },
  ONGOING: { label: "En cours", variant: "default" as const },
  COMPLETED: { label: "Terminee", variant: "outline" as const },
  CANCELLED: { label: "Annulee", variant: "destructive" as const },
};

const modeConfig = {
  PARTNER_CENTER: { label: "En centre", icon: Building },
  E_LEARNING: { label: "E-learning", icon: Monitor },
};

const quoteStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  received: { label: "Recu", variant: "secondary" },
  processed: { label: "Traite", variant: "default" },
  archived: { label: "Archive", variant: "outline" },
};

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession(id);

  if (!session) {
    notFound();
  }

  const status = statusConfig[session.status];
  const mode = modeConfig[session.mode];
  const ModeIcon = mode.icon;

  const formatDate = (date: Date | null) => {
    if (!date) return "Non defini";
    return format(date, "EEEE d MMMM yyyy", { locale: fr });
  };

  const formatDateTime = (date: Date) => {
    return format(date, "d MMM yyyy a HH:mm", { locale: fr });
  };

  const formatShortDate = (date: Date) => {
    return format(date, "d MMM yyyy", { locale: fr });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/sessions">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{session.title}</h1>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="text-muted-foreground">
              <Link href={`/trainings/${session.training.id}`} className="hover:underline">
                {session.training.title}
              </Link>
              {" - "}
              {session.training.category.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/sessions/${session.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <SessionActions session={session} />
        </div>
      </div>

      {/* Parent Session Link */}
      {session.parentSession && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Session recurrente de{" "}
            <Link
              href={`/sessions/${session.parentSession.id}`}
              className="font-medium hover:underline"
            >
              {session.parentSession.title}
            </Link>
          </span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">{formatShortDate(session.startDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <ModeIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mode</p>
                <p className="font-semibold">{mode.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacite</p>
                <p className="font-semibold">
                  {session.registeredCount}
                  {session.maxLearners && ` / ${session.maxLearners}`}
                </p>
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
                <p className="font-semibold">{session.quotes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="quotes">Devis ({session.quotes.length})</TabsTrigger>
          {session.childSessions.length > 0 && (
            <TabsTrigger value="recurring">
              Sessions recurrentes ({session.childSessions.length})
            </TabsTrigger>
          )}
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Session Details */}
            <Card>
              <CardHeader>
                <CardTitle>Details de la session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Date de debut</h4>
                    <p>{formatDate(session.startDate)}</p>
                  </div>
                </div>

                {session.endDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Date de fin</h4>
                      <p>{formatDate(session.endDate)}</p>
                    </div>
                  </div>
                )}

                {session.registrationDeadline && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Date limite d&apos;inscription
                      </h4>
                      <p>{formatDate(session.registrationDeadline)}</p>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-start gap-3">
                  <ModeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Mode</h4>
                    <p>{mode.label}</p>
                  </div>
                </div>

                {session.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Lieu</h4>
                      <p>{session.location}</p>
                    </div>
                  </div>
                )}

                {session.maxLearners && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Capacite</h4>
                      <p>
                        {session.registeredCount} / {session.maxLearners} participants
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description & Meta */}
            <Card>
              <CardHeader>
                <CardTitle>Informations supplementaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session.description ? (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                    <p className="whitespace-pre-wrap">{session.description}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucune description</p>
                )}

                <Separator />

                {session.recurrencePattern && (
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Recurrence</h4>
                      <p>
                        {session.recurrencePattern === "WEEKLY" && "Hebdomadaire"}
                        {session.recurrencePattern === "BIWEEKLY" && "Bi-hebdomadaire"}
                        {session.recurrencePattern === "MONTHLY" && "Mensuelle"}
                      </p>
                      {session.recurrenceEndDate && (
                        <p className="text-sm text-muted-foreground">
                          Jusqu&apos;au {formatShortDate(session.recurrenceEndDate)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Creee par</h4>
                    <p>
                      {session.createdBy.firstName} {session.createdBy.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{session.createdBy.email}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Date de creation
                  </h4>
                  <p>{formatDateTime(session.createdAt)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quotes Tab */}
        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Demandes de devis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {session.quotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    Aucun devis pour cette session
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contact</TableHead>
                        <TableHead>Profil</TableHead>
                        <TableHead className="text-center">Participants</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {session.quotes.map((quote) => {
                        const quoteStatus = quoteStatusConfig[quote.status] || quoteStatusConfig.received;
                        return (
                          <TableRow key={quote.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {quote.firstName} {quote.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">{quote.email}</p>
                                {quote.phone && (
                                  <p className="text-sm text-muted-foreground">{quote.phone}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {quote.profile === "INDIVIDUAL" ? "Particulier" : "Professionnel"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {quote.numberLearners}
                            </TableCell>
                            <TableCell>
                              <Badge variant={quoteStatus.variant}>{quoteStatus.label}</Badge>
                            </TableCell>
                            <TableCell>
                              {formatShortDate(quote.createdAt)}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/quotes/${quote.id}`}>Voir</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recurring Sessions Tab */}
        {session.childSessions.length > 0 && (
          <TabsContent value="recurring">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Sessions recurrentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Participants</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-center">Devis</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {session.childSessions.map((childSession) => {
                        const childStatus = statusConfig[childSession.status];
                        return (
                          <TableRow key={childSession.id}>
                            <TableCell>
                              <Link
                                href={`/sessions/${childSession.id}`}
                                className="font-medium hover:underline"
                              >
                                {childSession.title}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatShortDate(childSession.startDate)}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {childSession.registeredCount}
                                {childSession.maxLearners && `/${childSession.maxLearners}`}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={childStatus.variant}>{childStatus.label}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                {childSession._count.quotes}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/sessions/${childSession.id}`}>Voir</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
