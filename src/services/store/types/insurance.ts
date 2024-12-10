// 保险对接
export interface InsuranceClaim {
  id: string;
  orderId: string;
  policyNumber: string;
  insuranceProvider: string;
  claimAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  
  documents: Array<{
    type: 'prescription' | 'invoice' | 'medical_record';
    fileUrl: string;
    uploadDate: Date;
  }>;
  
  approvalInfo?: {
    approvedAmount: number;
    approvedDate: Date;
    approvedBy: string;
    notes: string;
  };
} 