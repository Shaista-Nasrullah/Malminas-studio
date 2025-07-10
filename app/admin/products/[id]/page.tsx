import ProductForm from "@/components/admin/product-form";
import { getProductById } from "@/lib/actions/prodct.actions";
import { getCategoriesForNavigation } from "@/lib/actions/category.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Update Product",
};

// Helper function to format an ISO date STRING for the form input
const formatDateForInput = (dateString: string | null): string => {
  if (!dateString) return "";
  return dateString.slice(0, 16);
};

const AdminProductUpdatePage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  // --- FIX #1: Await the params object ---
  const { id } = await props.params;

  await requireAdmin();

  const [rawProduct, rawCategories] = await Promise.all([
    getProductById(id),
    getCategoriesForNavigation(),
  ]);

  if (!rawProduct) {
    return notFound();
  }

  // --- FIX #2: Manually build a guaranteed-plain product object ---
  // This is the most robust way to ensure no complex objects are passed.
  const serializableProduct = {
    id: rawProduct.id,
    name: rawProduct.name,
    slug: rawProduct.slug,
    images: rawProduct.images,
    brand: rawProduct.brand,
    description: rawProduct.description,
    stock: rawProduct.stock,
    price: String(rawProduct.price), // Ensure it's a string
    rating: String(rawProduct.rating), // Ensure it's a string
    discountPercentage: rawProduct.discountPercentage,
    isFeatured: rawProduct.isFeatured,
    banner: rawProduct.banner,
    categoryId: rawProduct.categoryId,
    subCategoryId: rawProduct.subCategoryId,
    discountEndDate: formatDateForInput(
      rawProduct.discountEndDate ? String(rawProduct.discountEndDate) : null
    ),
  };

  // --- FIX #2 (cont.): Manually serialize the categories as well ---
  const serializableCategories = rawCategories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    images: category.images,
    subCategories: category.subCategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      images: sub.images,
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
