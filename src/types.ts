export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'ELECTRONICS' | 'FASHION' | 'WATCHES' | 'JEWELRY' | 'ACCESSORIES' | 'HOME';
  image: string;
  description: string;
  isNew?: boolean;
  sizes: string[];
  colors: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface BillingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  billingInfo: BillingInfo;
  createdAt: any; // Using any for Firestore Timestamp
}
