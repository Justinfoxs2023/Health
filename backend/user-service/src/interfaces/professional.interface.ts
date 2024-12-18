/**
 * @fileoverview TS 文件 professional.interface.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IProfessionalService {
  getClientList(
    professionalId: string,
    page: number,
    limit: number,
    status?: string,
  ): Promise<any[]>;
  getClientDetail(professionalId: string, clientId: string): Promise<any>;
  createRecord(data: any): Promise<any>;
  updateRecord(id: string, data: any): Promise<any>;
  deleteRecord(id: string): Promise<boolean>;
}

export interface IHealthRecord {
  /** id 的描述 */
  id: string;
  /** clientId 的描述 */
  clientId: string;
  /** professionalId 的描述 */
  professionalId: string;
  /** type 的描述 */
  type: string;
  /** data 的描述 */
  data: any;
  /** status 的描述 */
  status: 'active' | 'archived' | 'deleted';
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

export interface IAssessment {
  /** id 的描述 */
  id: string;
  /** clientId 的描述 */
  clientId: string;
  /** professionalId 的描述 */
  professionalId: string;
  /** type 的描述 */
  type: string;
  /** results 的描述 */
  results: any;
  /** recommendations 的描述 */
  recommendations: string[];
  /** status 的描述 */
  status: 'draft' | 'completed';
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

export interface IPlan {
  /** id 的描述 */
  id: string;
  /** clientId 的描述 */
  clientId: string;
  /** professionalId 的描述 */
  professionalId: string;
  /** type 的描述 */
  type: string;
  /** goals 的描述 */
  goals: string[];
  /** activities 的描述 */
  activities: any[];
  /** duration 的描述 */
  duration: number;
  /** status 的描述 */
  status: 'active' | 'completed' | 'cancelled';
  /** progress 的描述 */
  progress: number;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}
