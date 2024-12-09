export interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  images: string[];
  userId: string;
  status: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  views: number;
  createdAt: string;
} 