/**
 * Composant générique pour listes répétables (dates, effectif, sessions)
 */
"use client";

import Button from "@/components/UI/Button";
import { Plus, Trash2 } from "lucide-react";

interface RepeatableListProps<T> {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addButtonLabel?: string;
  minItems?: number;
}

export function RepeatableList<T>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addButtonLabel = "Ajouter",
  minItems = 1,
}: RepeatableListProps<T>) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="relative border rounded-lg p-4">
          {items.length > minItems && (
            <Button
              type="button"
              variant="tertiary"
              className="absolute top-2 right-2"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          {renderItem(item, index)}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        {addButtonLabel}
      </Button>
    </div>
  );
}
