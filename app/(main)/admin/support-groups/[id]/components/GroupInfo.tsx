import Button from "@/components/UI/Button";
import { ClipboardList, FolderOpen, Mail, Users, Zap } from "lucide-react";
import { GroupDetail } from "./types";

interface GroupInfoProps {
  group: GroupDetail;
  onResendInvitations: () => void;
  onManageSupports: () => void;
  onManageMembers: () => void;
}

export function GroupInfo({
  group,
  onResendInvitations,
  onManageSupports,
  onManageMembers,
}: GroupInfoProps) {
  return (
    <div className="space-y-6">
      {/* Informations du groupe */}
      <div className="bg-white rounded-2xl shadow-sm border border-primary/20 p-6">
        <h3 className="text-lg font-satoshi font-semibold text-darkBlue mb-4 flex items-center">
          <ClipboardList className="w-5 h-5 mr-2 text-primary" />
          Informations
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                group.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <div>
              <p className="text-sm font-medium text-darkBlue">Statut</p>
              <p className="text-xs text-gray-600">
                {group.isActive ? "Groupe actif" : "Groupe inactif"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-darkBlue">Formation</p>
              <p className="text-xs text-gray-600">{group.training.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-darkBlue">Date</p>
              <p className="text-xs text-gray-600">
                {new Date(group.trainingDate).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-darkBlue">Créé le</p>
              <p className="text-xs text-gray-600">
                {new Date(group.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-2xl shadow-sm border border-primary/20 p-6">
        <h3 className="text-lg font-satoshi font-semibold text-darkBlue mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-primary" />
          Actions Rapides
        </h3>
        <div className="space-y-3">
          <Button
            onClick={onResendInvitations}
            variant="outline"
            className="w-full justify-start"
          >
            <Mail className="w-4 h-4 mr-2" />
            Renvoyer les invitations
          </Button>
          <Button
            onClick={onManageSupports}
            variant="outline"
            className="w-full justify-start"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Gérer les supports
          </Button>
          <Button
            onClick={onManageMembers}
            variant="outline"
            className="w-full justify-start"
          >
            <Users className="w-4 h-4 mr-2" />
            Gérer les membres
          </Button>
        </div>
      </div>
    </div>
  );
}
