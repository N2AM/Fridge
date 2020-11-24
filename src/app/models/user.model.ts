import { Address } from "./address.model";

export interface User {
  auth_token?: string;
  name: string;
  phone: string;
  email: string;
  address?: Address[];
}
