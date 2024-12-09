export type RootStackParamList = {
  Home: undefined;
  ArticleDetail: { id: string };
  QuestionDetail: { id: string };
  AskQuestion: undefined;
  AnswerQuestion: { questionId: string };
  // ... 其他路由
};

export type NavigationProp = StackNavigationProp<RootStackParamList>; 