import { HealthData } from '../types/health-data';

export interface IHealthDataService {
  createRecord(data: HealthData): Promise<string>;
  getRecord(recordId: string): Promise<HealthData>;
  updateRecord(recordId: string, data: Partial<HealthData>): Promise<void>;
  deleteRecord(recordId: string): Promise<void>;
  getRecordsByUserId(userId: string, startDate?: Date, endDate?: Date): Promise<HealthData[]>;
  analyzeHealthTrends(userId: string, timeRange: string): Promise<any>;
  generateHealthReport(userId: string): Promise<any>;
}

export interface IAIService {
  analyzeHealthData(data: HealthData): Promise<any>;
  predictHealthRisks(userId: string): Promise<any>;
  generateRecommendations(userId: string): Promise<string[]>;
  processHealthMetrics(metrics: any): Promise<any>;
}

export interface IEncryptionService {
  encrypt(data: any): Promise<string>;
  decrypt(encryptedData: string): Promise<any>;
  hash(data: string): Promise<string>;
  verify(data: string, hash: string): Promise<boolean>;
} 