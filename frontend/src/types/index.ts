// src/types/index.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'saree' | 'ornament' | 'bridal-set';
  subCategory?: string;
  images: string[];
  stock: number;
  featured: boolean;
  attributes?: {
    material?: string;
    color?: string;
    work?: string;
    weight?: string;
    occasion?: string[];
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedAttributes?: Record<string, string>;
}

export interface OrderDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  message?: string;
  cartItems: CartItem[];
  totalAmount: number;
}