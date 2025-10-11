export interface GroupDetail {
  id: number;
  name: string;
  companyName: string;
  trainingDate: string;
  isActive: boolean;
  createdAt: string;
  training: {
    title: string;
    supports: Array<{
      id: number;
      title: string;
      description?: string;
      type: string;
      fileUrl: string;
      fileSize?: number;
    }>;
  };
  members: Array<{
    id: number;
    status: string;
    invitedAt: string;
    acceptedAt?: string;
    user: {
      id: number;
      email: string;
      firstName?: string;
      lastName?: string;
      lastLoginAt?: string;
    };
  }>;
}
