/**
 * @fileoverview TS 文件 insurance.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 保险对接
export interface InsuranceClaim {
  /** id 的描述 */
    id: string;
  /** orderId 的描述 */
    orderId: string;
  /** policyNumber 的描述 */
    policyNumber: string;
  /** insuranceProvider 的描述 */
    insuranceProvider: string;
  /** claimAmount 的描述 */
    claimAmount: number;
  /** status 的描述 */
    status: pending  approved  rejected;

  documents: Array{
    type: prescription  invoice  medical_record;
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
