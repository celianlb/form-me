/**
 * Quote types
 * Types for quote/contact requests
 */

export type RequestProfile = 'INDIVIDUAL' | 'PROFESSIONAL';
export type QuoteStatus = 'received' | 'contacted' | 'processed' | 'converted' | 'archived';

export interface Quote {
  id: number;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  profile: RequestProfile;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  trainingId?: number | null;
  sessionId?: number | null;
  mode?: 'PARTNER_CENTER' | 'E_LEARNING' | 'INTRA_COMPANY' | null;
  numberLearners: number;
  preferredDates?: string | null;
  message?: string | null;
  source?: string | null;
  status: string;
  createdAt: Date;
}

export interface QuoteWithRelations extends Quote {
  training?: {
    id: number;
    title: string;
    slug: string;
  } | null;
  session?: {
    id: number;
    title: string;
    startDate: Date;
    location?: string | null;
  } | null;
}

export interface CreateQuoteInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  profile: RequestProfile;
  address?: string;
  postalCode?: string;
  city?: string;
  trainingId?: number;
  sessionId?: number;
  mode?: 'PARTNER_CENTER' | 'E_LEARNING' | 'INTRA_COMPANY';
  numberLearners: number;
  preferredDates?: string;
  message?: string;
  source?: string;
}
