// FILE: app/admin/create/page.tsx

import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
import ProductForm from "@/components/admin/product-form";
import { getCategoriesForNavigation } from "@/lib/actions/category.actions";
// --- IMPORT THE TYPE ---
import { Category } from "@/types";

export const metadata: Metadata = {
  title: "Create Product",
};

const CreateProductPage = async () => {
  await requireAdmin();

  const rawCategories = await getCategoriesForNavigation();

  // --- THIS IS THE FINAL FIX ---
  // We use the forceful two-step assertion to tell TypeScript that after serialization,
  // this data will perfectly match our client-side 'Category[]' type.
  const categories = rawCategories as unknown as Category[];

  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        {/* Pass the correctly typed categories data down to the form */}
        <ProductForm type="Create" categories={categories} />
      </div>
    </>
  );
};

export default CreateProductPage;
