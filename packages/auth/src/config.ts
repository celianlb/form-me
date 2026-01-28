import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@form-me/database";

export interface AuthConfigOptions {
  allowedRoles: ("ADMIN" | "LEARNER" | "CLIENT")[];
  signInPage?: string;
  errorPage?: string;
}

export function createAuthOptions(options: AuthConfigOptions): AuthOptions {
  const {
    allowedRoles,
    signInPage = "/auth/signin",
    errorPage = "/auth/error",
  } = options;

  return {
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          // Check if role is allowed for this app
          if (!allowedRoles.includes(user.role as "ADMIN" | "LEARNER" | "CLIENT")) {
            throw new Error("Acces non autorise sur cette application");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isPasswordValid) {
            return null;
          }

          if (!user.isActive) {
            throw new Error("Compte desactive. Contactez l'administrateur.");
          }

          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: user.id.toString(),
            email: user.email,
            name:
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email,
            role: user.role as "ADMIN" | "LEARNER" | "CLIENT",
            mustChangePassword: user.mustChangePassword,
          };
        },
      }),
    ],
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.role = user.role;
          token.mustChangePassword = user.mustChangePassword;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user.id = token.sub!;
          session.user.role = token.role as "CLIENT" | "ADMIN" | "LEARNER";
          session.user.mustChangePassword = token.mustChangePassword as boolean;
        }
        return session;
      },
    },
    pages: {
      signIn: signInPage,
      error: errorPage,
    },
  };
}
