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

  // Fetch category details and products in parallel for efficiency
  const [category, productsData] = await Promise.all([
    getCategoryBySlug(slug),
    getAllProducts({
      category: slug,
      sort,
      price,
      // You will need to add 'availability' to your getAllProducts action
      // availability,
      page: Number(page),
      query: "all",
    }),
  ]);

  // If the category slug is invalid, show a 404 page
  if (!category) {
    return notFound();
  }

  return (
    <div className="wrapper mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-4">{category.name}</h1>

      {/* Filter Bar */}
      <CollectionFilterBar productCount={productsData.totalPages * 15} />

      {/* Product Grid */}
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

      {/* Pagination */}
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
