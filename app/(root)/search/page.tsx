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

// import ProductCard from "@/components/shared/product/product-card";
// import { Button } from "@/components/ui/button";
// import { getAllProducts } from "@/lib/actions/prodct.actions";
// import Link from "next/link";

// const SearchPage = async (props: {
//   searchParams: Promise<{
//     q?: string;
//     category?: string;
//     price?: string;
//     rating?: string;
//     sort?: string;
//     page?: string;
//   }>;
// }) => {
//   const {
//     q = "all",
//     category = "all",
//     price = "all",
//     rating = "all",
//     sort = "newest", // Default sort
//     page = "1",
//   } = await props.searchParams;

//   // --- This part of the logic remains the same ---
//   const productsResult = await getAllProducts({
//     query: q,
//     category,
//     price,
//     rating,
//     sort,
//     page: Number(page),
//   });

//   return (
//     // --- 1. The main layout is simplified ---
//     <div className="wrapper py-8">
//       {/* --- 2. This is the new header section --- */}
//       <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
//         <div>
//           {/* This part shows the active filters */}
//           <p className="text-sm text-gray-600">
//             {productsResult.count} Results
//             {q !== "all" && q !== "" && ` for "${q}"`}
//           </p>
//           {(category !== "all" && category !== "") ||
//           price !== "all" ||
//           rating !== "all" ? (
//             <div className="flex items-center gap-2 mt-1">
//               <span className="text-xs">Active Filters:</span>
//               <Button
//                 variant={"secondary"}
//                 size="sm"
//                 asChild
//                 className="h-auto py-1 px-2 text-xs"
//               >
//                 <Link href="/search">Clear All</Link>
//               </Button>
//             </div>
//           ) : null}
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium">Sort by:</span>
//           {/* Use the new interactive dropdown component */}
//           <SortDropdown currentSort={sort} />
//         </div>
//       </div>

//       {/* --- 3. The product grid now takes up the full width --- */}
//       {productsResult.data.length === 0 ? (
//         <div className="text-center py-20">
//           <h2 className="text-2xl font-semibold">No products found</h2>
//           <p className="text-gray-500 mt-2">
//             Try adjusting your search or filters.
//           </p>
//           <Button asChild className="mt-6">
//             <Link href="/search">Clear Filters</Link>
//           </Button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {productsResult.data.map((product) => (
//             // You might need to adjust your ProductCard to use the new serialized data
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       )}

//       {/* --- You can add your pagination component here in the future --- */}
//     </div>
//   );
// };

// export default SearchPage;

// import ProductCard from "@/components/shared/product/product-card";
// import { Button } from "@/components/ui/button";
// import { getAllProducts } from "@/lib/actions/prodct.actions";
// import Link from "next/link";

// const prices = [
//   { name: "Under Rs. 1000", value: "0-999" },
//   { name: "Rs. 1000 to Rs. 2000", value: "1000-2000" },
//   { name: "Rs. 2001 to Rs. 4000", value: "2001-4000" },
//   { name: "Rs. 4001 to Rs. 6000", value: "4001-6000" },
//   { name: "Rs. 6001 to Rs. 8000", value: "6001-8000" },
//   { name: "Rs. 8001 to Rs. 10000", value: "8001-10000" },
// ];

// const ratings = [4, 3, 2, 1];

// const sortOrders = ["newest", "lowest", "highest", "rating"];

// export async function generateMetadata(props: {
//   searchParams: Promise<{
//     q: string;
//     category: string;
//     price: string;
//     rating: string;
//   }>;
// }) {
//   const {
//     q = "all",
//     category = "all",
//     price = "all",
//     rating = "all",
//   } = await props.searchParams;

//   const isQuerySet = q && q !== "all" && q.trim() !== "";
//   const isCategorySet =
//     category && category !== "all" && category.trim() !== "";
//   const isPriceSet = price && price !== "all" && price.trim() !== "";
//   const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

