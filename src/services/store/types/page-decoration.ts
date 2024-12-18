/**
 * @fileoverview TS 文件 page-decoration.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 页面装修
export interface IPageDecoration {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: home  category  topic  campaign;
  status: draft  published  archived;

   
  basicInfo: {
    title: string;
    description: string;
    keywords: string;
    backgroundColor: string;
    backgroundImage: string;
  };

  // 布局配置
  layout: Array<{
    id: string;
    type: 'banner' | 'grid' | 'list' | 'tabs' | 'custom';
    position: number;
    style: {
      width: string;
      height: string;
      margin: string;
      padding: string;
    };
    content: IComponentConfig;
    visible: boolean;
  }>;

  // 组件配置
  components: {
    banner: BannerConfig;
    productList: ProductListConfig;
    category: CategoryConfig;
    promotion: PromotionConfig;
    custom: CustomConfig;
  };

  // 投放配置
  delivery: {
    startTime?: Date;
    endTime?: Date;
    platforms: string[];
    userGroups: string[];
    abTest?: {
      enabled: boolean;
      variants: string[];
      distribution: number[];
    };
  };

  // 数据统计
  statistics: {
    pv: number;
    uv: number;
    conversion: number;
    bounceRate: number;
  };
}

// 组件配置接口
interface IComponentConfig {
  /** type 的描述 */
    type: string;
  /** title 的描述 */
    title: string;
  /** subtitle 的描述 */
    subtitle: string;
  /** actionUrl 的描述 */
    actionUrl: string;
  /** style 的描述 */
    style: Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
  /** data 的描述 */
    data: any;
}

// Banner配置
interface IBannerConfig extends IComponentConfig {
  /** items 的描述 */
    items: Array<{
    image: string;
    title: string;
    subtitle?: string;
    actionUrl: string;
    startTime?: Date;
    endTime?: Date;
  }>;
  /** autoPlay 的描述 */
    autoPlay: false | true;
  /** interval 的描述 */
    interval: number;
  /** animation 的描述 */
    animation: string;
}

// 商品列表配置
interface IProductListConfig extends IComponentConfig {
  /** displayMode 的描述 */
    displayMode: "grid" | "list";
  /** columns 的描述 */
    columns: number;
  /** source 的描述 */
    source: {
    type: 'manual' | 'auto';
    productIds?: string[];
    rules?: {
      category?: string[];
      tags?: string[];
      price?: [number, number];
      sort?: string;
    };
  };
  /** showPrice 的描述 */
    showPrice: false | true;
  /** showRating 的描述 */
    showRating: false | true;
  /** showTags 的描述 */
    showTags: false | true;
}
