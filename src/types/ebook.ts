export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: "featured" | "addon";
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BuyerInfo {
  email: string;
  name: string;
  phone: string;
  shippingAddress: string;
}

export interface OrderPayload {
  buyerInfo: BuyerInfo;
  cartItems: CartItem[];
  voucherCode?: string;
}

export interface CheckoutResponse {
  snapToken: string;
  orderId: string;
}
