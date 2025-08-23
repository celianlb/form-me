"use client";

import Button from "@/components/UI/Button";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Forcer la déconnexion immédiatement puis rediriger
        setTimeout(async () => {
          // Déconnexion complète
          await signOut({ redirect: false });
          // Redirection après déconnexion
          window.location.href = "/auth/signin?message=password-changed";
        }, 2000);
      } else {
        setError(
          result.error || "Erreur lors de la modification du mot de passe"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-satoshi font-bold text-darkBlue mb-2">
              Mot de passe modifié !
            </h2>
            <p className="text-gray-600 mb-4">
              Vous allez être redirigé vers la page de connexion pour vous
              reconnecter...
            </p>
            <Button
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.href = "/auth/signin?message=password-changed";
              }}
              variant="secondary"
            >
              Se reconnecter maintenant
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-satoshi font-bold text-darkBlue">
            Changement de mot de passe requis
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Pour des raisons de sécurité, vous devez modifier votre mot de passe
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                htmlFor="currentPassword"
                className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
              >
                Mot de passe actuel
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                placeholder="Votre mot de passe actuel"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
              >
                Nouveau mot de passe
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                placeholder="Nouveau mot de passe (8 caractères min.)"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
              >
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                placeholder="Confirmez le nouveau mot de passe"
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
                  <span>Modification...</span>
                </div>
              ) : (
                "Modifier le mot de passe"
              )}
            </Button>
          </div>

          <div className="text-center mt-4">
            <Button
              type="button"
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.href = "/auth/signin";
              }}
              variant="outline"
              className="text-sm"
            >
              Forcer la déconnexion
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              En cas de problème, utilisez ce bouton pour vous déconnecter
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
