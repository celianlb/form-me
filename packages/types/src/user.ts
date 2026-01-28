/**
 * User types
 * Types for user management
 */

export type UserRole = 'ADMIN' | 'LEARNER' | 'CLIENT';

export interface User {
  id: number;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
}

export interface UserWithCounts extends User {
  _count?: {
    supportGroupMemberships: number;
  };
}
