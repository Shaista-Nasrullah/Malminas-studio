import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";

const ProductCard = ({ product }: { product: Product }) => {
  // --- 1. ADDED: Calculate discount information ---
  const hasDiscount =
    product.discountPercentage && product.discountPercentage > 0;
  const originalPrice = Number(product.price);
  const salePrice = hasDiscount
    ? originalPrice * (1 - product.discountPercentage / 100)
    : 0;

  return (
    <Card className="w-full max-w-sm">
      {/* ADDED: 'relative' class is needed to position the discount badge */}
      <CardHeader className="px-5 items-center relative">
        {/* --- 2. ADDED: The conditional discount badge --- */}
        {hasDiscount ? (
          <div
            // Using the olive-green color from your example
            style={{ backgroundColor: "#949543" }}
            // Positioned in the top-left corner
            className="absolute top-2 left-6 text-white text-xs font-medium px-2 py-1 rounded z-10"
          >
            Save {product.discountPercentage}%
          </div>
        ) : null}

        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            height={350}
            width={380}
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-2">
          <Rating value={Number(product.rating)} />

          {/* --- 3. UPDATED: Conditional price display --- */}
          {product.stock > 0 ? (
            hasDiscount ? (
              // If there IS a discount, show both prices
              <div className="flex items-baseline gap-2">
                <p className="text-gray-500 line-through text-sm">
                  Rs.{originalPrice.toFixed(0)}
                </p>
                {/* Use your existing ProductPrice component for the final price */}
                <ProductPrice value={salePrice} />
              </div>
            ) : (
              // If NO discount, show the original price as before
              <ProductPrice value={originalPrice} />
            )
          ) : (
            <p className="text-destructive">Out Of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
