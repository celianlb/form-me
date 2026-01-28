/**
 * @form-me/types
 * Shared TypeScript types for the Form Me monorepo
 */

// Formation types
export type {
  Formation,
  FormationCardData,
  FormationFromDB,
  TrainingObjective,
  TrainingModule,
  FormationWithDetails,
} from './formation';

// Category types
export type {
  Category,
  CategoryOption,
  CategoryWithCount,
} from './category';

// Session types
export type {
  SessionStatus,
  TrainingMode,
  RecurrencePattern,
  TrainingSession,
  TrainingSessionWithRelations,
  CreateSessionInput,
  UpdateSessionInput,
} from './session';

// Quote types
export type {
  RequestProfile,
  QuoteStatus,
  Quote,
  QuoteWithRelations,
  CreateQuoteInput,
} from './quote';

// User types
export type {
  UserRole,
  User,
  UserWithCounts,
} from './user';
