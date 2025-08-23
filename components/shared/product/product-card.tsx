// import Link from "next/link";
// import Image from "next/image";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import ProductPrice from "./product-price";
// import { Product } from "@/types";
// import Rating from "./rating";

// const ProductCard = ({ product }: { product: Product }) => {
//   return (
//     <Card className="w-full max-w-sm">
//       <CardHeader className="p-0 items-center">
//         <Link href={`/product/${product.slug}`}>
//           <Image
//             src={product.images[0]}
//             alt={product.name}
//             height={300}
//             width={400}
//             priority={true}
//           />
//         </Link>
//       </CardHeader>
//       <CardContent className="p-4 grid gap-4">
//         {/* <div className="text-xs">{product.brand}</div> */}
//         <Link href={`/product/${product.slug}`}>
//           <h2 className="text-sm font-medium">{product.name}</h2>
//         </Link>
//         <div className="flex-between gap-4">
//           <Rating value={Number(product.rating)} />
//           {product.stock > 0 ? (
//             <ProductPrice value={Number(product.price)} />
//           ) : (
//             <p className="text-destructive">Out Of Stock</p>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductCard;

// FILE: components/shared/product/product-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import Rating from "./rating";
// import { Badge } from "@/components/ui/badge";

const ProductCard = ({ product }: { product: Product }) => {
  const originalPrice = Number(product.price);

  const isDealActive =
    product.discountPercentage &&
    product.discountPercentage > 0 &&
    product.discountEndDate &&
    new Date(product.discountEndDate) > new Date();

  // --- THIS IS THE FINAL FIX ---
  // If the deal is active, we use the discountPercentage, providing a fallback of 0
  // to guarantee that 'discount' is always a number.
  const discount = isDealActive ? product.discountPercentage || 0 : 0;
  const displayPrice = originalPrice * (1 - discount / 100);

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg group border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="aspect-square w-full relative overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        {/* {isDealActive && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white hover:bg-red-600">
            Save {product.discountPercentage}%
          </Badge>
        )} */}
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <CardTitle className="text-lg font-semibold tracking-tight min-h-14 leading-tight hover:text-primary transition-colors">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </CardTitle>
          <div className="mt-2">
            <Rating value={Number(product.rating)} />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-4">
          {isDealActive ? (
            <>
              <p className="text-gray-500 line-through">
                Rs.{originalPrice.toFixed(0)}
              </p>
              <p className="text-xl font-stretch-semi-condensedbold text-gray-800">{`Rs.${displayPrice.toFixed(0)}`}</p>
            </>
          ) : (
            <p className="text-xl font-stretch-semi-condensedbold text-gray-800">{`Rs.${originalPrice.toFixed(0)}`}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
