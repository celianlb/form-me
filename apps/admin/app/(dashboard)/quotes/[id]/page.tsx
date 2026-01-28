import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@form-me/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Users,
  Clock,
  MessageSquare,
  ExternalLink,
  Laptop,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuoteStatusSelect } from "../components/quote-status-select";
import { QuoteStatusBadge, type QuoteStatus } from "../components/quote-status-badge";

async function getQuote(id: string) {
  const quote = await prisma.quote.findUnique({
    where: { id: parseInt(id) },
    include: {
      training: {
        select: {
          id: true,
          title: true,
          slug: true,
          durationHours: true,
          durationDays: true,
          category: { select: { name: true } },
        },
      },
      session: {
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          location: true,
          mode: true,
        },
      },
    },
  });

  return quote;
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await getQuote(id);

  if (!quote) {
    notFound();
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Non definie";
    return format(date, "d MMMM yyyy", { locale: fr });
  };

  const formatDateTime = (date: Date) => {
    return format(date, "d MMMM yyyy 'a' HH:mm", { locale: fr });
  };

  const formatDuration = (hours: number | null, days: number | null) => {
    const parts = [];
    if (days && days > 0) {
      parts.push(`${days} jour${days > 1 ? "s" : ""}`);
    }
    if (hours && hours > 0) {
      parts.push(`${hours} heures`);
    }
    return parts.length > 0 ? parts.join(" / ") : "Non definie";
  };

  const formatMode = (mode: string | null) => {
    if (!mode) return "Non defini";
    switch (mode) {
      case "PARTNER_CENTER":
        return "Centre partenaire";
      case "E_LEARNING":
        return "E-learning";
      default:
        return mode;
    }
  };

  const formatProfile = (profile: string) => {
    return profile === "INDIVIDUAL" ? "Particulier" : "Professionnel";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/quotes">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Demande de {quote.firstName} {quote.lastName || ""}
              </h1>
              <QuoteStatusBadge status={quote.status as QuoteStatus} />
            </div>
            <p className="text-muted-foreground">
              Recue le {formatDateTime(quote.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <QuoteStatusSelect
            quoteId={quote.id}
            currentStatus={quote.status as QuoteStatus}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations de contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium">
                    {quote.firstName} {quote.lastName || ""}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${quote.email}`}
                    className="font-medium hover:underline"
                  >
                    {quote.email}
                  </a>
                </div>
              </div>

              {quote.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telephone</p>
                    <a
                      href={`tel:${quote.phone}`}
                      className="font-medium hover:underline"
                    >
                      {quote.phone}
                    </a>
                  </div>
                </div>
              )}

              {(quote.address || quote.postalCode || quote.city) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">
                      {[quote.address, quote.postalCode, quote.city]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-start gap-3">
                <Building className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Profil</p>
                  <p className="font-medium">{formatProfile(quote.profile)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Formation demandee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quote.training ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Formation</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{quote.training.title}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                      <Link href={`/trainings/${quote.training.id}`}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {quote.training.category.name}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duree</p>
                    <p className="font-medium">
                      {formatDuration(
                        quote.training.durationHours,
                        quote.training.durationDays
                      )}
                    </p>
                  </div>
                </div>

                {quote.session && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Session selectionnee</p>
                      <p className="font-medium">{quote.session.title}</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {formatDate(quote.session.startDate)}
                          {quote.session.endDate &&
                            ` - ${formatDate(quote.session.endDate)}`}
                        </p>
                      </div>
                    </div>

                    {quote.session.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Lieu</p>
                          <p className="font-medium">{quote.session.location}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Laptop className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Modalite</p>
                        <p className="font-medium">{formatMode(quote.session.mode)}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune formation selectionnee</p>
            )}
          </CardContent>
        </Card>

        {/* Request Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Details de la demande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nombre d'apprenants</p>
                  <p className="text-xl font-bold">{quote.numberLearners}</p>
                </div>
              </div>

              {quote.mode && (
                <div className="flex items-start gap-3">
                  <Laptop className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mode souhaite</p>
                    <p className="font-medium">{formatMode(quote.mode)}</p>
                  </div>
                </div>
              )}

              {quote.preferredDates && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dates preferees</p>
                    <p className="font-medium">{quote.preferredDates}</p>
                  </div>
                </div>
              )}
            </div>

            {quote.message && (
              <>
                <Separator className="my-6" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Message</p>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="whitespace-pre-wrap">{quote.message}</p>
                  </div>
                </div>
              </>
            )}

            {quote.source && (
              <>
                <Separator className="my-6" />
                <div className="flex items-start gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <p className="font-medium">{quote.source}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild>
              <a href={`mailto:${quote.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Envoyer un email
              </a>
            </Button>
            {quote.phone && (
              <Button variant="outline" asChild>
                <a href={`tel:${quote.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Appeler
                </a>
              </Button>
            )}
            {quote.training && (
              <Button variant="outline" asChild>
                <Link href={`/trainings/${quote.training.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Voir la formation
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
