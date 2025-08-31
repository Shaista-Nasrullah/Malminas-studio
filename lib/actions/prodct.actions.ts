"use server";

import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { revalidatePath } from "next/cache"; // Import revalidateTag
import { Prisma } from "@prisma/client";
import { insertProductSchema, updateProductSchema } from "../validators";
import { z } from "zod";
import { Product, Category, SubCategory } from "@/types";

type ProductWithRelations = Product & {
  category: Category | null;
  subCategory: SubCategory | null;
};

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  return data;
}

export async function getProductBySlug(slug: string) {
  console.log(`[getProductBySlug] Fetching product from DB for slug: ${slug}`); // Debug log
  const data = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        include: {
          subCategories: true,
        },
      },
      subCategory: true,
    },
  });
  if (data) {
    console.log(
      `[getProductBySlug] Found product: ${data.name}, Description: ${data.description}`
    ); // Debug log
  } else {
    console.log(`[getProductBySlug] No product found for slug: ${slug}`); // Debug log
  }
  return data;
}

export async function getProductById(productId: string) {
  console.log(`[getProductById] Fetching product from DB for ID: ${productId}`); // Debug log
  const data = await prisma.product.findUnique({
    where: { id: productId },
  });
  return data;
}

export async function getAllProducts({
  query,
  limit = 15,
  page,
  category,
  subcategory,
  price,
  rating,
  sort,
  availability,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  subcategory?: string;
  price?: string;
  rating?: string;
  sort?: string;
  availability?: string;
}): Promise<{
  data: ProductWithRelations[];
  count: number;
  totalPages: number;
}> {
  // ... (rest of the function remains the same)
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
    ...availabilityFilter,
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "rating-desc"
          ? { rating: "desc" }
          : sort === "oldest"
            ? { createdAt: "asc" }
            : { createdAt: "desc" };

  const dataPromise = prisma.product.findMany({
    where: whereClause,
    include: {
      category: {
        include: { subCategories: true },
      },
      subCategory: true,
    },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  const countPromise = prisma.product.count({ where: whereClause });

  const [data, count] = await Promise.all([dataPromise, countPromise]);

  return {
    data: data as unknown as ProductWithRelations[],
    count,
    totalPages: Math.ceil(count / limit),
  };
}

export async function deleteProduct(id: string) {
  try {
    const deletedProduct = await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath(`/product/${deletedProduct.slug}`); // Revalidate the public product page
    console.log(
      `[deleteProduct] Deleted product with ID: ${id}. Revalidated /product/${deletedProduct.slug}`
    ); // Debug log
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error(
      `[deleteProduct] Error deleting product with ID: ${id}`,
      error
    ); // Debug log
    return { success: false, message: formatError(error) };
  }
}

export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const parsedData = insertProductSchema.parse(data);
    const { discountEndDate, ...restOfData } = parsedData;
    const dataForPrisma = {
      ...restOfData,
      discountEndDate: discountEndDate ? new Date(discountEndDate) : null,
    };
    const newProduct = await prisma.product.create({ data: dataForPrisma });
    revalidatePath("/admin/products");
    revalidatePath(`/product/${newProduct.slug}`); // Revalidate the new product's page
    console.log(
      `[createProduct] Created product: ${newProduct.name}. Revalidated /product/${newProduct.slug}`
    ); // Debug log
    return { success: true, message: "Product created successfully" };
  } catch (error) {
    console.error("[createProduct] Error creating product:", error); // Debug log
    return { success: false, message: formatError(error) };
  }
}

export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const parsedData = updateProductSchema.parse(data);
    const { id, ...productFieldsToUpdate } = parsedData;
    const { discountEndDate, ...restOfData } = productFieldsToUpdate;
    const dataForPrisma = {
      ...restOfData,
      discountEndDate: discountEndDate ? new Date(discountEndDate) : null,
    };
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: dataForPrisma,
    });
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath(`/product/${updatedProduct.slug}`); // --- FIX 2: Revalidate the public product detail page ---
    console.log(
      `[updateProduct] Updated product with ID: ${id}. Revalidated paths: /admin/products, /admin/products/${id}/edit, /product/${updatedProduct.slug}`
    ); // Debug log
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    console.error(`[updateProduct] Error updating product with ID`, error); // Debug log
    return { success: false, message: formatError(error) };
  }
}

export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  return data;
}

export async function getDealOfTheMonthProduct() {
  try {
    const product = await prisma.product.findFirst({
      where: {
        discountPercentage: {
          gt: 0,
        },
        discountEndDate: {
          gte: new Date(),
        },
      },
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
    const where: Prisma.ProductWhereInput = {
      categoryId,
      NOT: {
        id: productId,
      },
    };
    const totalRelatedProducts = await prisma.product.count({ where });
    if (totalRelatedProducts === 0) {
      return [];
    }
    const take = Math.min(limit, totalRelatedProducts);
    const maxSkip = totalRelatedProducts - take;
    const skip = Math.floor(Math.random() * (maxSkip + 1));
    const products = await prisma.product.findMany({
      where,
      take,
      skip,
    });
    return products as unknown as Product[];
  } catch (error) {
    console.error(
      "Failed to fetch random related products:",
      formatError(error)
    );
    return [];
  }
}
