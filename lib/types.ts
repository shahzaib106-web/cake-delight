/* Cake Delight — shared types */
export type Category = "birthday" | "wedding" | "kids" | "anniversary" | "cupcakes";

export interface Product {
  id: number;
  name: string;
  category: Category | string;
  description: string;
  long_description?: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  bestseller: number | boolean;
  active: number | boolean;
  created_at?: string;
  items_count?: number;
}

export interface Flavor {
  id: number;
  name: string;
  description: string;
  tag: "classic" | "premium" | "fruity" | string;
  active: number | boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  active: number | boolean;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id?: number | null;
  name: string;
  image?: string;
  unit_price: number;
  qty: number;
  size: string;
  flavor?: string;
  message?: string;
}

export interface Order {
  id: number;
  order_no: string;
  customer_name: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  notes?: string;
  delivery_date?: string;
  delivery_slot?: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method?: string;
  status: string;
  created_at: string;
  items?: OrderItem[];
  items_count?: number;
}

export interface CustomOrder {
  id: number;
  ref_no: string;
  name: string;
  phone: string;
  email?: string;
  occasion: string;
  design: string;
  flavor: string;
  size: string;
  servings?: number;
  delivery_date?: string;
  message?: string;
  budget?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
}

export interface Message {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: number | boolean;
  created_at: string;
}

export interface CartItem {
  key: string;
  product_id: number;
  name: string;
  image: string;
  price: number;
  qty: number;
  size: string;
  flavor: string;
  message: string;
}

export const CATS: Record<string, string> = {
  all: "All Cakes",
  birthday: "Birthday",
  wedding: "Wedding",
  kids: "Kids",
  anniversary: "Anniversary",
  cupcakes: "Cupcakes",
};

export const SIZE_FACTORS: Record<string, number> = {
  "1 lb": 0.6,
  "2 lb": 1,
  "3 lb": 1.4,
  "5 lb": 2.2,
};

export const ORDER_STATUSES = ["pending", "confirmed", "baking", "out-for-delivery", "delivered", "cancelled"];
export const CUSTOM_STATUSES = ["new", "discussing", "quoted", "confirmed", "completed", "cancelled"];

export const rs = (n: number | string) => "Rs. " + Number(n || 0).toLocaleString("en-PK");
export const round50 = (n: number) => Math.round(n / 50) * 50;
export const priceFor = (base: number, size: string) => round50(base * (SIZE_FACTORS[size] ?? 1));
export const stars = (r: number) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
