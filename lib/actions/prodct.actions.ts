"use server";

import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { insertProductSchema, updateProductSchema } from "../validators";
import { z } from "zod";

// No changes needed here, it just gets the latest products.
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  // NOTE: You don't need `convertToPlainObject` for server components,
  // but it doesn't hurt. I'll leave it as is.
  return data;
}

// Updated to include category for more context
export async function getProductBySlug(slug: string) {
  const data = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      subCategory: true,
    },
  });
  return data;
}

// No changes needed, still fetches by a unique ID
export async function getProductById(productId: string) {
  const data = await prisma.product.findUnique({
    where: { id: productId },
  });
  return data;
}

// --- THIS IS THE MAINLY UPDATED FUNCTION ---
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category, // This will now be a category SLUG
  subcategory, // NEW: This will be a sub-category SLUG
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  subcategory?: string; // NEW
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Search query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            // 'insensitive' mode is for PostgreSQL. MySQL is case-insensitive by default.
            // Prisma is smart enough to handle this, but it's good to know.
            mode: "insensitive",
          },
        }
      : {};

  // --- NEW relational filters for category and sub-category ---
  const categoryFilter: Prisma.ProductWhereInput =
    category && category !== "all" ? { category: { slug: category } } : {};

  const subCategoryFilter: Prisma.ProductWhereInput =
    subcategory && subcategory !== "all"
      ? { subCategory: { slug: subcategory } }
      : {};

  // Price filter (no change in logic)
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  // Rating filter (no change in logic)
  const ratingFilter: Prisma.ProductWhereInput =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  // Combine all `where` clauses
  const whereClause: Prisma.ProductWhereInput = {
    ...queryFilter,
    ...categoryFilter,
    ...subCategoryFilter,
    ...priceFilter,
    ...ratingFilter,
  };

  const data = await prisma.product.findMany({
    where: whereClause,

    include: {
      category: true,
      subCategory: true,
    },

    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
          ? { price: "desc" }
          : sort === "rating"
            ? { rating: "desc" }
            : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  // Get the count of products matching the filters for accurate pagination
  const dataCount = await prisma.product.count({ where: whereClause });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// No changes needed for delete, create, or update as they work on the product model directly
// and Prisma handles the relations via the IDs provided.

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });
    revalidatePath("/admin/products");
    return { success: true, message: "Product created successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const { id, ...rest } = product;
    await prisma.product.update({ where: { id }, data: rest });
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// No changes needed for featured products.
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  return data;
}

// "use server";
// // import { PrismaClient } from "../generated/prisma";
// import { prisma } from "@/db/prisma";
// import { convertToPlainObject, formatError } from "../utils";
// import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
// import { revalidatePath } from "next/cache";
// import { Prisma } from "@prisma/client";
// import { insertProductSchema, updateProductSchema } from "../validators";
// import z from "zod";

// export async function getLatestProducts() {
//   //   const prisma = new PrismaClient();

//   const data = await prisma.product.findMany({
//     take: LATEST_PRODUCTS_LIMIT,
//     orderBy: { createdAt: "desc" },
//   });

//   return convertToPlainObject(data);
// }

// //get single product by slug
// export async function getProductBySlug(slug: string) {
//   const data = await prisma.product.findUnique({
//     where: { slug },
//     include: {
//       category: true,
//       subCategory: true,
//     },
//   });
//   return data;
// }

// // Get all products
// export async function getAllProducts({
//   query,
//   limit = PAGE_SIZE || 6,
//   page,
//   category,
//   price,
//   rating,
//   sort,
// }: {
//   query: string;
//   limit?: number;
//   page: number;
//   category?: string;
//   price?: string;
//   rating?: string;
//   sort?: string;
// }) {
//   // Query filter
//   const queryFilter: Prisma.ProductWhereInput =
//     query && query !== "all"
//       ? {
//           name: {
//             contains: query,
//             mode: "insensitive",
//           } as Prisma.StringFilter,
//         }
//       : {};

//   // Category filter
//   const categoryFilter = category && category !== "all" ? { category } : {};

//   // Price filter
//   const priceFilter: Prisma.ProductWhereInput =
//     price && price !== "all"
//       ? {
//           price: {
//             gte: Number(price.split("-")[0]),
//             lte: Number(price.split("-")[1]),
//           },
//         }
//       : {};
//   // Rating filter
//   const ratingFilter =
//     rating && rating !== "all"
//       ? {
//           rating: {
//             gte: Number(rating),
//           },
//         }
//       : {};

//   const data = await prisma.product.findMany({
//     where: {
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//       ...ratingFilter,
//     },
//     orderBy:
//       sort === "lowest"
//         ? { price: "asc" }
//         : sort === "highest"
//           ? { price: "desc" }
//           : sort === "rating"
//             ? { rating: "desc" }
//             : { createdAt: "desc" },
//     skip: (page - 1) * limit,
//     take: limit,
//   });

//   const dataCount = await prisma.product.count();

//   return {
//     data,
//     totalPages: Math.ceil(dataCount / limit),
//   };
// }

// // Delete a product
// export async function deleteProduct(id: string) {
//   try {
//     const productExists = await prisma.product.findFirst({
//       where: { id },
//     });

//     if (!productExists) throw new Error("Product not found");

//     await prisma.product.delete({ where: { id } });

//     revalidatePath("/admin/products");

//     return {
//       success: true,
//       message: "Product deleted successfully",
//     };
//   } catch (error) {
//     return { success: false, message: formatError(error) };
//   }
// }

// // Create a product
// export async function createProduct(data: z.infer<typeof insertProductSchema>) {
//   try {
//     const product = insertProductSchema.parse(data);
//     await prisma.product.create({ data: product });

//     revalidatePath("/admin/products");

//     return {
//       success: true,
//       message: "Product created successfully",
//     };
//   } catch (error) {
//     return { success: false, message: formatError(error) };
//   }
// }

// //Update a product
// export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
//   try {
//     const product = updateProductSchema.parse(data);
//     const productExists = await prisma.product.findFirst({
//       where: { id: product.id },
//     });

//     if (!productExists) throw new Error("Product not found");

//     await prisma.product.update({
//       where: { id: product.id },
//       data: product,
//     });

//     revalidatePath("/admin/products");

//     return {
//       success: true,
//       message: "Product updated successfully",
//     };
//   } catch (error) {
//     return { success: false, message: formatError(error) };
//   }
// }

// // Get all categories
// export async function getAllCategories() {
//   const data = await prisma.product.groupBy({
//     by: ["category"],
//     _count: true,
//   });

//   return data;
// }

// // Get featured products
// export async function getFeaturedProducts() {
//   const data = await prisma.product.findMany({
//     where: { isFeatured: true },
//     orderBy: { createdAt: "desc" },
//     take: 4,
//   });

//   return convertToPlainObject(data);
// }
