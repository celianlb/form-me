import { withAuth } from "next-auth/middleware";
import { NextResponse, NextRequest } from "next/server";

// Check if maintenance mode is enabled
const isMaintenanceMode = () => process.env.MAINTENANCE_MODE === "true";

// Middleware for maintenance mode (runs before auth)
function maintenanceMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip maintenance check for:
  // - The maintenance page itself
  // - API routes
  // - Static files
  // - Next.js internals
  if (
    pathname === "/maintenance" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)$/i)
  ) {
    return null; // Continue to next middleware
  }

  // Redirect all other requests to maintenance page
  if (isMaintenanceMode()) {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  return null; // Continue to next middleware
}

const authMiddleware = withAuth(
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
          pathname === "/maintenance" ||
          pathname.startsWith("/formations") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/favicon.ico") ||
          pathname.startsWith("/auth/signin") ||
          pathname.startsWith("/auth/error") ||
          pathname.startsWith("/devis-&-contact") ||
          pathname.startsWith("/certifications-qualite") ||
          pathname.startsWith("/nous-rejoindre") ||
          pathname.startsWith("/a-propos") ||
          pathname.startsWith("/politiques-de-confidentialite") ||
          pathname.startsWith("/mentions-legales") ||
          pathname.startsWith("/devis-&-contact") ||
          // Fichiers statiques - images, CSS, JS
          pathname.match(
            /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)$/i
          ) ||
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

export default function middleware(req: NextRequest) {
  // Check maintenance mode first
  const maintenanceResponse = maintenanceMiddleware(req);
  if (maintenanceResponse) {
    return maintenanceResponse;
  }

  // Then run auth middleware
  return (authMiddleware as (req: NextRequest) => NextResponse | Promise<NextResponse>)(req);
}

export const config = {
  matcher: [
    // Appliquer le middleware seulement aux pages, pas aux fichiers statiques
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
