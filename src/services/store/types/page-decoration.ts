// 页面装修
export interface PageDecoration {
  id: string;
  name: string;
  type: 'home' | 'category' | 'topic' | 'campaign';
  status: 'draft' | 'published' | 'archived';
  
  // 页面基本信息
  basicInfo: {
    title: string;
    description: string;
    keywords: string[];
    backgroundColor: string;
    backgroundImage?: string;
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
    content: ComponentConfig;
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
interface ComponentConfig {
  type: string;
  title?: string;
  subtitle?: string;
  actionUrl?: string;
  style: Record<string, string>;
  data: any;
}

// Banner配置
interface BannerConfig extends ComponentConfig {
  items: Array<{
    image: string;
    title: string;
    subtitle?: string;
    actionUrl: string;
    startTime?: Date;
    endTime?: Date;
  }>;
  autoPlay: boolean;
  interval: number;
  animation: string;
}

// 商品列表配置
interface ProductListConfig extends ComponentConfig {
  displayMode: 'grid' | 'list';
  columns: number;
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
  showPrice: boolean;
  showRating: boolean;
  showTags: boolean;
} 