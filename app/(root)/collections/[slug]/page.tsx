import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/actions/category.actions";
import { getAllProducts } from "@/lib/actions/prodct.actions";
import ProductCard from "@/components/shared/product/product-card";
import { CollectionFilterBar } from "@/components/shared/product/CollectionFilterBar";
import Pagination from "@/components/shared/pagination";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategoryBySlug(params.slug);
  return {
    title: category ? category.name : "Collection",
  };
}

const CollectionPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    sort?: string;
    price?: string;
    availability?: string;
    page?: string;
  };
}) => {
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
      availability, // Pass the availability filter
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

      {/* Pass the total count of products to the filter bar */}
      <CollectionFilterBar productCount={productsData.count} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {productsData.data.length === 0 ? (
          <p className="col-span-full text-center">
            No products found for this criteria.
          </p>
        ) : (
          productsData.data.map((product) => (
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
