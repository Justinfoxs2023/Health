/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'community' {
  export interface CommunityConfig {
    features: {
      posts: boolean;
      comments: boolean;
      sharing: boolean;
    };
  }
}
