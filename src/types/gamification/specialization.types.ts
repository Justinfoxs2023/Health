/**
 * @fileoverview TS 文件 specialization.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ISpecialization {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** level 的描述 */
  level: number;
  /** progress 的描述 */
  progress: number;
  /** maxLevel 的描述 */
  maxLevel: number;
  /** benefits 的描述 */
  benefits: {
    type: string;
    value: number;
    unlockLevel: number;
  }[];
}
