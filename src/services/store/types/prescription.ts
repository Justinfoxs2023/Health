// 处方管理
export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  hospitalName: string;
  diagnosis: string;
  issuedDate: Date;
  validUntil: Date;
  status: 'active' | 'used' | 'expired';
  
  medications: Array<{
    productId: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    notes?: string;
  }>;
  
  verificationInfo: {
    verifiedBy: string;
    verificationDate: Date;
    digitalSignature: string;
  };
} 