//   if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
//     return {
//       title: `
//       Search ${isQuerySet ? q : ""}
//       ${isCategorySet ? `: Category ${category}` : ""}
//       ${isPriceSet ? `: Price ${price}` : ""}
//       ${isRatingSet ? `: Rating ${rating}` : ""}`,
//     };
//   } else {
//     return {
//       title: "Search Products",
//     };
//   }
// }

// const SearchPage = async (props: {
//   searchParams: Promise<{
//     q?: string;
//     category?: string;
//     price?: string;
//     rating?: string;
//     sort?: string;
//     page?: string;
//   }>;
// }) => {
//   const {
//     q = "all",
//     category = "all",
//     price = "all",
//     rating = "all",
//     sort = "newest",
//     page = "1",
//   } = await props.searchParams;

//   // Construct filter url
//   const getFilterUrl = ({
//     c,
//     p,
//     s,
//     r,
//     pg,
//   }: {
//     c?: string;
//     p?: string;
//     s?: string;
//     r?: string;
//     pg?: string;
//   }) => {
//     const params = { q, category, price, rating, sort, page };

//     if (c) params.category = c;
//     if (p) params.price = p;
//     if (s) params.sort = s;
//     if (r) params.rating = r;
//     if (pg) params.page = pg;

//     return `/search?${new URLSearchParams(params).toString()}`;
//   };

//   const products = await getAllProducts({
//     query: q,
//     category,
//     price,
//     rating,
//     sort,
//     page: Number(page),
//   });

//   // const categories = await getCategoriesForNavigation();

//   return (
//     <div className="wrapper grid md:grid-cols-5 md:gap-5">
//       <div className="filter-links">
//         {/* Price Links */}
//         <div className="text-xl mb-2 mt-8">Price</div>
//         <div>
//           <ul className="space-y-1">
//             <li>
//               <Link
//                 className={`${price === "all" && "font-bold"}`}
//                 href={getFilterUrl({ p: "all" })}
//               >
//                 Any
//               </Link>
//             </li>
//             {prices.map((p) => (
//               <li key={p.value}>
//                 <Link
//                   className={`${price === p.value && "font-bold"}`}
//                   href={getFilterUrl({ p: p.value })}
//                 >
//                   {p.name}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//         {/* Rating Links */}
//         <div className="text-xl mb-2 mt-8">Customer Ratings</div>
//         <div>
//           <ul className="space-y-1">
//             <li>
//               <Link
//                 className={`${rating === "all" && "font-bold"}`}
//                 href={getFilterUrl({ r: "all" })}
//               >
//                 Any
//               </Link>
//             </li>
//             {ratings.map((r) => (
//               <li key={r}>
//                 <Link
//                   className={`${rating === r.toString() && "font-bold"}`}
//                   href={getFilterUrl({ r: `${r}` })}
//                 >
//                   {`${r} stars & up`}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <div className="md:col-span-4 space-y-4">
//         <div className="flex-between flex-col md:flex-row my-4">
//           <div className="flex items-center">
//             {q !== "all" && q !== "" && "Query: " + q}
//             {category !== "all" && category !== "" && "Category: " + category}
//             {price !== "all" && " Price: " + price}
//             {rating !== "all" && " Rating: " + rating + " stars & up"}
//             &nbsp;
//             {(q !== "all" && q !== "") ||
//             (category !== "all" && category !== "") ||
//             rating !== "all" ||
//             price !== "all" ? (
//               <Button variant={"link"} asChild>
//                 <Link href="/search">Clear</Link>
//               </Button>
//             ) : null}
//           </div>
//           <div>
//             Sort by{" "}
//             {sortOrders.map((s) => (
//               <Link
//                 key={s}
//                 className={`mx-2 ${sort == s && "font-bold"}`}
//                 href={getFilterUrl({ s })}
//               >
//                 {s}
//               </Link>
//             ))}
//           </div>
//         </div>
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//           {products.data.length === 0 && <div>No products found</div>}
//           {products.data.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchPage;
