/**
 * @fileoverview TS 文件 showcase.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IShowcaseData {
  /** items 的描述 */
    items: IShowcaseItem;
  /** layout 的描述 */
    layout: IShowcaseLayout;
  /** features 的描述 */
    features: IShowcaseFeatures;
  /** statistics 的描述 */
    statistics: IShowcaseStatistics;
  /** achievements 的描述 */
    achievements: IShowcaseAchievement;
}

export interface IShowcaseItem {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: virtual  /** physical 的描述 */
    /** physical 的描述 */
    physical;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** image 的描述 */
    image: string;
  /** price 的描述 */
    price: number;
  /** status 的描述 */
    status: available  on_sale  sold;
}

export interface IShowcaseLayout {
  /** type 的描述 */
    type: grid  list  custom;
  columns: number;
  spacing: number;
  customLayout: Recordstring, any;
}

export interface IShowcaseFeatures {
  /** slots 的描述 */
    slots: number;
  /** decoration 的描述 */
    decoration: string;
  /** effects 的描述 */
    effects: string;
  /** interaction 的描述 */
    interaction: string;
}

export interface IShowcaseStatistics {
  /** views 的描述 */
    views: number;
  /** likes 的描述 */
    likes: number;
  /** shares 的描述 */
    shares: number;
  /** sales 的描述 */
    sales: number;
}

export interface IShowcaseAchievement {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** progress 的描述 */
    progress: number;
  /** completed 的描述 */
    completed: false | true;
}

export interface InventoryCapacity {
  /** total 的描述 */
    total: number;
  /** used 的描述 */
    used: number;
  /** available 的描述 */
    available: number;
  /** displaySlots 的描述 */
    displaySlots: number;
  /** nextLevelUpgrade 的描述 */
    nextLevelUpgrade: {
    level: number;
    slots: number;
    displaySlots: number;
  };
}
