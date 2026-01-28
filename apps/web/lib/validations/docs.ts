/**
 * Schémas de validation Zod pour Convention et Émargement
 */
import { z } from 'zod';

/**
 * CONVENTION
 */
export const conventionInputSchema = z.object({
  societe: z.object({
    nom: z.string().min(1, 'Le nom de la société est requis'),
    siret: z.string().min(14, 'SIRET doit contenir 14 chiffres').max(14),
    adresse: z.string().min(1, 'L\'adresse est requise'),
    representantPrenom: z.string().min(1, 'Le prénom du représentant est requis'),
    representantNom: z.string().min(1, 'Le nom du représentant est requis'),
  }),
  formation: z.object({
    nom: z.string().min(1, 'Le nom de la formation est requis'),
    objectifsOperationnels: z.array(z.string().min(1)).min(1, 'Au moins un objectif est requis'),
    dureeHeures: z.number().positive('La durée doit être positive'),
    lieu: z.string().min(1, 'Le lieu est requis'),
  }),
  datesEtHoraires: z
    .array(
      z.object({
        dateISO: z.string().min(1, 'Date requise'),
        debutISO: z.string().min(1, 'Heure de début requise'),
        finISO: z.string().min(1, 'Heure de fin requise'),
      })
    )
    .min(1, 'Au moins une date est requise'),
  effectif: z
    .array(
      z.object({
        prenom: z.string().min(1, 'Prénom requis'),
        nom: z.string().min(1, 'Nom requis'),
        dateNaissanceISO: z.string().min(1, 'Date de naissance requise'),
      })
    )
    .min(1, 'Au moins un stagiaire est requis'),
  tarifJournalierEUR: z.number().positive('Le tarif doit être positif'),
});

export type ConventionInputType = z.infer<typeof conventionInputSchema>;

/**
 * ÉMARGEMENT
 */
export const emargementInputSchema = z.object({
  formationNom: z.string().min(1, 'Le nom de la formation est requis'),
  organismeNom: z.string().min(1, 'Le nom de l\'organisme est requis'),
  entrepriseNom: z.string().min(1, 'Le nom de l\'entreprise cliente est requis'),
  lieu: z.string().min(1, 'Le lieu est requis'),
  formateur: z.object({
    prenom: z.string().min(1, 'Prénom du formateur requis'),
    nom: z.string().min(1, 'Nom du formateur requis'),
  }),
  sessions: z
    .array(
      z.object({
        dateISO: z.string().min(1, 'Date requise'),
        journeeEntiere: z.boolean(),
        matin: z
          .object({
            debutISO: z.string().min(1),
            finISO: z.string().min(1),
          })
          .optional(),
        apresMidi: z
          .object({
            debutISO: z.string().min(1),
            finISO: z.string().min(1),
          })
          .optional(),
      })
    )
    .min(1, 'Au moins une session est requise')
    .refine(
      (sessions) =>
        sessions.every(
          (s) => s.journeeEntiere || s.matin || s.apresMidi
        ),
      {
        message: 'Chaque session doit avoir au moins un créneau (matin ou après-midi)',
      }
    ),
  stagiaires: z
    .array(
      z.object({
        prenom: z.string().min(1, 'Prénom requis'),
        nom: z.string().min(1, 'Nom requis'),
        dateNaissanceISO: z.string().min(1, 'Date de naissance requise'),
      })
    )
    .min(1, 'Au moins un stagiaire est requis'),
});

export type EmargementInputType = z.infer<typeof emargementInputSchema>;
