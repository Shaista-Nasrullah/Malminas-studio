// FILE: types/index.ts
import { z } from "zod";
import {
  categoryFormSchema,
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertReviewSchema,
  insertCategorySchema,
  insertSubCategorySchema,
  CmsPageSchema,
} from "@/lib/validators";

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

export type Category = z.infer<typeof insertCategorySchema> & {
  id: string;
  createdAt: string; // <-- Corrected
  subCategories: SubCategory[];
};

export type SubCategory = z.infer<typeof insertSubCategorySchema> & {
  id: string;
  createdAt: string; // <-- Corrected
};

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: string; // <-- Corrected
  category?: Category;
  subCategory?: SubCategory | null;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;

export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: string; 
  isPaid: boolean;
  paidAt: string | null; 
  isDelivered: boolean;
  deliveredAt: string | null; 
  orderitems: OrderItem[];
  user: { name: string; email: string };
};

export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: string; // <-- Corrected
  user?: { name: string };
};

export type CmsPage = z.infer<typeof CmsPageSchema> & {
  id: string;
  slug: string;
  createdAt: string; // <-- Corrected
};
