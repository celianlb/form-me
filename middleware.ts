import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Vérifier si l'utilisateur doit changer son mot de passe
    if (token?.mustChangePassword && pathname !== "/auth/change-password") {
      return NextResponse.redirect(new URL("/auth/change-password", req.url));
    }

    // Routes admin
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    // Routes utilisateur (dashboard)
    if (pathname.startsWith("/dashboard")) {
      if (!token || (token.role !== "LEARNER" && token.role !== "ADMIN")) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Pages publiques - toujours autorisées
        if (
          pathname === "/" ||
          pathname.startsWith("/formations") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/favicon.ico") ||
          pathname.startsWith("/auth/signin") ||
          pathname.startsWith("/auth/error") ||
          pathname.startsWith("/devis-&-contact") ||
          pathname.startsWith("/valeurs-&-engagements") ||
          pathname.startsWith("/a-propos") ||
          // Fichiers statiques - images, CSS, JS
          pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)$/i) ||
          // Dossiers publics
          pathname.startsWith("/images/") ||
          pathname.startsWith("/contact/") ||
          pathname.startsWith("/formation/") ||
          pathname.startsWith("/top10/") ||
          pathname.startsWith("/public/")
        ) {
          return true;
        }

        // Pages protégées - nécessitent une authentification
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Appliquer le middleware seulement aux pages, pas aux fichiers statiques
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};