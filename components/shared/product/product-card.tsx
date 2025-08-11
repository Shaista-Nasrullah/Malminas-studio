// components/shared/product/product-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import Rating from "./rating";
import { Badge } from "@/components/ui/badge";

const ProductCard = ({ product }: { product: Product }) => {
  // --- 1. ADD THE "SMART" PRICE CALCULATION LOGIC HERE ---
  // We copy this directly from your product details page.

  const originalPrice = Number(product.price);

  // We check if a discount exists AND if the deal hasn't expired.
  const isDealActive =
    product.discountPercentage > 0 &&
    product.discountEndDate &&
    new Date(product.discountEndDate) > new Date();

  // We calculate the final price based on whether the deal is active.
  const displayPrice = isDealActive
    ? originalPrice * (1 - product.discountPercentage / 100)
    : originalPrice;

  // --- END OF NEW LOGIC ---

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
        {isDealActive && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white hover:bg-red-600">
            Save {product.discountPercentage}%
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          {/* By changing h-14 to min-h-14, the container can grow for longer titles. */}
          <CardTitle className="text-lg font-semibold tracking-tight min-h-14 leading-tight hover:text-primary transition-colors">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </CardTitle>
          <div className="mt-2">
            <Rating value={Number(product.rating)} />
          </div>
        </div>

        {/* --- 2. UPDATE THE JSX TO DISPLAY THE PRICES --- */}
        {/* This section will now show both prices if a deal is active. */}
        <div className="flex items-baseline gap-2 mt-4">
          {isDealActive && (
            <p className="text-gray-500 line-through">
              Rs.{originalPrice.toFixed(0)}
            </p>
          )}
          <p className="text-xl font-stretch-semi-condensedbold text-gray-800">
            Rs.{displayPrice.toFixed(0)}
          </p>
        </div>
        {/* --- END OF JSX UPDATE --- */}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
