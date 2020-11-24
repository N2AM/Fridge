export interface Product {
  id: number | string;
  brand_id: number | string;
  brand: string;
  standard_rate: number;
  item_code: number;
  name_en?: string;
  name_ar?: string;
  name?: string;
  description: string;
  item_group: number;
  has_attributes: number | boolean;
  uom: number;
  weight: number | string;
  favourite?: boolean;
  stock_qty: number;
  has_variants: number | boolean;
  main_cat: null | [] | {} | any;
  sub_cat: {
    id: number | string;
    name: string;
  };
  images: string[];

  similar_products?: Product[];
  same_brand?: Product[];
  error?: string | object;
  qty?: number;

  // for cart view [product.qty * product.standar_rate].
  totalPrice?: number; 

  // to prevent calling API when user make a lot of clicks in same time.
  addClickCounter?: number; 
  
  // to prevent calling API when user make a lot of clicks in same time.
  removeClickCounter?: number; 
}
