export interface Support {
  id: number;
  title: string;
  description?: string;
  type: string;
  fileUrl: string;
  fileSize?: number;
  isActive: boolean;
  createdAt: string;
}

export interface GroupDetail {
  id: number;
  name: string;
  companyName: string;
  training: {
    id: number;
    title: string;
    supports: Support[];
  };
}

export interface SupportFormData {
  title: string;
  description: string;
  type: string;
  fileUrl: string;
  fileSize: string;
}
