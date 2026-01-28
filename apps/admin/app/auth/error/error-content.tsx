"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Erreur de configuration",
    description: "Il y a un probleme de configuration du serveur. Contactez l'administrateur.",
  },
  AccessDenied: {
    title: "Acces refuse",
    description: "Vous n'avez pas les permissions necessaires pour acceder a cette ressource.",
  },
  Verification: {
    title: "Lien expire",
    description: "Le lien de verification a expire ou a deja ete utilise.",
  },
  Default: {
    title: "Erreur d'authentification",
    description: "Une erreur inattendue s'est produite lors de l'authentification.",
  },
  CredentialsSignin: {
    title: "Identifiants incorrects",
    description: "L'email ou le mot de passe que vous avez saisi est incorrect.",
  },
};

export function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";

  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-destructive/5 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-destructive/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-destructive/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative shadow-xl border-0">
        <CardHeader className="space-y-4 text-center pb-2">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
          </div>

          <div>
            <CardTitle className="text-2xl font-bold">{errorInfo.title}</CardTitle>
            <CardDescription className="mt-2">
              {errorInfo.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error === "Configuration" && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  Verifiez que <code className="font-mono bg-amber-100 px-1 rounded">NEXTAUTH_SECRET</code> est defini dans les variables d'environnement.
                </p>
              </div>
            </div>
          )}

          <Button asChild className="w-full">
            <Link href="/auth/signin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour a la connexion
            </Link>
          </Button>

          {/* Footer */}
          <div className="pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Si le probleme persiste, contactez le support technique.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
