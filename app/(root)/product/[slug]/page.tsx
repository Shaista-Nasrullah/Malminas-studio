import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/prodct.actions";
import { notFound } from "next/navigation";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/product/add-to-card";
import { getMyCart } from "@/lib/actions/cart.actions";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/shared/product/rating";

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  // --- 1. CALCULATE DISCOUNT INFORMATION ---
  const originalPrice = Number(product.price);
  const hasDiscount =
    product.discountPercentage && product.discountPercentage > 0;
  // Calculate the final price. If no discount, it's the same as the original price.
  const salePrice = hasDiscount
    ? originalPrice * (1 - product.discountPercentage / 100)
    : originalPrice;
  // --- END OF CALCULATION ---

  const session = await auth();
  const userId = session?.user?.id;
  const cart = await getMyCart();

  return (
    <>
      <section>
        <div className="wrapper grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Images column */}
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>

          {/* Details column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-4">
              <p className="text-gray-500">{product.brand}</p>
              <h1 className="h3-bold">{product.name}</h1>
              <div className="flex items-center gap-2">
                <Rating value={Number(product.rating)} />
                <p className="text-sm text-gray-600">
                  ({product.numReviews} reviews)
                </p>
              </div>

              {/* --- 2. UPDATED MAIN PRICE DISPLAY --- */}
              <div className="flex items-baseline gap-3 mt-2">
                {hasDiscount && (
                  // Show original price with strikethrough if discounted
                  <p className="text-2xl text-gray-400 line-through">
                    Rs.{originalPrice.toFixed(2)}
                  </p>
                )}
                {/* Always show the final price prominently */}
                <ProductPrice
                  value={salePrice}
                  className="text-3xl font-bold text-gray-800"
                />
                {hasDiscount && (
                  // Add a badge to highlight the savings
                  <Badge className="bg-red-500 text-white hover:bg-red-600">
                    {product.discountPercentage}% OFF
                  </Badge>
                )}
              </div>
              {/* --- END OF PRICE DISPLAY UPDATE --- */}
            </div>
            <div className="mt-10">
              <p className="font-semibold text-lg">Description</p>
              <p className="mt-2 text-gray-700">{product.description}</p>
            </div>
          </div>

          {/* Actions column */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  {/* --- 3. UPDATED PRICE IN SUMMARY CARD --- */}
                  {hasDiscount ? (
                    <div className="flex items-baseline gap-2">
                      {/* <p className="text-sm text-gray-500 line-through">
                        Rs.{originalPrice.toFixed(2)}
                      </p> */}
                      <ProductPrice value={salePrice} />
                    </div>
                  ) : (
                    <ProductPrice value={originalPrice} />
                  )}
                  {/* --- END OF SUMMARY PRICE UPDATE --- */}
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  <div>
                    {product.stock > 0 ? (
                      <Badge variant="outline">In Stock</Badge>
                    ) : (
                      <Badge variant="destructive">Out Of Stock</Badge>
                    )}
                  </div>
                </div>
                {product.stock > 0 && (
                  <div className="flex-center mt-4">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        // --- 4. CRITICAL: Use salePrice for the cart ---
                        price: salePrice.toString(),
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="wrapper mt-10">
        <h2 className="h2-bold">Customer Reviews</h2>
        <ReviewList
          userId={userId || ""}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </>
  );
};

export default ProductDetailsPage;

// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { getProductBySlug } from "@/lib/actions/prodct.actions";
// import { notFound } from "next/navigation";
// import ProductPrice from "@/components/shared/product/product-price";
// import ProductImages from "@/components/shared/product/product-images";
// import AddToCart from "@/components/shared/product/add-to-card";
// import { getMyCart } from "@/lib/actions/cart.actions";
// import ReviewList from "./review-list";
// import { auth } from "@/auth";
// import Rating from "@/components/shared/product/rating";

// const ProductDetailsPage = async (props: {
//   params: Promise<{ slug: string }>;
// }) => {
//   const { slug } = await props.params;
//   const product = await getProductBySlug(slug);
//   if (!product) {
//     notFound();
//   }

//   const session = await auth();
//   const userId = session?.user?.id;

//   const cart = await getMyCart();
//   console.log("Product slug: ", product.slug);
//   return (
//     <>
//       <section>
//         <div className="wrapper grid grid-cols-1 md:grid-cols-5">
//           {/* Images column */}
//           <div className="col-span-2">
//             <ProductImages images={product.images} />
//           </div>
//           <div className="col-span-2 p-5">
//             <div className="flex flex-col gap-6">
//               <p>
//                 {product.brand}
//                 {/* {product.category} */}
//               </p>
//               <h1 className="h3-bold">{product.name}</h1>
//               <Rating value={Number(product.rating)} />
//               <p>{product.numReviews} reviews</p>
//               <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                 <ProductPrice
//                   value={Number(product.price)}
//                   className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
//                 />
//               </div>
//             </div>
//             <div className="mt-10">
//               <p className="font-semibold">Description</p>
//               <p>{product.description}</p>
//             </div>
//           </div>
//           {/* Actions column */}
//           <div>
//             <Card>
//               <CardContent className="p-4">
//                 <div className="mb-2 flex justify-between">
//                   <div>Price</div>
//                   <div>
//                     <ProductPrice value={Number(product.price)} />
//                   </div>
//                 </div>
//                 <div className="mb-2 flex justify-between">
//                   <div>Status</div>
//                   <div>
//                     {product.stock > 0 ? (
//                       <Badge variant="outline">In Stock</Badge>
//                     ) : (
//                       <Badge variant="destructive">Out Of Stock</Badge>
//                     )}
//                   </div>
//                 </div>
//                 {product.stock > 0 && (
//                   <div className="flex-center">
//                     <AddToCart
//                       cart={cart}
//                       item={{
//                         productId: product.id,
//                         name: product.name,
//                         slug: product.slug,
//                         price: product.price.toString(), // CORRECTED
//                         qty: 1,
//                         image: product.images![0],
//                       }}
//                     />
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>
//       <section className="wrapper mt-10">
//         <h2 className="h2-bold">Customer Reviews</h2>
//         <ReviewList
//           userId={userId || ""}
//           productId={product.id}
//           productSlug={product.slug}
//         />
//       </section>
//     </>
//   );
// };

// export default ProductDetailsPage;
