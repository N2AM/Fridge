import { User } from "./user.model";
import { ShopDetails } from "./shopDetails.model";

export interface UserProfile {
  id: number;
  user: User;
  active: boolean;
  shop_details: ShopDetails[];
  name: string;
  phone: string;
  email: string;
  auth_token: string;
}
