/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ICategory {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
}

export interface IProps {
  /** categories 的描述 */
  categories: ICategory[];
  /** selectedCategory 的描述 */
  selectedCategory: string;
  /** onSelect 的描述 */
  onSelect: (categoryId: string) => void;
}
