import CategoryForm from "@/components/admin/category-form";
import { getCategoryById } from "@/lib/actions/category.actions";
import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Update Category",
};

const AdminCategoryUpdatePage = async (props: {
  params: {
    id: string;
  };
}) => {
  // 1. Secure the page for admins only
  await requireAdmin();

  // 2. Get the category ID from the URL parameters
  const { id } = props.params;

  // 3. Fetch the category data, including its sub-categories
  const category = await getCategoryById(id);

  // 4. If no category is found with that ID, show a 404 page
  if (!category) {
    return notFound();
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="space-y-2">
        <h1 className="h2-bold">Update Category</h1>
        <p className="text-muted-foreground">
          Edit the category details and manage its sub-categories.
        </p>
      </div>

      {/* 
        5. Render the reusable CategoryForm component in "Update" mode,
           pre-populating it with the fetched data.
      */}
      <CategoryForm
        type="Update"
        initialData={category}
        categoryId={category.id}
      />
    </div>
  );
};

export default AdminCategoryUpdatePage;
