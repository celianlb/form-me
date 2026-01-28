import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Acces non autorise</h1>
        <p className="text-muted-foreground max-w-md">
          Vous n&apos;avez pas les droits necessaires pour acceder a cette application.
          Seuls les administrateurs peuvent se connecter ici.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Retour a la connexion
        </Link>
      </div>
    </div>
  );
}
