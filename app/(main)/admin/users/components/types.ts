export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  lastLoginAt?: string;
  _count: {
    supportGroupMemberships: number;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UsersResponse {
  users: User[];
  pagination: Pagination;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  role: string;
  mustChangePassword: boolean;
}
