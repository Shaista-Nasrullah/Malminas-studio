"use server";

import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { categoryFormSchema } from "../validators";
import { requireAdmin } from "../auth-guard";

/**
 * Creates a new Category and any associated SubCategories in a single transaction.
 * Designed for the "all-in-one" category form.
 */
export async function getAllCategoriesForAdmin() {
  await requireAdmin(); // Ensures only admins can call this
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      // This is an efficient way to get the number of sub-categories
      // without fetching all their data.
      include: {
        _count: {
          select: { subCategories: true },
        },
      },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories for admin:", formatError(error));
    return [];
  }
}

export async function getHomepageCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        // Ensure we only get categories that have an image assigned
        images: {
          isEmpty: false,
        },
      },
      orderBy: {
        createdAt: "desc", // Or order by a custom 'displayOrder' field
      },
      take: 6, // Limit to 6 categories for a clean grid
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch homepage categories:", formatError(error));
    return [];
  }
}

export async function createCategoryWithSubCategories(
  values: z.infer<typeof categoryFormSchema>
) {
  await requireAdmin();

  const validatedFields = categoryFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Invalid form data." };
  }

  const { name, slug, images, subCategories } = validatedFields.data;

  try {
    // Prisma's nested write feature creates the category and all sub-categories
    // in a single, safe database transaction.
    await prisma.category.create({
      data: {
        name,
        slug,
        images,
        subCategories: {
          create: subCategories?.map((sub) => ({
            name: sub.name,
            slug: sub.slug,
          })),
        },
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/"); // Revalidate the homepage to update the navigation menu
    return { success: true, message: "Category created successfully." };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/**
 * Deletes a category. Because of the `onDelete: Cascade` rule in the schema,
 * Prisma will automatically delete all of its associated sub-categories.
 */
export async function deleteCategory(categoryId: string) {
  await requireAdmin();
  try {
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      throw new Error("Category not found.");
    }

    await prisma.category.delete({ where: { id: categoryId } });

    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true, message: "Category deleted successfully." };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/**
 * Fetches all categories and includes their sub-categories.
 * This is the primary function for powering the main site navigation.
 */
export async function getCategoriesForNavigation() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        // You can change this to a custom 'order' field if you add one
        createdAt: "asc",
      },
      include: {
        subCategories: {
          orderBy: {
            name: "asc",
          },
        },
      },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", formatError(error));
    return [];
  }
}

/**
 * Fetches a single category by its ID, including its sub-categories.
 * Used to populate the "Edit Category" form.
 */
export async function getCategoryById(categoryId: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        subCategories: true,
      },
    });
    return category;
  } catch (error) {
    console.error("Failed to fetch category:", formatError(error));
    return null;
  }
}

/**
 * Updates a category and its sub-categories in a single transaction.
 * Handles creating new sub-categories, updating existing ones, and deleting removed ones.
 */
export async function updateCategoryWithSubCategories(
  categoryId: string,
  values: z.infer<typeof categoryFormSchema>
) {
  await requireAdmin();

  const validatedFields = categoryFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: "Invalid form data." };
  }

  const { name, slug, images, subCategories = [] } = validatedFields.data;

  try {
    // Use a transaction to ensure all or no operations succeed
    await prisma.$transaction(async (tx) => {
      // 1. Update the parent category's details
      await tx.category.update({
        where: { id: categoryId },
        data: { name, slug, images },
      });

      // 2. Identify sub-categories to update, create, or delete
      const incomingSubCategoryIds = subCategories
        .map((sub) => sub.id)
        .filter(Boolean) as string[];

      // 3. Delete sub-categories that are no longer in the form
      await tx.subCategory.deleteMany({
        where: {
          categoryId: categoryId,
          id: {
            notIn: incomingSubCategoryIds,
          },
        },
      });

      // 4. Upsert (Update or Create) the sub-categories from the form
      for (const sub of subCategories) {
        if (sub.id) {
          // If ID exists, update it
          await tx.subCategory.update({
            where: { id: sub.id },
            data: { name: sub.name, slug: sub.slug },
          });
        } else {
          // If no ID, create it
          await tx.subCategory.create({
            data: {
              name: sub.name,
              slug: sub.slug,
              categoryId: categoryId, // Link to the parent
            },
          });
        }
      }
    });

    revalidatePath(`/admin/categories`);
    revalidatePath(`/admin/categories/${categoryId}/edit`);
    revalidatePath("/");
    return { success: true, message: "Category updated successfully." };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getFooterCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        // You could also order by number of products if you wanted
        createdAt: "asc",
      },
      take: 5, // Get the first 5 categories
      select: {
        name: true,
        slug: true,
      },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch footer categories:", formatError(error));
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });
    return category;
  } catch (error) {
    console.error("Failed to fetch category by slug:", formatError(error));
    return null;
  }
}
