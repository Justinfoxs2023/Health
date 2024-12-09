export interface IBaseService {
  logger: Logger;
  redis: Redis;
}

export interface IUserService extends IBaseService {
  findById(id: string): Promise<any>;
  findByEmail(email: string): Promise<any>;
  updateUser(id: string, data: any): Promise<any>;
  uploadAvatar(userId: string, file: any): Promise<string>;
}

export interface IDoctorService extends IBaseService {
  getPatientList(doctorId: string, page: number, limit: number, status?: string): Promise<any>;
  getPatientDetail(doctorId: string, patientId: string): Promise<any>;
  createPrescription(data: any): Promise<any>;
  createConsultation(data: any): Promise<any>;
}

export interface IAuthService extends IBaseService {
  validateToken(token: string): Promise<boolean>;
  getGoogleUserInfo(code: string): Promise<any>;
  getWechatUserInfo(code: string): Promise<any>;
}

export interface ISecurityService extends IBaseService {
  checkPermission(userId: string, resource: string, action: string): Promise<boolean>;
  validateRequest(req: Request): Promise<boolean>;
  encryptData(data: any): Promise<string>;
  decryptData(encryptedData: string): Promise<any>;
} 