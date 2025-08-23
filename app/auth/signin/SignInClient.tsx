"use client";

import Button from "@/components/UI/Button";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignInClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const message = searchParams.get("message");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
      } else {
        // Récupérer la session pour vérifier le rôle
        const session = await getSession();
        if (session?.user?.mustChangePassword) {
          router.push("/auth/change-password");
        } else if (session?.user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (session?.user?.role === "LEARNER") {
          router.push("/dashboard");
        } else {
          router.push(callbackUrl);
        }
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-satoshi font-bold text-darkBlue">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accédez à vos supports de formation
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message === "password-changed" && (
            <div className="rounded-xl bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <span className="text-green-400">✅</span>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Mot de passe modifié avec succès ! Reconnectez-vous avec
                    votre nouveau mot de passe.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <span className="text-red-400">❌</span>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                placeholder="Votre mot de passe"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connexion...</span>
                </div>
              ) : (
                "Se connecter"
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous n&apos;avez pas de compte ?{" "}
              <span className="text-primary">
                Vous recevrez une invitation par email après votre formation.
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
