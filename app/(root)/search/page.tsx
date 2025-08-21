import { Metadata } from "next";
import ProductCard from "@/components/shared/product/product-card";
import { getAllProducts } from "@/lib/actions/prodct.actions";
import { CollectionFilterBar } from "@/components/shared/product/CollectionFilterBar";

// Define the correct props type. 'searchParams' is a plain object.
type SearchPageProps = {
  // Note: The 'params' object would be here for dynamic routes, but this is not a dynamic route.
  searchParams: {
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    availability?: string;
    sort?: string;
    page?: string;
  };
};

// The 'generateMetadata' function receives the same props as the page.
// It is async because it might need to fetch data, but the props themselves are not Promises.
export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  // Destructure directly from the searchParams object without 'await'.
  const { q, category, price, rating } = searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  // Building the title string more cleanly.
  const titleParts = ["Search"];
  if (isQuerySet) titleParts.push(q);
  if (isCategorySet) titleParts.push(`Category: ${category}`);
  if (isPriceSet) titleParts.push(`Price: ${price}`);
  if (isRatingSet) titleParts.push(`Rating: ${rating}`);

  if (titleParts.length > 1) {
    return {
      title: titleParts.join(" | "), // Example: "Search | MyProduct | Category: Electronics"
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}

// The Page component is async to fetch data, but its props are plain objects.
const SearchPage = async ({ searchParams }: SearchPageProps) => {
  // Destructure directly from searchParams without 'await'.
  const {
    q = "all",
    price = "all",
    availability = "all",
    sort = "newest",
    page = "1",
  } = searchParams;

  const productsResult = await getAllProducts({
    query: q,
    price,
    availability,
    sort,
    page: Number(page),
  });

  return (
    <div className="wrapper py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Search here</h1>
        <p className="text-gray-600 mt-2">
          {productsResult.count} results found
          {q !== "all" && q !== "" && ` for "${q}"`}
        </p>
      </div>

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
