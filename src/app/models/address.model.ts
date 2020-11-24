export interface Address {
  address_title: string;
  address_id: number;
  lat: string | null;
  lng: string | null;
  address_phone: string;
  street: string;
  nearest_landmark: string;
  district_id: number;
  district_name?: string;
  warehouse: string;
  city: string | null;
  floor_no: number | null;
  building_no: number | null;
  apartment_no: number | null;
}
