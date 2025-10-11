import Button from "@/components/UI/Button";
import type { User, UserFormData } from "./types";

interface UserFormProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: number, updates: Partial<User>) => void;
}

export function UserForm({ user, isOpen, onClose, onSubmit }: UserFormProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      role: formData.get("role")?.toString(),
      mustChangePassword: formData.get("mustChangePassword") === "on",
    };

    onSubmit(user.id, updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-satoshi font-bold text-darkBlue">
            Modifier l&apos;utilisateur
          </h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-satoshi font-medium text-darkBlue mb-2">
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              defaultValue={user.firstName || ""}
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
              placeholder="Prénom"
            />
          </div>

          <div>
            <label className="block text-sm font-satoshi font-medium text-darkBlue mb-2">
              Nom
            </label>
            <input
              type="text"
              name="lastName"
              defaultValue={user.lastName || ""}
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
              placeholder="Nom"
            />
          </div>

          <div>
            <label className="block text-sm font-satoshi font-medium text-darkBlue mb-2">
              Rôle
            </label>
            <select
              name="role"
              defaultValue={user.role}
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
            >
              <option value="LEARNER">Apprenant</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="mustChangePassword"
              id="mustChangePassword"
              defaultChecked={user.mustChangePassword}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label
              htmlFor="mustChangePassword"
              className="text-sm font-satoshi text-darkBlue"
            >
              Doit changer de mot de passe à la prochaine connexion
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
