import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
import CategoryForm from "@/components/admin/category-form";

export const metadata: Metadata = {
  title: "Create Category",
};

const CreateCategoryPage = async () => {
  await requireAdmin();

  return (
    <>
      <h2 className="h2-bold">Create Category</h2>
      <p className="text-muted-foreground mt-2">
        Create a new category and add its sub-categories all in one place.
      </p>
      <div className="my-8">
        <CategoryForm type="Create" />
      </div>
    </>
  );
};

export default CreateCategoryPage;
