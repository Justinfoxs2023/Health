/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IProps {
  /** uri 的描述 */
  uri: string;
  /** width 的描述 */
  width?: number;
  /** height 的描述 */
  height?: number;
  /** style 的描述 */
  style?: any;
  /** onPress 的描述 */
  onPress?: () => void;
}
