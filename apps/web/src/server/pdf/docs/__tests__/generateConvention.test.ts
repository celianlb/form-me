/**
 * Tests unitaires pour generateConvention
 * Usage: npm run test src/server/pdf/docs/__tests__/generateConvention.test.ts
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ConventionInput } from '../types';

// Mock des dépendances
vi.mock('@/lib/prisma', () => ({
  prisma: {
    generatedDocument: {
      create: vi.fn().mockResolvedValue({
        id: 'test-doc-id',
        pdfUrl: 'https://cloudinary.com/test.pdf',
      }),
    },
  },
}));

vi.mock('../cloudinary', () => ({
  getTemplateUrl: vi.fn().mockResolvedValue('https://cloudinary.com/template.pdf'),
  uploadBuffer: vi.fn().mockResolvedValue({
    secure_url: 'https://cloudinary.com/generated.pdf',
    public_id: 'generated-pdf-id',
  }),
}));

// Mock fetch pour charger le template
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(1024)),
});

describe('generateConvention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput: ConventionInput = {
    societe: {
      nom: 'Test Corp',
      siret: '12345678901234',
      adresse: '123 Rue Test',
      representantPrenom: 'John',
      representantNom: 'Doe',
    },
    formation: {
      nom: 'Formation Test',
      objectifsOperationnels: ['Objectif 1', 'Objectif 2'],
      dureeHeures: 14,
      lieu: 'Paris',
    },
    datesEtHoraires: [
      {
        dateISO: '2025-01-15T00:00:00Z',
        debutISO: '2025-01-15T09:00:00Z',
        finISO: '2025-01-15T17:00:00Z',
      },
    ],
    effectif: [
      {
        prenom: 'Alice',
        nom: 'Martin',
        dateNaissanceISO: '1990-05-20T00:00:00Z',
      },
    ],
    tarifJournalierEUR: 500,
  };

  it('should generate a Convention PDF successfully', async () => {
    const { generateConvention } = await import('../generateConvention');

    const result = await generateConvention(validInput, 1);

    expect(result).toHaveProperty('documentId');
    expect(result).toHaveProperty('pdfUrl');
    expect(result.documentId).toBe('test-doc-id');
  });

  it('should throw error if required fields are missing', async () => {
    const { generateConvention } = await import('../generateConvention');

    const invalidInput = {
      ...validInput,
      societe: {
        ...validInput.societe,
        nom: '', // Champ requis vide
      },
    };

    // Note: La validation Zod doit être faite côté API
    // Ici on teste que le service reçoit les données correctes
    await expect(generateConvention(invalidInput, 1)).rejects.toThrow();
  });
});
