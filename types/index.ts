import { z } from "zod";
import {
  // You should also import the new schema for the combined form
  categoryFormSchema, // +++ ADD THIS IMPORT +++
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertReviewSchema,
  insertCategorySchema,
  insertSubCategorySchema,
} from "@/lib/validators";

// +++ ADDED: A new type for the combined Category/Sub-Category form data +++
export type CategoryFormData = z.infer<typeof categoryFormSchema>;

// --- UPDATED: Category Type now includes its children ---
export type Category = z.infer<typeof insertCategorySchema> & {
  id: string;
  createdAt: Date;
  // This is the most important change. It tells TypeScript that a Category object
  // can contain a list of SubCategory objects. This is essential for the navigation menu.
  subCategories: SubCategory[]; // +++ ADD THIS LINE +++
};

export type SubCategory = z.infer<typeof insertSubCategorySchema> & {
  id: string;
  createdAt: Date;
};

// --- UPDATED: Product Type with better optional chaining ---
export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
  // Making these optional is safer, as you might not always fetch relations.
  category?: Category; // +/- Made optional for flexibility
  subCategory?: SubCategory | null;
};

// --- The rest of the file is correct ---
export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
};

export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};
