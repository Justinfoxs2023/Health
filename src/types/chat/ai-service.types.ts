/**
 * @fileoverview TS 文件 ai-service.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// AI客服配置
export interface IAIServiceConfig {
  /** basic 的描述 */
  basic: {
    name: string;
    avatar: string;
    greeting: string;
    farewell: string;
  };

  // 智能回复
  /** responses 的描述 */
  responses: {
    keywords: string[];
    content: string;
    followUps?: string[];
  }[];

  // 知识库配置
  /** knowledge 的描述 */
  knowledge: {
    categories: {
      name: string;
      questions: {
        q: string;
        a: string;
      }[];
    }[];
  };

  // 情感分析
  /** sentiment 的描述 */
  sentiment: {
    detectEmotions: boolean;
    autoComfort: boolean;
    escalateToHuman: string[];
  };
}
