export interface Category {
  id: string;
  name: string;
}

export interface Props {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
} 