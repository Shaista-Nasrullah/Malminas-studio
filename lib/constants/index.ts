export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "Malminas Traditional Boutique";
export const COPYRIGHT_HOLDER = "Malmina's Traditional boutique Pk.";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern e-commerce store built with Next.js";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 6;

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const ShippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
  phone: "",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["BankDeposit", "JazzCash", "CashOnDelivery"];

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "CashOnDelivery";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

// --- UPDATED: productDefaultValues is now in sync with the schema ---
export const productDefaultValues = {
  name: "",
  slug: "",
  categoryId: "", // +++ ADDED +++
  subCategoryId: "", // +++ ADDED +++
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  discountPercentage: 0,
  discountEndDate: "",
  isFeatured: false,
  banner: null,
};

// +++ NEW: Default values for the combined category/sub-category form +++
export const categoryFormDefaultValues = {
  name: "",
  slug: "",
  images: [],
  subCategories: [], // This empty array is crucial for the form's initial state
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["admin", "user"];

export const reviewFormDefaultValues = {
  title: "",
  comment: "",
  rating: 0,
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";

export const cmsPageDefaultValues = {
  title: "",
  content: "",
};
