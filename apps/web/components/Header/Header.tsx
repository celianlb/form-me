"use client";

import Button from "@/components/UI/Button";
import { CategoryWithCount } from "@/types/category";
import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import HeaderSearch from "./HeaderSearch";
import MobileMenu from "./MobileMenu";
import Navigation from "./Navigation";

interface HeaderProps {
  categories?: CategoryWithCount[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormationsOpen, setIsFormationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleUserClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleDashboardClick = () => {
    if (session?.user) {
      if (session.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (session.user.role === "LEARNER") {
        router.push("/dashboard");
      }
    }
    setIsUserMenuOpen(false);
  };

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    try {
      const result = await signOut({
        redirect: false,
      });

      if (result?.url) {
        window.location.href = result.url;
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      window.location.href = "/";
    }
  };

  // Fermer le menu utilisateur si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Gestion du scroll pour hide/show le header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Toujours visible si on est en haut de la page
      if (currentScrollY < 50) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Scroll vers le bas = masquer, scroll vers le haut = afficher
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
        setIsFormationsOpen(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed mx-4 lg:mx-[120px] mt-4 rounded-3xl px-5 py-3 lg:px-8 top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-lg shadow-black/5 transition-all duration-300 ${
        isFormationsOpen ? "pb-6" : ""
      } ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-[calc(100%+2rem)] opacity-0"}`}
    >
      <div className="relative flex flex-row items-center justify-between h-11">
        {/* Left: Navigation */}
        <div className="hidden lg:flex items-center">
          <Navigation
            isFormationsOpen={isFormationsOpen}
            setIsFormationsOpen={setIsFormationsOpen}
          />
        </div>

        {/* Center: Logo - positionné par rapport à cette div, pas le header entier */}
        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/logo/logoBlack.png"
            alt="Form Me Logo"
            width={120}
            height={48}
            className="h-8 w-auto hidden lg:block rounded-lg"
            priority
          />
          <Image
            src="/logo/logoBlack.png"
            alt="Form Me Logo"
            width={100}
            height={36}
            className="lg:hidden"
            priority
          />
        </Link>

        {/* Right: Search + Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          <HeaderSearch />
          {status === "loading" ? (
            <div className="w-10 h-10 bg-gray-200/50 rounded-full animate-pulse"></div>
          ) : session?.user ? (
            <div className="relative" ref={userMenuRef}>
              {/* Trigger Button */}
              <button
                onClick={handleUserClick}
                className={`flex cursor-pointer items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border transition-all duration-200 ${
                  isUserMenuOpen
                    ? "bg-white border-primary/20 shadow-sm"
                    : "bg-white/60 border-transparent hover:bg-white hover:border-gray-200/80"
                }`}
                title="Menu utilisateur"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-darkBlue font-medium font-satoshi max-w-[100px] truncate">
                  {session.user.name?.split(" ")[0] ||
                    session.user.email?.split("@")[0]}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-grayBlue/70 transition-transform duration-300 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 origin-top-right"
                  style={{
                    animation: "dropdownIn 0.15s ease-out forwards",
                  }}
                >
                  <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg shadow-gray-900/10 border border-gray-200/60 overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-3 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary via-primary to-blue-600 flex items-center justify-center shadow-inner">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-darkBlue font-satoshi truncate leading-tight">
                            {session.user.name || session.user.email}
                          </p>
                          <p className="text-[11px] text-grayBlue/70 font-satoshi mt-0.5">
                            {session.user.role === "ADMIN"
                              ? "Administrateur"
                              : "Apprenant"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-1.5">
                      <button
                        onClick={handleDashboardClick}
                        className="group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-darkBlue/90 hover:bg-gray-50 hover:text-darkBlue transition-all duration-150 font-satoshi"
                      >
                        <LayoutDashboard className="w-4 h-4 text-grayBlue/60 group-hover:text-primary transition-colors" />
                        <span className="font-medium flex-1 text-left">
                          {session.user.role === "ADMIN"
                            ? "Dashboard Admin"
                            : "Mes Formations"}
                        </span>
                        <span className="text-[10px] text-grayBlue/40 font-mono">
                          ⌘D
                        </span>
                      </button>
                    </div>

                    {/* Separator */}
                    <div className="mx-2 border-t border-gray-100" />

                    {/* Sign Out */}
                    <div className="p-1.5">
                      <button
                        onClick={handleSignOut}
                        className="group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-grayBlue hover:bg-red-50 hover:text-red-600 transition-all duration-150 font-satoshi"
                      >
                        <LogOut className="w-4 h-4 text-grayBlue/60 group-hover:text-red-500 transition-colors" />
                        <span className="font-medium flex-1 text-left">
                          Se déconnecter
                        </span>
                        <span className="text-[10px] text-grayBlue/40 font-mono">
                          ⇧⌘Q
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button href="/auth/signin" variant="secondary" showIcon={false}>
              Connexion
            </Button>
          )}
          <Link
            href={"https://wa.me/33766763911"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={"/whatsapp-blue.svg"}
              width={40}
              height={40}
              alt="whatsapp cta"
              className="cursor-pointer rounded-full hover:shadow-[0px_0px_10px_rgba(59,91,219,0.6)] transition-all duration-300"
            />
          </Link>
        </div>

        {/* Mobile Burger Menu */}
        <button
          onClick={toggleMenu}
          className="lg:hidden flex flex-col items-center justify-center w-6 h-6 space-y-1"
        >
          <span
            className={`w-6 h-0.5 bg-blackBlue transition-transform duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-blackBlue transition-opacity duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-blackBlue transition-transform duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Formations Dropdown intégré dans le header */}
      {isFormationsOpen && (
        <div className="hidden lg:block mt-4 pb-2">
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => {
              const isActive =
                pathname === `/formations/category/${category.slug}`;
              return (
                <Link
                  key={category.id}
                  href={`/formations/category/${category.slug}`}
                  className={`flex flex-col justify-between p-3 rounded-xl font-medium transition-colors font-satoshi text-[14px] min-h-[70px] ${
                    isActive
                      ? "bg-primary text-white border border-primary"
                      : "bg-gray-50 border border-gray-200 text-grayBlue hover:text-primary hover:border-primary/30"
                  }`}
                  onClick={() => setIsFormationsOpen(false)}
                >
                  <div className="flex-1">{category.name}</div>
                  <div
                    className={`text-xs mt-2 ${
                      isActive ? "text-white/70" : "text-grayBlue/70"
                    }`}
                  >
                    {category.trainingCount} formation
                    {category.trainingCount > 1 ? "s" : ""}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-4 pt-2 border-t border-gray-200 hover:translate-x-1 transition-all duration-300">
            <Link
              href="/formations"
              className="text-primary w-full font-satoshi font-medium text-sm"
              onClick={() => setIsFormationsOpen(false)}
            >
              Voir toutes les formations →
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        categories={categories}
      />
    </header>
  );
}
