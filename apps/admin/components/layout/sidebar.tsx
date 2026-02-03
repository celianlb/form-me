"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Calendar,
  FileQuestion,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  UserCircle,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    badge: null,
    description: "Vue d'ensemble",
  },
  {
    title: "Formations",
    href: "/trainings",
    icon: GraduationCap,
    badge: "NEW" as const,
    description: "Gerer les formations",
  },
  {
    title: "Sessions",
    href: "/sessions",
    icon: Calendar,
    badge: "NEW" as const,
    description: "Planifier les sessions",
  },
  {
    title: "Devis",
    href: "/quotes",
    icon: FileQuestion,
    badge: "NEW" as const,
    description: "Gerer les demandes",
  },
  {
    title: "Utilisateurs",
    href: "/users",
    icon: Users,
    badge: null,
    description: "Gerer les comptes",
  },
  {
    title: "Groupes de support",
    href: "/support-groups",
    icon: UserCircle,
    badge: null,
    description: "Supports de cours",
  },
  {
    title: "Documents PDF",
    href: "/docs",
    icon: FileText,
    badge: null,
    description: "Generer des documents",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col bg-sidebar">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src="/logo/logoBlack.png"
                alt="Form-Me"
                width={36}
                height={32}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base text-foreground">
                Form-Me
              </span>
              <span className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
                Administration
              </span>
            </div>
          </Link>
        </div>

        <Separator />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200",
                          !isActive && "group-hover:scale-110"
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "default"}
                          className={cn(
                            "ml-auto text-[10px] px-1.5 py-0 h-5",
                            isActive
                              ? "bg-white/20 text-white border-0"
                              : "bg-primary/10 text-primary border-0"
                          )}
                        >
                          <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.description}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="mt-auto">
          <Separator />
          <div className="p-3 space-y-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
                >
                  <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                  Parametres
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Configuration</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                  Deconnexion
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Se deconnecter</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
