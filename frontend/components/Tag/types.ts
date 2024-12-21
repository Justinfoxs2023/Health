/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ITagProps {
  /** text 的描述 */
  text: string;
  /** type 的描述 */
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** small 的描述 */
  small?: boolean;
  /** onPress 的描述 */
  onPress?: () => void;
}

export interface ICategoryFilterProps {
  /** categories 的描述 */
  categories: ICategory[];
  /** selectedCategory 的描述 */
  selectedCategory: string;
  /** onSelect 的描述 */
  onSelect: (id: string) => void;
}

export interface ICategory {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
}
