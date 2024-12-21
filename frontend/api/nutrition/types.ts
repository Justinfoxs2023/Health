/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IQuestion {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** category 的描述 */
  category: string;
  /** tags 的描述 */
  tags: string[];
  /** images 的描述 */
  images: string[];
  /** userId 的描述 */
  userId: string;
  /** status 的描述 */
  status: string;
  /** isPrivate 的描述 */
  isPrivate: boolean;
  /** createdAt 的描述 */
  createdAt: string;
}

export interface IArticle {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** category 的描述 */
  category: string;
  /** author 的描述 */
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  /** likes 的描述 */
  likes: number;
  /** views 的描述 */
  views: number;
  /** createdAt 的描述 */
  createdAt: string;
}
