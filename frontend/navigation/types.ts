/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export type RootStackParamListType = {
  Home: undefined;
  ArticleDetail: { id: string };
  QuestionDetail: { id: string };
  AskQuestion: undefined;
  AnswerQuestion: { questionId: string };
  // ... 其他路由
};

export type NavigationPropType = StackNavigationProp<RootStackParamListType>;
