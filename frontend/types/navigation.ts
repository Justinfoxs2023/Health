import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  ArticleDetail: { id: string };
  QuestionDetail: { id: string };
  AskQuestion: undefined;
  Profile: undefined;
  // ... 其他路由
};

export type NavigationProp = StackNavigationProp<RootStackParamList>; 