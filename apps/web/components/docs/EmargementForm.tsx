/**
 * Formulaire dynamique pour Émargement (Step 2)
 * Design modernisé avec la DA Form Me
 */
"use client";

import Button from "@/components/UI/Button";
import { Checkbox } from "@/components/UI/checkbox";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { DateInput } from "@/components/UI/DateInput";
import { TimeInput } from "@/components/UI/TimeInput";
import { useDocumentStore } from "@/lib/stores/useDocumentStore";
import {
  emargementInputSchema,
  type EmargementInputType,
} from "@/lib/validations/docs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMemo } from "react";

export function EmargementForm() {
  const { emargementData, setEmargementData, goToNextStep } =
    useDocumentStore();

  // Date minimale pour validation
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.toISOString().split('T')[0];
  }, []);

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
      entrepriseNom: "",
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
      stagiaires: [
        {
          prenom: "",
          nom: "",
          dateNaissanceISO: "",
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

  const {
    fields: stagiairesFields,
    append: appendStagiaire,
    remove: removeStagiaire,
  } = useFieldArray({
    control,
    name: "stagiaires",
  });

  const onSubmit = (data: EmargementInputType) => {
    setEmargementData(data);
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* === INFORMATIONS GÉNÉRALES === */}
      <div className="space-y-4 bg-gradient-to-br from-platinium/10 to-white rounded-2xl p-6 border border-grayBlue/10">
        <h3 className="text-xl font-sora font-bold text-darkBlue mb-2">Informations générales</h3>

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
          <Label htmlFor="organismeNom" className="font-satoshi font-medium">Nom de l&apos;organisme *</Label>
          <Input {...register("organismeNom")} id="organismeNom" />
          {errors.organismeNom && (
            <p className="text-sm text-destructive mt-1 font-satoshi">
              {errors.organismeNom.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="entrepriseNom" className="font-satoshi font-medium">Nom de l&apos;entreprise cliente *</Label>
          <Input {...register("entrepriseNom")} id="entrepriseNom" placeholder="Ex: ESSO FRANCE" />
          {errors.entrepriseNom && (
            <p className="text-sm text-destructive mt-1 font-satoshi">
              {errors.entrepriseNom.message}
            </p>
          )}
          <p className="text-xs text-grayBlue mt-1 font-satoshi">
            Ce nom apparaîtra en haut à droite du PDF
          </p>
        </div>

        <div>
          <Label htmlFor="lieu" className="font-satoshi font-medium">Lieu *</Label>
          <Input {...register("lieu")} id="lieu" />
          {errors.lieu && (
            <p className="text-sm text-destructive mt-1 font-satoshi">
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
      <div className="space-y-4 bg-gradient-to-br from-platinium/10 to-white rounded-2xl p-6 border border-grayBlue/10">
        <h3 className="text-xl font-sora font-bold text-darkBlue mb-2">Sessions</h3>
        <p className="text-sm text-grayBlue font-satoshi mb-4">
          Les sessions doivent être postérieures à aujourd&apos;hui
        </p>
        <div className="space-y-4">
          {sessionsFields.map((field, index) => {
            const journeeEntiere = watch(`sessions.${index}.journeeEntiere`);

            return (
              <div
                key={field.id}
                className="bg-white border-2 border-primary/10 rounded-xl p-5 relative space-y-4 hover:border-primary/30 transition-colors"
              >
                {sessionsFields.length > 1 && (
                  <Button
                    type="button"
                    variant="tertiary"
                    className="absolute top-3 right-3"
                    onClick={() => removeSession(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}

                <div>
                  <Label htmlFor={`sessions.${index}.dateISO`} className="font-satoshi font-medium">Date *</Label>
                  <DateInput
                    {...register(`sessions.${index}.dateISO` as const)}
                    type="date"
                    id={`sessions.${index}.dateISO`}
                    min={today}
                    error={!!errors.sessions?.[index]?.dateISO}
                  />
                  {errors.sessions?.[index]?.dateISO && (
                    <p className="text-xs text-destructive mt-1 font-satoshi">
                      {errors.sessions[index]?.dateISO?.message}
                    </p>
                  )}
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
                  <div className="space-y-3 bg-platinium/10 p-4 rounded-lg">
                    <Label className="font-sora font-bold text-darkBlue">Matin</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`sessions.${index}.matin.debutISO`} className="font-satoshi font-medium text-sm">
                          Début *
                        </Label>
                        <TimeInput
                          {...register(
                            `sessions.${index}.matin.debutISO` as const
                          )}
                          id={`sessions.${index}.matin.debutISO`}
                          error={!!errors.sessions?.[index]?.matin?.debutISO}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`sessions.${index}.matin.finISO`} className="font-satoshi font-medium text-sm">
                          Fin *
                        </Label>
                        <TimeInput
                          {...register(
                            `sessions.${index}.matin.finISO` as const
                          )}
                          id={`sessions.${index}.matin.finISO`}
                          error={!!errors.sessions?.[index]?.matin?.finISO}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {!journeeEntiere && !watch(`sessions.${index}.matin`) && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setValue(`sessions.${index}.matin` as const, {
                        debutISO: "",
                        finISO: "",
                      });
                    }}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter créneau Matin
                  </Button>
                )}

                {/* APRÈS-MIDI */}
                {(journeeEntiere || watch(`sessions.${index}.apresMidi`)) && (
                  <div className="space-y-3 bg-platinium/10 p-4 rounded-lg">
                    <Label className="font-sora font-bold text-darkBlue">Après-midi</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`sessions.${index}.apresMidi.debutISO`} className="font-satoshi font-medium text-sm">
                          Début *
                        </Label>
                        <TimeInput
                          {...register(
                            `sessions.${index}.apresMidi.debutISO` as const
                          )}
                          id={`sessions.${index}.apresMidi.debutISO`}
                          error={!!errors.sessions?.[index]?.apresMidi?.debutISO}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`sessions.${index}.apresMidi.finISO`} className="font-satoshi font-medium text-sm">
                          Fin *
                        </Label>
                        <TimeInput
                          {...register(
                            `sessions.${index}.apresMidi.finISO` as const
                          )}
                          id={`sessions.${index}.apresMidi.finISO`}
                          error={!!errors.sessions?.[index]?.apresMidi?.finISO}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {!journeeEntiere && !watch(`sessions.${index}.apresMidi`) && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setValue(`sessions.${index}.apresMidi` as const, {
                        debutISO: "",
                        finISO: "",
                      });
                    }}
                    className="w-full"
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
            variant="secondary"
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
        {errors.sessions && typeof errors.sessions === 'object' && !Array.isArray(errors.sessions) && (
          <p className="text-sm text-destructive mt-1 font-satoshi">
            {errors.sessions.message}
          </p>
        )}
      </div>

      {/* === STAGIAIRES === */}
      <div className="space-y-4 bg-gradient-to-br from-platinium/10 to-white rounded-2xl p-6 border border-grayBlue/10">
        <h3 className="text-xl font-sora font-bold text-darkBlue mb-2">Stagiaires</h3>
        <p className="text-sm text-grayBlue font-satoshi mb-4">
          Liste des stagiaires à afficher dans le tableau d&apos;émargement
        </p>
        <div className="space-y-4">
          {stagiairesFields.map((field, index) => (
            <div
              key={field.id}
              className="bg-white border-2 border-primary/10 rounded-xl p-5 relative space-y-4 hover:border-primary/30 transition-colors"
            >
              {stagiairesFields.length > 1 && (
                <Button
                  type="button"
                  variant="tertiary"
                  className="absolute top-3 right-3"
                  onClick={() => removeStagiaire(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`stagiaires.${index}.nom`} className="font-satoshi font-medium">Nom *</Label>
                  <Input
                    {...register(`stagiaires.${index}.nom` as const)}
                    id={`stagiaires.${index}.nom`}
                    placeholder="Ex: PICARD"
                  />
                  {errors.stagiaires?.[index]?.nom && (
                    <p className="text-xs text-destructive mt-1 font-satoshi">
                      {errors.stagiaires[index]?.nom?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`stagiaires.${index}.prenom`} className="font-satoshi font-medium">Prénom *</Label>
                  <Input
                    {...register(`stagiaires.${index}.prenom` as const)}
                    id={`stagiaires.${index}.prenom`}
                    placeholder="Ex: Olivier"
                  />
                  {errors.stagiaires?.[index]?.prenom && (
                    <p className="text-xs text-destructive mt-1 font-satoshi">
                      {errors.stagiaires[index]?.prenom?.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor={`stagiaires.${index}.dateNaissanceISO`} className="font-satoshi font-medium">Date de naissance *</Label>
                <DateInput
                  {...register(`stagiaires.${index}.dateNaissanceISO` as const)}
                  type="date"
                  id={`stagiaires.${index}.dateNaissanceISO`}
                  error={!!errors.stagiaires?.[index]?.dateNaissanceISO}
                />
                {errors.stagiaires?.[index]?.dateNaissanceISO && (
                  <p className="text-xs text-destructive mt-1 font-satoshi">
                    {errors.stagiaires[index]?.dateNaissanceISO?.message}
                  </p>
                )}
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              appendStagiaire({
                prenom: "",
                nom: "",
                dateNaissanceISO: "",
              })
            }
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un stagiaire
          </Button>
        </div>
        {errors.stagiaires && typeof errors.stagiaires === 'object' && !Array.isArray(errors.stagiaires) && (
          <p className="text-sm text-destructive mt-1 font-satoshi">
            {errors.stagiaires.message}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="min-w-[140px]">Suivant</Button>
      </div>
    </form>
  );
}
