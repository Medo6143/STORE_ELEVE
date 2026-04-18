import { Timestamp } from "firebase/firestore";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";
export type UserRole = "user" | "admin";
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type CouponType = "percentage" | "fixed";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isDisabled: boolean;
  address?: {
    street: string;
    city: string;
    governorate: string;
    postalCode?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProductVariant {
  size: Size;
  color: string;
  colorHex: string;
  colorImage?: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: string;
  collectionId: string;
  mainImage: string;
  images: string[];
  variants: ProductVariant[];
  tags?: string[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  collectionId?: string;
  collectionIds?: string[];
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  coverImage: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    governorate: string;
  };
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymobTransactionId?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  colorHex: string;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Timestamp;
}

export interface Wishlist {
  userId: string;
  productIds: string[];
  updatedAt: Timestamp;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: Timestamp;
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  link?: string;
  imageAlignment?: string; // stores "X% Y%" percentage for object-position
  order: number;
  isActive: boolean;
}

export interface Banner {
  text: string;
  link?: string;
  bgColor: string;
  isActive: boolean;
}

export interface HomeContent {
  heroSlides: HeroSlide[];
  banner: Banner;
  sectionOrder: string[];
  updatedAt: Timestamp;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: Timestamp;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymobIntentionId: string;
  paymobTransactionId?: string;
  createdAt: Timestamp;
}
