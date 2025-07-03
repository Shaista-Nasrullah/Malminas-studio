import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
import ProductForm from "@/components/admin/product-form";
// 1. Import the action to get categories
import { getCategoriesForNavigation } from "@/lib/actions/category.actions";

export const metadata: Metadata = {
  title: "Create Product",
};

const CreateProductPage = async () => {
  await requireAdmin();

  // 2. Fetch the categories data on the server
  const categories = await getCategoriesForNavigation();

  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        {/* 3. Pass the categories data down to the form as a prop */}
        <ProductForm type="Create" categories={categories} />
      </div>
    </>
  );
};

export default CreateProductPage;

// import { Metadata } from "next";
// import { requireAdmin } from "@/lib/auth-guard";
// import ProductForm from "@/components/admin/product-form";
// export const metadata: Metadata = {
//   title: "Create Product",
// };

// const CreateProductPage = async () => {
//   await requireAdmin();
//   return (
//     <>
//       <h2 className="h2-bold">Create Product</h2>
//       <div className="my-8">
//         <ProductForm type="Create" />
//       </div>
//     </>
//   );
// };

// export default CreateProductPage;
