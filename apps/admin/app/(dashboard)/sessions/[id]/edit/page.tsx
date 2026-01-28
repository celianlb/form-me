import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@form-me/database";
import { Button } from "@/components/ui/button";
import { SessionForm } from "../../components/session-form";

async function getSession(id: string) {
  const session = await prisma.trainingSession.findUnique({
    where: { id: parseInt(id) },
    include: {
      training: { select: { id: true, title: true, slug: true } },
    },
  });

  return session;
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

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [session, trainings] = await Promise.all([
    getSession(id),
    getTrainings(),
  ]);

  if (!session) {
    notFound();
  }

  // Transform the data for the form
  const formData = {
    id: session.id,
    trainingId: session.trainingId,
    title: session.title,
    description: session.description || "",
    startDate: session.startDate,
    endDate: session.endDate,
    registrationDeadline: session.registrationDeadline,
    maxLearners: session.maxLearners,
    mode: session.mode,
    location: session.location || "",
    status: session.status,
    recurrencePattern: (session.recurrencePattern as "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "NONE" | undefined) || undefined,
    recurrenceEndDate: session.recurrenceEndDate,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/sessions/${session.id}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Modifier la session</h1>
          <p className="text-muted-foreground">{session.title}</p>
        </div>
      </div>

      <SessionForm trainings={trainings} initialData={formData} mode="edit" />
    </div>
  );
}
