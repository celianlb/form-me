import Button from "@/components/UI/Button";
import { Edit, Trash2 } from "lucide-react";
import { GroupDetail } from "./types";

interface GroupHeaderProps {
  group: GroupDetail;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function GroupHeader({
  group,
  onBack,
  onEdit,
  onDelete,
}: GroupHeaderProps) {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center py-6">
        <div>
          <h1 className="text-3xl font-satoshi font-bold text-darkBlue">
            {group.name}
          </h1>
          <p className="text-gray-600">
            {group.companyName} • {group.training.title}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={onBack} variant="outline">
            ← Retour
          </Button>
          <Button onClick={onEdit} variant="primary">
            <Edit className="w-4 h-4 mr-1" />
            Modifier
          </Button>
          <Button
            onClick={onDelete}
            variant="outline"
            className="text-red-600 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}
