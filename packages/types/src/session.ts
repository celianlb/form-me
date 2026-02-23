/**
 * Training Session types
 * New types for managing training sessions
 */

export type SessionStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type TrainingMode = 'PARTNER_CENTER' | 'E_LEARNING' | 'INTRA_COMPANY';
export type RecurrencePattern = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'NONE';

export interface TrainingSession {
  id: number;
  trainingId: number;
  title: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  registrationDeadline?: Date | null;
  maxLearners?: number | null;
  registeredCount: number;
  mode: TrainingMode;
  location?: string | null;
  status: SessionStatus;
  isActive: boolean;
  createdById: number;
  createdAt: Date;
  updatedAt: Date;
  recurrencePattern?: string | null;
  recurrenceEndDate?: Date | null;
  parentSessionId?: number | null;
}

export interface TrainingSessionWithRelations extends TrainingSession {
  training: {
    id: number;
    title: string;
    slug: string;
    category?: {
      id: number;
      name: string;
      slug: string;
    };
  };
  createdBy: {
    id: number;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  _count?: {
    quotes: number;
    childSessions: number;
  };
}

export interface CreateSessionInput {
  trainingId: number;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  registrationDeadline?: string;
  maxLearners?: number;
  mode: TrainingMode;
  location?: string;
  recurrencePattern?: RecurrencePattern;
  recurrenceEndDate?: string;
}

export interface UpdateSessionInput extends Partial<CreateSessionInput> {
  status?: SessionStatus;
  isActive?: boolean;
}
