export interface Props {
  user: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
  };
  showRole?: boolean;
  timestamp?: string;
  style?: any;
} 