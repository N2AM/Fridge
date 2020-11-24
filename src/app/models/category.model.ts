export interface Category {
  id: number;
  hasSubCategories: boolean;
  images: string;
  name: string;
  sub_categories: Category[];
}
