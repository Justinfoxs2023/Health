/**
 * @fileoverview TS 文件 prescription.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 处方管理
export interface IPrescription {
  /** id 的描述 */
    id: string;
  /** patientId 的描述 */
    patientId: string;
  /** doctorId 的描述 */
    doctorId: string;
  /** hospitalName 的描述 */
    hospitalName: string;
  /** diagnosis 的描述 */
    diagnosis: string;
  /** issuedDate 的描述 */
    issuedDate: Date;
  /** validUntil 的描述 */
    validUntil: Date;
  /** status 的描述 */
    status: active  used  expired;

  medications: Array{
    productId: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    notes: string;
  }>;

  verificationInfo: {
    verifiedBy: string;
    verificationDate: Date;
    digitalSignature: string;
  };
}
