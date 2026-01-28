"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ObjectivesEditor } from "./objectives-editor";
import { ModulesEditor } from "./modules-editor";

const trainingFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .regex(/^[a-z0-9-]+$/, "Le slug doit etre en minuscules avec des tirets"),
  categoryId: z.number({ error: "La categorie est requise" }),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  imageUrl: z.string().optional(),
  durationHours: z.number().optional().nullable(),
  durationDays: z.number().optional().nullable(),
  successRate: z.number().min(0).max(100).optional().nullable(),
  targetAudience: z.string().optional(),
  prerequisites: z.string().optional(),
  technicalMeans: z.string().optional(),
  teachingMeans: z.string().optional(),
  evaluationMethods: z.string().optional(),
  validationMethod: z.string().optional(),
  monitoringMethods: z.string().optional(),
  renewalRecommendation: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  objectives: z
    .array(
      z.object({
        id: z.number().optional(),
        text: z.string().min(1, "L'objectif ne peut pas etre vide"),
      })
    )
    .optional(),
  modules: z
    .array(
      z.object({
        id: z.number().optional(),
        title: z.string().min(1, "Le titre du module est requis"),
        order: z.number(),
        type: z.string().optional().nullable(),
        content: z.string().optional().nullable(),
      })
    )
    .optional(),
});

type TrainingFormValues = z.infer<typeof trainingFormSchema>;

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface TrainingFormProps {
  categories: Category[];
  initialData?: TrainingFormValues & { id?: number };
  mode: "create" | "edit";
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function TrainingForm({ categories, initialData, mode }: TrainingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      categoryId: initialData?.categoryId,
      shortDescription: initialData?.shortDescription || "",
      longDescription: initialData?.longDescription || "",
      imageUrl: initialData?.imageUrl || "",
      durationHours: initialData?.durationHours ?? null,
      durationDays: initialData?.durationDays ?? null,
      successRate: initialData?.successRate ?? null,
      targetAudience: initialData?.targetAudience || "",
      prerequisites: initialData?.prerequisites || "",
      technicalMeans: initialData?.technicalMeans || "",
      teachingMeans: initialData?.teachingMeans || "",
      evaluationMethods: initialData?.evaluationMethods || "",
      validationMethod: initialData?.validationMethod || "",
      monitoringMethods: initialData?.monitoringMethods || "",
      renewalRecommendation: initialData?.renewalRecommendation || "",
      status: initialData?.status || "DRAFT",
      objectives: initialData?.objectives || [],
      modules: initialData?.modules || [],
    },
  });

  const watchTitle = form.watch("title");

  const handleTitleChange = (value: string) => {
    form.setValue("title", value);
    if (mode === "create" || !initialData?.slug) {
      form.setValue("slug", slugify(value));
    }
  };

  const onSubmit = async (data: TrainingFormValues) => {
    setIsSubmitting(true);

    try {
      // Ensure modules have correct order
      if (data.modules) {
        data.modules = data.modules.map((mod, index) => ({
          ...mod,
          order: index + 1,
        }));
      }

      // Filter out empty objectives
      if (data.objectives) {
        data.objectives = data.objectives.filter((obj) => obj.text.trim() !== "");
      }

      const url =
        mode === "create" ? "/api/trainings" : `/api/trainings/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la sauvegarde");
      }

      const result = await response.json();

      // If editing, also update objectives and modules separately
      if (mode === "edit" && initialData?.id) {
        // Update objectives
        await fetch(`/api/trainings/${initialData.id}/objectives`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ objectives: data.objectives || [] }),
        });

        // Update modules
        await fetch(`/api/trainings/${initialData.id}/modules`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modules: data.modules || [] }),
        });
      }

      router.push(`/trainings/${result.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving training:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Informations</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="objectives">Objectifs</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Formation SST"
                          {...field}
                          onChange={(e) => handleTitleChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: formation-sst" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL-friendly identifier (auto-genere depuis le titre)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categorie *</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : undefined}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectionner une categorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DRAFT">Brouillon</SelectItem>
                          <SelectItem value="PUBLISHED">Publie</SelectItem>
                          <SelectItem value="ARCHIVED">Archive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description courte</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Resume de la formation en quelques lignes..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Affichee dans les listes et les cartes de formation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description detaillee</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description complete de la formation..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de l&apos;image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Image de couverture de la formation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Duree et resultats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="durationDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duree (jours)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Ex: 2"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseInt(e.target.value) : null
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="durationHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duree (heures)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Ex: 14"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseInt(e.target.value) : null
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="successRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taux de reussite (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={0.01}
                          placeholder="Ex: 95.5"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Public et prerequis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public cible</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A qui s'adresse cette formation..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prerequisites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prerequis</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Connaissances ou competences requises..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Methodes pedagogiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="technicalMeans"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moyens techniques</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Equipements, materiels utilises..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teachingMeans"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Methodes pedagogiques</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Approches et methodes utilisees..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="evaluationMethods"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Methodes d&apos;evaluation</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Comment les participants sont evalues..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validationMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modalites de validation</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Certificat, attestation, diplome..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monitoringMethods"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modalites de suivi</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Emargement, evaluations continues..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="renewalRecommendation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recommandation de renouvellement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Frequence recommandee de recyclage..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Objectives Tab */}
          <TabsContent value="objectives" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Objectifs pedagogiques</CardTitle>
              </CardHeader>
              <CardContent>
                <ObjectivesEditor control={form.control} name="objectives" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Programme de formation</CardTitle>
              </CardHeader>
              <CardContent>
                <ModulesEditor control={form.control} name="modules" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Creer la formation" : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
