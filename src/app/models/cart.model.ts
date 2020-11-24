import { Product } from './product.model';
export interface Cart {
    products: Product[];
    itemsQty: number;
    totalPrice?: number;
}