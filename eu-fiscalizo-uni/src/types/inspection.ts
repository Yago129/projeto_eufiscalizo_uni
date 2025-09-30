export type InspectionStatus = 'recebida' | 'em_processo' | 'concluida';

export interface Inspection {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: InspectionStatus;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  adminResponse?: string;
  adminId?: string;
  feedback?: {
    rating: number;
    comment: string;
    createdAt: Date;
  };
}

export interface InspectionFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  imageFile?: File;
}