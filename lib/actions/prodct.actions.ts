"use server";

import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
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

// --- THE NEW, UNIFIED FUNCTION ---
export async function getAllProducts({
  query,
  limit = 15, // A reasonable default page size
  page,
  category, // category slug
  subcategory, // sub-category slug
  price,
  rating,
  sort,
  availability, // NEW: Added availability
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  subcategory?: string;
  price?: string;
  rating?: string;
  sort?: string;
  availability?: string; // NEW
}) {
  // --- WHERE CLAUSE LOGIC ---
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? { name: { contains: query, mode: "insensitive" } }
      : {};

  const categoryFilter: Prisma.ProductWhereInput =
    category && category !== "all" ? { category: { slug: category } } : {};

  const subCategoryFilter: Prisma.ProductWhereInput =
    subcategory && subcategory !== "all"
      ? { subCategory: { slug: subcategory } }
      : {};

  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  const ratingFilter: Prisma.ProductWhereInput =
    rating && rating !== "all" ? { rating: { gte: Number(rating) } } : {};

  // NEW: Availability Filter Logic
  const availabilityFilter: Prisma.ProductWhereInput =
    availability === "in-stock"
      ? { stock: { gt: 0 } }
      : availability === "out-of-stock"
        ? { stock: { equals: 0 } }
        : {};

  const whereClause: Prisma.ProductWhereInput = {
    ...queryFilter,
    ...categoryFilter,
    ...subCategoryFilter,
    ...priceFilter,
    ...ratingFilter,
    ...availabilityFilter, // Add the new filter
  };

  // --- ORDER BY (SORTING) LOGIC ---
  // Updated to match the new, more descriptive sort values
  const orderBy =
    sort === "price-asc" // Changed from "lowest"
      ? { price: "asc" }
      : sort === "price-desc" // Changed from "highest"
        ? { price: "desc" }
        : sort === "rating-desc" // Changed from "rating"
          ? { rating: "desc" }
          : sort === "oldest"
            ? { createdAt: "asc" }
            : { createdAt: "desc" }; // Default is "newest"

  // --- DATABASE QUERY ---
  const dataPromise = prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      subCategory: true,
    },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  const countPromise = prisma.product.count({ where: whereClause });

  // Run both queries in parallel for better performance
  const [data, count] = await Promise.all([dataPromise, countPromise]);

  // --- RETURN VALUE ---
  // Standardized to return data, count, and totalPages
  return {
    data,
    count,
    totalPages: Math.ceil(count / limit),
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

// --- ADD THIS NEW FUNCTION ---

/**
 * Fetches a random selection of related products from the same category.
 * This is achieved by first counting the available products and then
 * fetching a limited number from a random starting point (offset).
 *
 * @param {object} params - The parameters for fetching related products.
 * @param {string} params.productId - The ID of the current product to exclude from the results.
 * @param {string} params.categoryId - The ID of the category to find related products in.
 * @param {number} [params.limit=4] - The maximum number of related products to return.
 * @returns {Promise<Product[]>} A promise that resolves to an array of related products. Returns an empty array on error.
 */
export async function getRandomRelatedProducts({
  productId,
  categoryId,
  limit = 4,
}: {
  productId: string;
  categoryId: string;
  limit?: number;
}): Promise<Product[]> {
  try {
    // 1. Define the query conditions to find related products
    const where: Prisma.ProductWhereInput = {
      categoryId,
      NOT: {
        id: productId, // Exclude the current product
      },
    };

    // 2. Get the total count of all possible related products
    const totalRelatedProducts = await prisma.product.count({ where });

    // 3. If there are no related products, return an empty array immediately
    if (totalRelatedProducts === 0) {
      return [];
    }

    // 4. Calculate a random starting point (offset) for the database query
    const take = Math.min(limit, totalRelatedProducts);
    const maxSkip = totalRelatedProducts - take;
    const skip = Math.floor(Math.random() * (maxSkip + 1));

    // 5. Fetch the random batch of products from the database
    const products = await prisma.product.findMany({
      where,
      take,
      skip,
    });

    return products;
  } catch (error) {
    console.error(
      "Failed to fetch random related products:",
      formatError(error)
    );
    // Return an empty array on error to prevent the UI from crashing
    return [];
  }
}
