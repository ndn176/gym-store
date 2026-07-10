export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'Tops' | 'Bottoms' | 'Outerwear' | 'Accessories';
  collection: 'Men' | 'Women' | 'Unisex';
  status?: 'New In' | 'Sale' | 'Essentials';
  image: string;
  hoverImage?: string;
  images: string[];
  description: string;
  materials: string[];
  care: string[];
  sizes: string[];
  rating: number;
  reviewsCount: number;
  stock?: number;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: 'QR Banking' | 'COD';
  userEmail?: string | null;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
}
