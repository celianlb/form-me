/**
 * Formulaire dynamique pour Convention (Step 2)
 * Design modernisé avec la DA Form Me
 */
"use client";

import Button from "@/components/UI/Button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Textarea } from "@/components/UI/textarea";
import { DateInput } from "@/components/UI/DateInput";
import { useDocumentStore } from "@/lib/stores/useDocumentStore";
import {
  conventionInputSchema,
  type ConventionInputType,
} from "@/lib/validations/docs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMemo } from "react";

export function ConventionForm() {
  const { conventionData, setConventionData, goToNextStep } =
    useDocumentStore();

  // Dates minimales pour validation
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.toISOString().split('T')[0];
  }, []);

  const maxBirthDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 16); // Au moins 16 ans
    return date.toISOString().split('T')[0];
  }, []);

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
      <div className="space-y-4 bg-gradient-to-br from-platinium/10 to-white rounded-2xl p-6 border border-grayBlue/10">
        <h3 className="text-xl font-sora font-bold text-darkBlue mb-2">Société</h3>

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
      <div className="space-y-4 bg-gradient-to-br from-platinium/10 to-white rounded-2xl p-6 border border-grayBlue/10">
        <h3 className="text-xl font-sora font-bold text-darkBlue mb-2">Formation</h3>

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
      <div className="space-y-4 bg-gradient-to-br from-platinium/10 to-white rounded-2xl p-6 border border-grayBlue/10">
        <h3 className="text-xl font-sora font-bold text-darkBlue mb-2">Dates et Horaires</h3>
        <p className="text-sm text-grayBlue font-satoshi mb-4">
          Les dates de formation doivent être postérieures à aujourd&apos;hui
        </p>
        <div className="space-y-4">
          {datesFields.map((field, index) => (
            <div key={field.id} className="bg-white border-2 border-primary/10 rounded-xl p-5 relative hover:border-primary/30 transition-colors">
              {datesFields.length > 1 && (
                <Button
                  type="button"
                  variant="tertiary"
                  className="absolute top-3 right-3"
                  onClick={() => removeDate(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`datesEtHoraires.${index}.dateISO`} className="font-satoshi font-medium">
                    Date *
                  </Label>
                  <DateInput
                    {...register(`datesEtHoraires.${index}.dateISO` as const)}
                    type="datetime-local"
                    id={`datesEtHoraires.${index}.dateISO`}
                    min={today}
                    error={!!errors.datesEtHoraires?.[index]?.dateISO}
                  />
                  {errors.datesEtHoraires?.[index]?.dateISO && (
                    <p className="text-xs text-destructive mt-1 font-satoshi">
                      {errors.datesEtHoraires[index]?.dateISO?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`datesEtHoraires.${index}.debutISO`} className="font-satoshi font-medium">
                    Début *
                  </Label>
                  <DateInput
                    {...register(`datesEtHoraires.${index}.debutISO` as const)}
                    type="datetime-local"
                    id={`datesEtHoraires.${index}.debutISO`}
                    min={today}
                    error={!!errors.datesEtHoraires?.[index]?.debutISO}
                  />
                  {errors.datesEtHoraires?.[index]?.debutISO && (
                    <p className="text-xs text-destructive mt-1 font-satoshi">
                      {errors.datesEtHoraires[index]?.debutISO?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`datesEtHoraires.${index}.finISO`} className="font-satoshi font-medium">
                    Fin *
                  </Label>
                  <DateInput
                    {...register(`datesEtHoraires.${index}.finISO` as const)}
                    type="datetime-local"
                    id={`datesEtHoraires.${index}.finISO`}
                    min={today}
                    error={!!errors.datesEtHoraires?.[index]?.finISO}
                  />
                  {errors.datesEtHoraires?.[index]?.finISO && (
                    <p className="text-xs text-destructive mt-1 font-satoshi">
                      {errors.datesEtHoraires[index]?.finISO?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
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
        {errors.datesEtHoraires && typeof errors.datesEtHoraires === 'object' && !Array.isArray(errors.datesEtHoraires) && (
          <p className="text-sm text-destructive mt-1 font-satoshi">
            {errors.datesEtHoraires.message}
          </p>
        )}
      </div>

      {/* === EFFECTIF === */}
      <div className="space-y-4 bg-gradient-to-br from-platinium/10 to-white rounded-2xl p-6 border border-grayBlue/10">
        <h3 className="text-xl font-sora font-bold text-darkBlue mb-2">Effectif</h3>
        <p className="text-sm text-grayBlue font-satoshi mb-4">
          Les stagiaires doivent avoir au moins 16 ans
        </p>
        <div className="space-y-4">
          {effectifFields.map((field, index) => (
            <div key={field.id} className="bg-white border-2 border-primary/10 rounded-xl p-5 relative hover:border-primary/30 transition-colors">
              {effectifFields.length > 1 && (
                <Button
                  type="button"
                  variant="tertiary"
                  className="absolute top-3 right-3"
                  onClick={() => removeEffectif(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`effectif.${index}.prenom`} className="font-satoshi font-medium">Prénom *</Label>
                  <Input
                    {...register(`effectif.${index}.prenom` as const)}
                    id={`effectif.${index}.prenom`}
                  />
                  {errors.effectif?.[index]?.prenom && (
                    <p className="text-xs text-destructive mt-1 font-satoshi">
                      {errors.effectif[index]?.prenom?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`effectif.${index}.nom`} className="font-satoshi font-medium">Nom *</Label>
                  <Input
                    {...register(`effectif.${index}.nom` as const)}
                    id={`effectif.${index}.nom`}
                  />
                  {errors.effectif?.[index]?.nom && (
                    <p className="text-xs text-destructive mt-1 font-satoshi">
                      {errors.effectif[index]?.nom?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`effectif.${index}.dateNaissanceISO`} className="font-satoshi font-medium">
                    Date de naissance *
                  </Label>
                  <DateInput
                    {...register(`effectif.${index}.dateNaissanceISO` as const)}
                    type="date"
                    id={`effectif.${index}.dateNaissanceISO`}
                    max={maxBirthDate}
                    error={!!errors.effectif?.[index]?.dateNaissanceISO}
                  />
                  {errors.effectif?.[index]?.dateNaissanceISO && (
                    <p className="text-xs text-destructive mt-1 font-satoshi">
                      {errors.effectif[index]?.dateNaissanceISO?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
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
        {errors.effectif && typeof errors.effectif === 'object' && !Array.isArray(errors.effectif) && (
          <p className="text-sm text-destructive mt-1 font-satoshi">
            {errors.effectif.message}
          </p>
        )}
      </div>

      {/* === TARIF === */}
      <div className="space-y-4 bg-gradient-to-br from-platinium/10 to-white rounded-2xl p-6 border border-grayBlue/10">
        <h3 className="text-xl font-sora font-bold text-darkBlue mb-2">Tarification</h3>

        <div>
          <Label htmlFor="tarifJournalierEUR" className="font-satoshi font-medium">Tarif journalier (€ HT) *</Label>
          <Input
            {...register("tarifJournalierEUR", { valueAsNumber: true })}
            id="tarifJournalierEUR"
            type="number"
            step="0.01"
            min="0"
            className="mt-2"
          />
          {errors.tarifJournalierEUR && (
            <p className="text-sm text-destructive mt-1 font-satoshi">
              {errors.tarifJournalierEUR.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="min-w-[140px]">Suivant</Button>
      </div>
    </form>
  );
}
