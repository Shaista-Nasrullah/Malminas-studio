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
    // 1. Validate the incoming data from the form
    const parsedData = insertProductSchema.parse(data);

    // 2. Separate the discountEndDate from the rest of the data
    const { discountEndDate, ...restOfData } = parsedData;

    // 3. Create the final data object for Prisma, converting the date string
    const dataForPrisma = {
      ...restOfData,
      // If discountEndDate is a non-empty string, convert it to a Date object.
      // Otherwise, set it to null in the database.
      discountEndDate: discountEndDate ? new Date(discountEndDate) : null,
    };

    // 4. Use the correctly formatted data to create the product
    await prisma.product.create({ data: dataForPrisma });

    revalidatePath("/admin/products");
    return { success: true, message: "Product created successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    // 1. Validate the incoming data
    const parsedData = updateProductSchema.parse(data);

    // 2. Destructure the ID and the rest of the product data
    const { id, ...productFieldsToUpdate } = parsedData;

    // 3. From the fields to update, separate the discountEndDate
    const { discountEndDate, ...restOfData } = productFieldsToUpdate;

    // 4. Create the final data object for Prisma, converting the date string
    const dataForPrisma = {
      ...restOfData,
      discountEndDate: discountEndDate ? new Date(discountEndDate) : null,
    };

    // 5. Use the correctly formatted data to update the product
    await prisma.product.update({
      where: { id },
      data: dataForPrisma,
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`); // Keep this specific revalidation
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// export async function createProduct(data: z.infer<typeof insertProductSchema>) {
//   try {
//     const product = insertProductSchema.parse(data);
//     await prisma.product.create({ data: product });
//     revalidatePath("/admin/products");
//     return { success: true, message: "Product created successfully" };
//   } catch (error) {
//     return { success: false, message: formatError(error) };
//   }
// }

// export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
//   try {
//     const product = updateProductSchema.parse(data);
//     const { id, ...rest } = product;
//     await prisma.product.update({ where: { id }, data: rest });
//     revalidatePath("/admin/products");
//     revalidatePath(`/admin/products/${id}/edit`);
//     return { success: true, message: "Product updated successfully" };
//   } catch (error) {
//     return { success: false, message: formatError(error) };
//   }
// }

// No changes needed for featured products.
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  return data;
}

// --- ADD THIS NEW FUNCTION ---
export async function getDealOfTheMonthProduct() {
  try {
    const product = await prisma.product.findFirst({
      where: {
        isFeatured: true,
        discountPercentage: {
          gt: 0,
        },
        // ADDED: Only find deals that have an end date set in the future
        discountEndDate: {
          gte: new Date(), // 'gte' means "greater than or equal to" now
        },
      },
      // MODIFIED: Select both the slug and the end date
      select: {
        slug: true,
        discountEndDate: true,
      },
    });

    return product;
  } catch (error) {
    console.error("Failed to fetch deal of the month:", error);
    return null;
  }
}
