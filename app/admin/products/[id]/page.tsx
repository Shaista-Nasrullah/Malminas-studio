import ProductForm from "@/components/admin/product-form";
import { getProductById } from "@/lib/actions/prodct.actions";
// HIGHLIGHT: 1. Import the action to get your categories
import { getCategoriesForNavigation } from "@/lib/actions/category.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Update Product",
};

// HIGHLIGHT: 2. Corrected the type for props. The `params` object is not a promise.
const AdminProductUpdatePage = async ({
  params,
}: {
  params: { id: string };
}) => {
  await requireAdmin();

  // Fetch both the product and the categories data.
  // Using Promise.all is slightly more efficient.
  const [productFromDatabase, categories] = await Promise.all([
    getProductById(params.id),
    getCategoriesForNavigation(), // You must have this function in your category.actions file
  ]);

  if (!productFromDatabase) {
    return notFound();
  }

  // HIGHLIGHT: 3. This is the fix. Create a "plain" object safe for the client.
  const serializableProduct = {
    ...productFromDatabase, // Copy all the properties from the database product
    price: productFromDatabase.price.toString(), // Convert the special Decimal object to a simple string
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>

      {/* HIGHLIGHT: 4. Pass the "safe" product object and the categories to the form. */}
      <ProductForm
        type="Update"
        product={serializableProduct}
        productId={serializableProduct.id}
        categories={categories}
      />
    </div>
  );
};

export default AdminProductUpdatePage;
