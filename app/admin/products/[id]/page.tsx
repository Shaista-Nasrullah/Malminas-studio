// FILE: app/admin/products/[id]/page.tsx

import ProductForm from "@/components/admin/product-form";
import { getProductById } from "@/lib/actions/prodct.actions";
import { getCategoriesForNavigation } from "@/lib/actions/category.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import { Category, SubCategory } from "@/types";

type RawCategory = Omit<Category, "createdAt" | "subCategories" | "images"> & {
  createdAt: Date;
  images: string[];
  subCategories: (Omit<SubCategory, "createdAt"> & { createdAt: Date })[];
};

export const metadata: Metadata = {
  title: "Update Product",
};

const formatDateForInput = (dateString: string | null): string => {
  if (!dateString) return "";
  try {
    return dateString.slice(0, 16);
  } catch (e) {
    console.error("Failed to format date string:", e);
    return "";
  }
};

const AdminProductUpdatePage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = params;
  await requireAdmin();

  const [rawProduct, serverCategories] = await Promise.all([
    getProductById(id),
    getCategoriesForNavigation(),
  ]);

  if (!rawProduct) {
    return notFound();
  }

  const rawCategories = serverCategories as unknown as RawCategory[];

  const serializableProduct = {
    id: rawProduct.id,
    name: rawProduct.name,
    slug: rawProduct.slug,
    images: rawProduct.images,
    brand: rawProduct.brand,
    description: rawProduct.description,
    stock: rawProduct.stock,
    price: String(rawProduct.price),
    rating: String(rawProduct.rating),
    discountPercentage: rawProduct.discountPercentage,
    isFeatured: rawProduct.isFeatured,
    banner: rawProduct.banner,
    categoryId: rawProduct.categoryId,
    subCategoryId: rawProduct.subCategoryId,
    discountEndDate: formatDateForInput(
      rawProduct.discountEndDate
        ? rawProduct.discountEndDate.toISOString()
        : null
    ),
    numReviews: rawProduct.numReviews,
    // --- THIS IS THE FINAL FIX ---
    // We convert the 'createdAt' Date object to a string to match the client-side type.
    createdAt: rawProduct.createdAt.toISOString(),
  };

  const serializableCategories = rawCategories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    images: category.images,
    createdAt: category.createdAt.toISOString(),
    subCategories: category.subCategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      createdAt: sub.createdAt.toISOString(),
      categoryId: sub.categoryId,
    })),
  }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>
      <ProductForm
        type="Update"
        product={serializableProduct}
        productId={serializableProduct.id}
        categories={serializableCategories}
      />
    </div>
  );
};

export default AdminProductUpdatePage;
