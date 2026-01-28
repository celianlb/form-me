import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/auth/unauthorized");
  }

  if (session.user.mustChangePassword) {
    redirect("/auth/change-password");
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
