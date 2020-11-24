import { Address } from "./address.model";

export interface Order {
  order_id: number;
  payment_method: string;
  date: string;
  status: string;
  address_id: number;
  address: Address;
  shipping_rate: number;
  final_total_price: number;
}
