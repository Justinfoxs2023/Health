/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IProps {
  /** user 的描述 */
  user: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
  };
  /** showRole 的描述 */
  showRole?: boolean;
  /** timestamp 的描述 */
  timestamp?: string;
  /** style 的描述 */
  style?: any;
}
