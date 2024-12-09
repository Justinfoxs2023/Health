export interface TagProps {
  text: string;
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  small?: boolean;
  onPress?: () => void;
}

export interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (id: string) => void;
}

export interface Category {
  id: string;
  name: string;
} 