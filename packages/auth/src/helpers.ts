import { getServerSession } from "next-auth";
import type { AuthOptions, Session } from "next-auth";

export async function requireAdmin(
  authOptions: AuthOptions
): Promise<Session["user"]> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Non authentifie");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Acces refuse: droits administrateur requis");
  }

  return session.user;
}

export async function requireAuth(
  authOptions: AuthOptions
): Promise<Session["user"]> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Non authentifie");
  }

  return session.user;
}

export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === "ADMIN";
}

export function isLearner(session: Session | null): boolean {
  return session?.user?.role === "LEARNER";
}
