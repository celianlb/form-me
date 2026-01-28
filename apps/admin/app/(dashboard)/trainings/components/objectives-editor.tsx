"use client";

import { useFieldArray, Control } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface ObjectivesEditorProps {
  control: Control<any>;
  name: string;
}

export function ObjectivesEditor({ control, name }: ObjectivesEditorProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name,
  });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (sourceIndex !== targetIndex) {
      move(sourceIndex, targetIndex);
    }
  };

  return (
    <div className="space-y-3">
      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Aucun objectif defini. Ajoutez des objectifs pedagogiques.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="flex items-center gap-2 rounded-lg border bg-card p-2"
            >
              <div className="cursor-grab text-muted-foreground hover:text-foreground">
                <GripVertical className="h-4 w-4" />
              </div>
              <FormField
                control={control}
                name={`${name}.${index}.text`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder={`Objectif ${index + 1}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ text: "" })}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un objectif
      </Button>
    </div>
  );
}
