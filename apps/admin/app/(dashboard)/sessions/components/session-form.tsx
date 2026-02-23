"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const sessionFormSchema = z.object({
  trainingId: z.number({ error: "La formation est requise" }),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  startDate: z.date({ error: "La date de debut est requise" }),
  endDate: z.date().optional().nullable(),
  registrationDeadline: z.date().optional().nullable(),
  maxLearners: z.number().positive().optional().nullable(),
  mode: z.enum(["PARTNER_CENTER", "E_LEARNING", "INTRA_COMPANY"], {
    error: "Le mode est requis",
  }),
  location: z.string().optional(),
  recurrencePattern: z.enum(["NONE", "WEEKLY", "BIWEEKLY", "MONTHLY"]).optional(),
  recurrenceEndDate: z.date().optional().nullable(),
  status: z.enum(["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
});

type SessionFormValues = z.infer<typeof sessionFormSchema>;

interface Training {
  id: number;
  title: string;
  slug: string;
}

interface SessionFormProps {
  trainings: Training[];
  initialData?: SessionFormValues & { id?: number };
  mode: "create" | "edit";
}

export function SessionForm({ trainings, initialData, mode }: SessionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      trainingId: initialData?.trainingId,
      title: initialData?.title || "",
      description: initialData?.description || "",
      startDate: initialData?.startDate,
      endDate: initialData?.endDate ?? undefined,
      registrationDeadline: initialData?.registrationDeadline ?? undefined,
      maxLearners: initialData?.maxLearners ?? undefined,
      mode: initialData?.mode,
      location: initialData?.location || "",
      recurrencePattern: initialData?.recurrencePattern as any || "NONE",
      recurrenceEndDate: initialData?.recurrenceEndDate ?? undefined,
      status: initialData?.status || "SCHEDULED",
    },
  });

  const watchMode = form.watch("mode");
  const watchRecurrence = form.watch("recurrencePattern");

  const onSubmit = async (data: SessionFormValues) => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate?.toISOString() ?? null,
        registrationDeadline: data.registrationDeadline?.toISOString() ?? null,
        recurrenceEndDate: data.recurrenceEndDate?.toISOString() ?? null,
        recurrencePattern: data.recurrencePattern === "NONE" ? null : data.recurrencePattern,
      };

      const url = mode === "create" ? "/api/sessions" : `/api/sessions/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = Array.isArray(error.error)
          ? error.error.map((e: { message: string }) => e.message).join(", ")
          : error.error || "Erreur lors de la sauvegarde";
        throw new Error(errorMessage);
      }

      const result = await response.json();
      router.push(`/sessions/${result.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving session:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Training Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Formation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="trainingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formation *</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    disabled={mode === "edit"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner une formation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trainings.map((training) => (
                        <SelectItem key={training.id} value={String(training.id)}>
                          {training.title}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la session *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Session Janvier 2026" {...field} />
                  </FormControl>
                  <FormDescription>
                    Titre identifiant cette session specifique
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Details supplementaires sur cette session..."
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

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de debut *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de fin</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate = form.getValues("startDate");
                            return startDate ? date < startDate : false;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Optionnel pour les sessions d&apos;une journee</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="registrationDeadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date limite d&apos;inscription</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full md:w-[280px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const startDate = form.getValues("startDate");
                          return startDate ? date > startDate : false;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Derniere date pour s&apos;inscrire a cette session
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Modalites */}
        <Card>
          <CardHeader>
            <CardTitle>Modalites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner un mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PARTNER_CENTER">En centre</SelectItem>
                        <SelectItem value="E_LEARNING">E-learning</SelectItem>
                        <SelectItem value="INTRA_COMPANY">Intra entreprise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxLearners"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre maximum de participants</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Ex: 12"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseInt(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {(watchMode === "PARTNER_CENTER" || watchMode === "INTRA_COMPANY") && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Paris, Centre de formation XYZ" {...field} />
                    </FormControl>
                    <FormDescription>
                      Adresse ou nom du lieu de formation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {mode === "edit" && (
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
                        <SelectItem value="SCHEDULED">Planifiee</SelectItem>
                        <SelectItem value="ONGOING">En cours</SelectItem>
                        <SelectItem value="COMPLETED">Terminee</SelectItem>
                        <SelectItem value="CANCELLED">Annulee</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Recurrence - Only for create mode */}
        {mode === "create" && (
          <Card>
            <CardHeader>
              <CardTitle>Recurrence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="recurrencePattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurrence</FormLabel>
                    <Select value={field.value || "NONE"} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NONE">Aucune</SelectItem>
                        <SelectItem value="WEEKLY">Hebdomadaire</SelectItem>
                        <SelectItem value="BIWEEKLY">Bi-hebdomadaire</SelectItem>
                        <SelectItem value="MONTHLY">Mensuelle</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Creer automatiquement des sessions recurrentes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchRecurrence && watchRecurrence !== "NONE" && (
                <FormField
                  control={form.control}
                  name="recurrenceEndDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fin de la recurrence</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full md:w-[280px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Choisir une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ?? undefined}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const startDate = form.getValues("startDate");
                              return startDate ? date <= startDate : false;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Les sessions seront creees jusqu&apos;a cette date
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>
        )}

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
            {mode === "create" ? "Creer la session" : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
