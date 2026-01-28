"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronRight, Home, Bell, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

const pageNames: Record<string, string> = {
  "": "Dashboard",
  trainings: "Formations",
  sessions: "Sessions",
  quotes: "Devis",
  users: "Utilisateurs",
  "support-groups": "Groupes de support",
  docs: "Documents PDF",
  new: "Nouveau",
  edit: "Modifier",
  supports: "Supports",
  settings: "Parametres",
};

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Generate breadcrumb from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isId = /^\d+$/.test(segment);
    const name = isId ? `#${segment}` : pageNames[segment] || segment;
    return { name, href, isLast: index === pathSegments.length - 1 };
  });

  // Get initials from user name
  const getInitials = (name?: string | null) => {
    if (!name) return "AD";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Link
          href="/"
          className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Home className="h-4 w-4" />
        </Link>
        {breadcrumbs.map((crumb) => (
          <div key={crumb.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            {crumb.isLast ? (
              <span className="font-medium text-foreground px-2 py-1">{crumb.name}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-1 rounded-md transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </div>
        ))}
        {breadcrumbs.length === 0 && (
          <>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            <span className="font-medium text-foreground px-2 py-1">Dashboard</span>
          </>
        )}
      </nav>

      {/* Right side: Search, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Search (hidden on small screens) */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="w-64 pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 gap-2 pl-2 pr-3">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-primary-foreground text-xs font-semibold">
                  {getInitials(session?.user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium leading-none">{session?.user?.name || "Admin"}</span>
                <span className="text-[11px] text-muted-foreground leading-none mt-0.5">{session?.user?.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name || "Admin"}</p>
                <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Parametres</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-destructive focus:text-destructive"
            >
              Deconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
