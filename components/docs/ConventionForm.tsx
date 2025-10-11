/**
 * Formulaire dynamique pour Convention (Step 2)
 */
"use client";

import Button from "@/components/UI/Button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Textarea } from "@/components/UI/textarea";
import { useDocumentStore } from "@/lib/stores/useDocumentStore";
import {
  conventionInputSchema,
  type ConventionInputType,
} from "@/lib/validations/docs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

export function ConventionForm() {
  const { conventionData, setConventionData, goToNextStep } =
    useDocumentStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ConventionInputType>({
    resolver: zodResolver(conventionInputSchema),
    defaultValues: conventionData || {
      societe: {
        nom: "",
        siret: "",
        adresse: "",
        representantPrenom: "",
        representantNom: "",
      },
      formation: {
        nom: "",
        objectifsOperationnels: [""],
        dureeHeures: 0,
        lieu: "",
      },
      datesEtHoraires: [
        {
          dateISO: "",
          debutISO: "",
          finISO: "",
        },
      ],
      effectif: [
        {
          prenom: "",
          nom: "",
          dateNaissanceISO: "",
        },
      ],
      tarifJournalierEUR: 0,
    },
  });

  const {
    fields: objectifsFields,
    append: appendObjectif,
    remove: removeObjectif,
  } = useFieldArray({
    control,
    name: "formation.objectifsOperationnels" as never,
  });

  const {
    fields: datesFields,
    append: appendDate,
    remove: removeDate,
  } = useFieldArray({
    control,
    name: "datesEtHoraires",
  });

  const {
    fields: effectifFields,
    append: appendEffectif,
    remove: removeEffectif,
  } = useFieldArray({
    control,
    name: "effectif",
  });

  const onSubmit = (data: ConventionInputType) => {
    setConventionData(data);
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* === SOCIÉTÉ === */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Société</h3>

        <div>
          <Label htmlFor="societe.nom">Nom de la société *</Label>
          <Input {...register("societe.nom")} id="societe.nom" />
          {errors.societe?.nom && (
            <p className="text-sm text-destructive mt-1">
              {errors.societe.nom.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="societe.siret">SIRET *</Label>
          <Input
            {...register("societe.siret")}
            id="societe.siret"
            maxLength={14}
          />
          {errors.societe?.siret && (
            <p className="text-sm text-destructive mt-1">
              {errors.societe.siret.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="societe.adresse">Adresse *</Label>
          <Textarea {...register("societe.adresse")} id="societe.adresse" />
          {errors.societe?.adresse && (
            <p className="text-sm text-destructive mt-1">
              {errors.societe.adresse.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="societe.representantPrenom">
              Prénom du représentant *
            </Label>
            <Input
              {...register("societe.representantPrenom")}
              id="societe.representantPrenom"
            />
            {errors.societe?.representantPrenom && (
              <p className="text-sm text-destructive mt-1">
                {errors.societe.representantPrenom.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="societe.representantNom">
              Nom du représentant *
            </Label>
            <Input
              {...register("societe.representantNom")}
              id="societe.representantNom"
            />
            {errors.societe?.representantNom && (
              <p className="text-sm text-destructive mt-1">
                {errors.societe.representantNom.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* === FORMATION === */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Formation</h3>

        <div>
          <Label htmlFor="formation.nom">Nom de la formation *</Label>
          <Input {...register("formation.nom")} id="formation.nom" />
          {errors.formation?.nom && (
            <p className="text-sm text-destructive mt-1">
              {errors.formation.nom.message}
            </p>
          )}
        </div>

        <div>
          <Label>Objectifs opérationnels *</Label>
          <div className="space-y-2">
            {objectifsFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(
                    `formation.objectifsOperationnels.${index}` as const
                  )}
                  placeholder={`Objectif ${index + 1}`}
                />
                {objectifsFields.length > 1 && (
                  <Button
                    type="button"
                    variant="tertiary"
                    onClick={() => removeObjectif(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendObjectif("")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un objectif
            </Button>
          </div>
          {errors.formation?.objectifsOperationnels && (
            <p className="text-sm text-destructive mt-1">
              {errors.formation.objectifsOperationnels.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="formation.dureeHeures">Durée (heures) *</Label>
            <Input
              {...register("formation.dureeHeures", { valueAsNumber: true })}
              id="formation.dureeHeures"
              type="number"
              step="0.5"
              min="0"
            />
            {errors.formation?.dureeHeures && (
              <p className="text-sm text-destructive mt-1">
                {errors.formation.dureeHeures.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="formation.lieu">Lieu *</Label>
            <Input {...register("formation.lieu")} id="formation.lieu" />
            {errors.formation?.lieu && (
              <p className="text-sm text-destructive mt-1">
                {errors.formation.lieu.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* === DATES ET HORAIRES === */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dates et Horaires</h3>
        <div className="space-y-4">
          {datesFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 relative">
              {datesFields.length > 1 && (
                <Button
                  type="button"
                  variant="tertiary"
                  className="absolute top-2 right-2"
                  onClick={() => removeDate(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`datesEtHoraires.${index}.dateISO`}>
                    Date *
                  </Label>
                  <Input
                    {...register(`datesEtHoraires.${index}.dateISO` as const)}
                    type="datetime-local"
                    id={`datesEtHoraires.${index}.dateISO`}
                  />
                </div>

                <div>
                  <Label htmlFor={`datesEtHoraires.${index}.debutISO`}>
                    Début *
                  </Label>
                  <Input
                    {...register(`datesEtHoraires.${index}.debutISO` as const)}
                    type="datetime-local"
                    id={`datesEtHoraires.${index}.debutISO`}
                  />
                </div>

                <div>
                  <Label htmlFor={`datesEtHoraires.${index}.finISO`}>
                    Fin *
                  </Label>
                  <Input
                    {...register(`datesEtHoraires.${index}.finISO` as const)}
                    type="datetime-local"
                    id={`datesEtHoraires.${index}.finISO`}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendDate({
                dateISO: "",
                debutISO: "",
                finISO: "",
              })
            }
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une date
          </Button>
        </div>
        {errors.datesEtHoraires && (
          <p className="text-sm text-destructive mt-1">
            {errors.datesEtHoraires.message}
          </p>
        )}
      </div>

      {/* === EFFECTIF === */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Effectif</h3>
        <div className="space-y-4">
          {effectifFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 relative">
              {effectifFields.length > 1 && (
                <Button
                  type="button"
                  variant="tertiary"
                  className="absolute top-2 right-2"
                  onClick={() => removeEffectif(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`effectif.${index}.prenom`}>Prénom *</Label>
                  <Input
                    {...register(`effectif.${index}.prenom` as const)}
                    id={`effectif.${index}.prenom`}
                  />
                </div>

                <div>
                  <Label htmlFor={`effectif.${index}.nom`}>Nom *</Label>
                  <Input
                    {...register(`effectif.${index}.nom` as const)}
                    id={`effectif.${index}.nom`}
                  />
                </div>

                <div>
                  <Label htmlFor={`effectif.${index}.dateNaissanceISO`}>
                    Date de naissance *
                  </Label>
                  <Input
                    {...register(`effectif.${index}.dateNaissanceISO` as const)}
                    type="date"
                    id={`effectif.${index}.dateNaissanceISO`}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendEffectif({
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
        {errors.effectif && (
          <p className="text-sm text-destructive mt-1">
            {errors.effectif.message}
          </p>
        )}
      </div>

      {/* === TARIF === */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tarification</h3>

        <div>
          <Label htmlFor="tarifJournalierEUR">Tarif journalier (€ HT) *</Label>
          <Input
            {...register("tarifJournalierEUR", { valueAsNumber: true })}
            id="tarifJournalierEUR"
            type="number"
            step="0.01"
            min="0"
          />
          {errors.tarifJournalierEUR && (
            <p className="text-sm text-destructive mt-1">
              {errors.tarifJournalierEUR.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Suivant</Button>
      </div>
    </form>
  );
}
