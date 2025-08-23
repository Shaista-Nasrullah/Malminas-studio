// FILE: app/(root)/collections/[slug]/page.tsx

import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/actions/category.actions";
import { getAllProducts } from "@/lib/actions/prodct.actions";
import ProductCard from "@/components/shared/product/product-card";
import { CollectionFilterBar } from "@/components/shared/product/CollectionFilterBar";
import Pagination from "@/components/shared/pagination";
import { Metadata } from "next";
// --- 1. IMPORT THE TYPE ---
import { Product } from "@/types";

type Props = {
  params: { slug: string };
  searchParams: {
    sort?: string;
    price?: string;
    availability?: string;
    page?: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  return {
    title: category ? category.name : "Collection",
  };
}

const CollectionPage = async ({ params, searchParams }: Props) => {
  const { slug } = params;
  const {
    sort = "newest",
    price = "all",
    availability = "all",
    page = "1",
  } = searchParams;

  const [category, productsData] = await Promise.all([
    getCategoryBySlug(slug),
    getAllProducts({
      category: slug,
      sort,
      price,
      availability,
      page: Number(page),
      query: "all",
    }),
  ]);

  if (!category) {
    return notFound();
  }

  return (
    <div className="wrapper mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
      <CollectionFilterBar productCount={productsData.count} />
      <div className="grid grid-cols-2 md-grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {productsData.data.length === 0 ? (
          <p className="col-span-full text-center">
            No products found for this criteria.
          </p>
        ) : (
          // --- 2. THIS IS THE FINAL FIX ---
          // We explicitly tell TypeScript the type of the 'product' variable.
          productsData.data.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
      <div className="mt-12 flex justify-center">
        {productsData.totalPages > 1 && (
          <Pagination
            page={Number(page)}
            totalPages={productsData.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
