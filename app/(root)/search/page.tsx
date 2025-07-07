import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/actions/prodct.actions";
import Link from "next/link";
import { CollectionFilterBar } from "@/components/shared/product/CollectionFilterBar"; // Import the correct component

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ""}
      ${isCategorySet ? `: Category ${category}` : ""}
      ${isPriceSet ? `: Price ${price}` : ""}
      ${isRatingSet ? `: Rating ${rating}` : ""}`,
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    price?: string;
    availability?: string; // Add availability
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "all",
    price = "all",
    availability = "all", // Get availability from search params
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  const productsResult = await getAllProducts({
    query: q,
    price,
    availability, // Pass it to the action
    sort,
    page: Number(page),
  });

  return (
    <div className="wrapper py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Search</h1>
        <p className="text-gray-600 mt-2">
          {productsResult.count} results found
          {q !== "all" && q !== "" && ` for "${q}"`}
        </p>
      </div>

      {/* Use the unified filter bar here */}
      <CollectionFilterBar productCount={productsResult.count} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {productsResult.data.length === 0 ? (
          <div className="text-center py-20 col-span-full">
            <h2 className="text-2xl font-semibold">No products found</h2>
            <p className="text-gray-500 mt-2">
              Try a different search or filter.
            </p>
          </div>
        ) : (
          productsResult.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Add Pagination if needed */}
    </div>
  );
};

export default SearchPage;
