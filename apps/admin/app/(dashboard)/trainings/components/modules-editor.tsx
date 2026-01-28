"use client";

import { useFieldArray, Control } from "react-hook-form";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface ModulesEditorProps {
  control: Control<any>;
  name: string;
}

export function ModulesEditor({ control, name }: ModulesEditorProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name,
  });

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);
    }
  };

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

  const addModule = () => {
    const newId = `new-${Date.now()}`;
    append({
      title: "",
      order: fields.length + 1,
      type: "THEORETICAL",
      content: "",
    });
    setExpandedModules((prev) => ({
      ...prev,
      [newId]: true,
    }));
  };

  return (
    <div className="space-y-3">
      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Aucun module defini. Ajoutez des modules de formation.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => {
            const isExpanded = expandedModules[field.id] ?? false;
            return (
              <div
                key={field.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="rounded-lg border bg-card"
              >
                <Collapsible open={isExpanded} onOpenChange={() => toggleModule(field.id)}>
                  <div className="flex items-center gap-2 p-3">
                    <div className="cursor-grab text-muted-foreground hover:text-foreground">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                      {index + 1}
                    </span>
                    <FormField
                      control={control}
                      name={`${name}.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Titre du module"
                              className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="h-8 w-8"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === fields.length - 1}
                        className="h-8 w-8"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button type="button" variant="ghost" size="sm">
                          {isExpanded ? "Reduire" : "Details"}
                        </Button>
                      </CollapsibleTrigger>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="border-t p-4 pt-3 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name={`${name}.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select
                                value={field.value || "THEORETICAL"}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="THEORETICAL">Theorique</SelectItem>
                                  <SelectItem value="PRACTICAL">Pratique</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`${name}.${index}.order`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ordre</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={control}
                        name={`${name}.${index}.content`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contenu detaille</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Description detaillee du module, points abordes..."
                                className="min-h-[100px]"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          })}
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addModule}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un module
      </Button>
    </div>
  );
}
