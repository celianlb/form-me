import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit, Users, Building2, Calendar, BookOpen, Mail, FolderOpen } from "lucide-react";
import { prisma } from "@form-me/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MembersTable } from "./components/members-table";

async function getSupportGroup(id: number) {
  const group = await prisma.supportGroup.findUnique({
    where: { id },
    include: {
      training: {
        select: {
          id: true,
          title: true,
          slug: true,
          supports: {
            where: { isActive: true },
            select: {
              id: true,
              title: true,
              description: true,
              type: true,
              fileUrl: true,
              fileSize: true,
            },
          },
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              lastLoginAt: true,
            },
          },
        },
      },
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return group;
}

export default async function SupportGroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const groupId = parseInt(id);

  if (isNaN(groupId)) {
    notFound();
  }

  const group = await getSupportGroup(groupId);

  if (!group) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const activeMembers = group.members.filter((m) => m.status === "ACTIVE").length;
  const invitedMembers = group.members.filter((m) => m.status === "INVITED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/support-groups">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{group.name}</h1>
            <p className="text-muted-foreground">{group.companyName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/support-groups/${group.id}/supports`}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Gerer les supports
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/support-groups/${group.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{group.members.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-2xl font-bold">{activeMembers}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Invites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-2xl font-bold">{invitedMembers}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Supports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{group.training.supports.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Group info */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>Details du groupe de support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Entreprise</p>
                <p className="font-medium">{group.companyName}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Formation</p>
                <p className="font-medium">{group.training.title}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date de formation</p>
                <p className="font-medium">{formatDate(group.trainingDate)}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Statut</p>
              <Badge variant={group.isActive ? "default" : "secondary"}>
                {group.isActive ? "Actif" : "Inactif"}
              </Badge>
            </div>
            {group.createdBy && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cree par</p>
                  <p className="text-sm">
                    {group.createdBy.firstName && group.createdBy.lastName
                      ? `${group.createdBy.firstName} ${group.createdBy.lastName}`
                      : group.createdBy.email}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Members list */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Participants</CardTitle>
                <CardDescription>
                  {group.members.length} participant{group.members.length > 1 ? "s" : ""} dans ce groupe
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/support-groups/${group.id}/edit`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Inviter
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MembersTable members={group.members} groupId={group.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
