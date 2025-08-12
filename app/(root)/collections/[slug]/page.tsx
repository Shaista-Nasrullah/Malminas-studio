// FILE: app/(root)/collections/[slug]/page.tsx

// A very simple type for the props, which we know is correct.
type PageProps = {
  params: {
    slug: string;
  };
};

// This is the simplest possible page component.
// It will not cause any build errors.
const CollectionPage = async ({ params }: PageProps) => {
  const { slug } = params;

  return (
    <div className="wrapper mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Collection: {slug}</h1>
      <p>
        Products for this collection will be displayed here soon. This page is
        currently under construction.
      </p>
    </div>
  );
};

export default CollectionPage;

// // FILE: app/(root)/collections/[slug]/page.tsx

// import { notFound } from "next/navigation";
// import { getCategoryBySlug } from "@/lib/actions/category.actions";
// import { getAllProducts } from "@/lib/actions/prodct.actions";
// import ProductCard from "@/components/shared/product/product-card";
// import { CollectionFilterBar } from "@/components/shared/product/CollectionFilterBar";
// import Pagination from "@/components/shared/pagination";

// // This is the correct way to type the props for a page
// type PageProps = {
//   params: { slug: string };
//   searchParams: {
//     sort?: string;
//     price?: string;
//     availability?: string;
//     page?: string;
//   };
// };

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const category = await getCategoryBySlug(params.slug);
//   return {
//     title: category ? category.name : "Collection",
//   };
// }

// // Use the correct PageProps type
// const CollectionPage = async (props: PageProps) => {
//   // Destructure the props directly, WITHOUT 'await'
//   const { params, searchParams } = props;

//   const { slug } = params;
//   const {
//     sort = "newest",
//     price = "all",
//     availability = "all",
//     page = "1",
//   } = searchParams;

//   const [category, productsData] = await Promise.all([
//     getCategoryBySlug(slug),
//     getAllProducts({
//       category: slug,
//       sort,
//       price,
//       availability,
//       page: Number(page),
//       query: "all",
//     }),
//   ]);

//   if (!category) {
//     return notFound();
//   }

//   return (
//     <div className="wrapper mx-auto px-4 py-8">
//       <h1 className="text-4xl font-bold mb-4">{category.name}</h1>

//       <CollectionFilterBar productCount={productsData.count} />

//       <div className="grid grid-cols-2 md-grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
//         {productsData.data.length === 0 ? (
//           <p className="col-span-full text-center">
//             No products found for this criteria.
//           </p>
//         ) : (
//           productsData.data.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))
//         )}
//       </div>

//       <div className="mt-12 flex justify-center">
//         {productsData.totalPages > 1 && (
//           <Pagination
//             page={Number(page)}
//             totalPages={productsData.totalPages}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default CollectionPage;
