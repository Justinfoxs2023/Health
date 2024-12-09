export interface IProfessionalService {
  getClientList(professionalId: string, page: number, limit: number, status?: string): Promise<any[]>;
  getClientDetail(professionalId: string, clientId: string): Promise<any>;
  createRecord(data: any): Promise<any>;
  updateRecord(id: string, data: any): Promise<any>;
  deleteRecord(id: string): Promise<boolean>;
}

export interface IHealthRecord {
  id: string;
  clientId: string;
  professionalId: string;
  type: string;
  data: any;
  status: 'active' | 'archived' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssessment {
  id: string;
  clientId: string;
  professionalId: string;
  type: string;
  results: any;
  recommendations: string[];
  status: 'draft' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlan {
  id: string;
  clientId: string;
  professionalId: string;
  type: string;
  goals: string[];
  activities: any[];
  duration: number;
  status: 'active' | 'completed' | 'cancelled';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
} 