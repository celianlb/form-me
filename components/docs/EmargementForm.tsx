/**
 * Formulaire dynamique pour Émargement (Step 2)
 */
"use client";

import Button from "@/components/UI/Button";
import { Checkbox } from "@/components/UI/checkbox";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { useDocumentStore } from "@/lib/stores/useDocumentStore";
import {
  emargementInputSchema,
  type EmargementInputType,
} from "@/lib/validations/docs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

export function EmargementForm() {
  const { emargementData, setEmargementData, goToNextStep } =
    useDocumentStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<EmargementInputType>({
    resolver: zodResolver(emargementInputSchema),
    defaultValues: emargementData || {
      formationNom: "",
      organismeNom: "",
      lieu: "",
      formateur: {
        prenom: "",
        nom: "",
      },
      sessions: [
        {
          dateISO: "",
          journeeEntiere: false,
          matin: undefined,
          apresMidi: undefined,
        },
      ],
    },
  });

  const {
    fields: sessionsFields,
    append: appendSession,
    remove: removeSession,
  } = useFieldArray({
    control,
    name: "sessions",
  });

  const onSubmit = (data: EmargementInputType) => {
    setEmargementData(data);
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* === INFORMATIONS GÉNÉRALES === */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informations générales</h3>

        <div>
          <Label htmlFor="formationNom">Nom de la formation *</Label>
          <Input {...register("formationNom")} id="formationNom" />
          {errors.formationNom && (
            <p className="text-sm text-destructive mt-1">
              {errors.formationNom.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="organismeNom">Nom de l&apos;organisme *</Label>
          <Input {...register("organismeNom")} id="organismeNom" />
          {errors.organismeNom && (
            <p className="text-sm text-destructive mt-1">
              {errors.organismeNom.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="lieu">Lieu *</Label>
          <Input {...register("lieu")} id="lieu" />
          {errors.lieu && (
            <p className="text-sm text-destructive mt-1">
              {errors.lieu.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="formateur.prenom">Prénom du formateur *</Label>
            <Input {...register("formateur.prenom")} id="formateur.prenom" />
            {errors.formateur?.prenom && (
              <p className="text-sm text-destructive mt-1">
                {errors.formateur.prenom.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="formateur.nom">Nom du formateur *</Label>
            <Input {...register("formateur.nom")} id="formateur.nom" />
            {errors.formateur?.nom && (
              <p className="text-sm text-destructive mt-1">
                {errors.formateur.nom.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* === SESSIONS === */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sessions</h3>
        <div className="space-y-4">
          {sessionsFields.map((field, index) => {
            const journeeEntiere = watch(`sessions.${index}.journeeEntiere`);

            return (
              <div
                key={field.id}
                className="border rounded-lg p-4 relative space-y-4"
              >
                {sessionsFields.length > 1 && (
                  <Button
                    type="button"
                    variant="tertiary"
                    className="absolute top-2 right-2"
                    onClick={() => removeSession(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}

                <div>
                  <Label htmlFor={`sessions.${index}.dateISO`}>Date *</Label>
                  <Input
                    {...register(`sessions.${index}.dateISO` as const)}
                    type="date"
                    id={`sessions.${index}.dateISO`}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`sessions.${index}.journeeEntiere`}
                    checked={journeeEntiere}
                    onCheckedChange={(checked) => {
                      setValue(
                        `sessions.${index}.journeeEntiere` as const,
                        !!checked
                      );
                      if (checked) {
                        // Si journée entière, on prépare matin et après-midi
                        setValue(`sessions.${index}.matin` as const, {
                          debutISO: "",
                          finISO: "",
                        });
                        setValue(`sessions.${index}.apresMidi` as const, {
                          debutISO: "",
                          finISO: "",
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`sessions.${index}.journeeEntiere`}>
                    Journée entière
                  </Label>
                </div>

                {/* MATIN */}
                {(journeeEntiere || watch(`sessions.${index}.matin`)) && (
                  <div className="space-y-2">
                    <Label className="font-semibold">Matin</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`sessions.${index}.matin.debutISO`}>
                          Début *
                        </Label>
                        <Input
                          {...register(
                            `sessions.${index}.matin.debutISO` as const
                          )}
                          type="time"
                          id={`sessions.${index}.matin.debutISO`}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`sessions.${index}.matin.finISO`}>
                          Fin *
                        </Label>
                        <Input
                          {...register(
                            `sessions.${index}.matin.finISO` as const
                          )}
                          type="time"
                          id={`sessions.${index}.matin.finISO`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {!journeeEntiere && !watch(`sessions.${index}.matin`) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setValue(`sessions.${index}.matin` as const, {
                        debutISO: "",
                        finISO: "",
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter créneau Matin
                  </Button>
                )}

                {/* APRÈS-MIDI */}
                {(journeeEntiere || watch(`sessions.${index}.apresMidi`)) && (
                  <div className="space-y-2">
                    <Label className="font-semibold">Après-midi</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`sessions.${index}.apresMidi.debutISO`}>
                          Début *
                        </Label>
                        <Input
                          {...register(
                            `sessions.${index}.apresMidi.debutISO` as const
                          )}
                          type="time"
                          id={`sessions.${index}.apresMidi.debutISO`}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`sessions.${index}.apresMidi.finISO`}>
                          Fin *
                        </Label>
                        <Input
                          {...register(
                            `sessions.${index}.apresMidi.finISO` as const
                          )}
                          type="time"
                          id={`sessions.${index}.apresMidi.finISO`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {!journeeEntiere && !watch(`sessions.${index}.apresMidi`) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setValue(`sessions.${index}.apresMidi` as const, {
                        debutISO: "",
                        finISO: "",
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter créneau Après-midi
                  </Button>
                )}
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendSession({
                dateISO: "",
                journeeEntiere: false,
                matin: undefined,
                apresMidi: undefined,
              })
            }
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une session
          </Button>
        </div>
        {errors.sessions && (
          <p className="text-sm text-destructive mt-1">
            {errors.sessions.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Suivant</Button>
      </div>
    </form>
  );
}
