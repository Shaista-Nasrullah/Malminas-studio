"use client";

import { useState, useEffect } from "react";
import { Product, Cart } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/product/add-to-card";
import Rating from "@/components/shared/product/rating";
import DealCountdown from "@/components/deal-countdown";
import ReviewList from "./review-list";

interface ProductDetailsClientProps {
  product: Product;
  cart: Cart | null;
  userId: string | undefined;
  isDealInitiallyActive: boolean;
}

export default function ProductDetailsClient({
  product,
  cart,
  userId,
  isDealInitiallyActive,
}: ProductDetailsClientProps) {
  const [isDealActive, setIsDealActive] = useState(isDealInitiallyActive);

  // Debug log for client component
  useEffect(() => {
    console.log("[ProductDetailsClient] Component mounted.");
    console.log("[ProductDetailsClient] Product props (Client):", product);
    console.log(
      "[ProductDetailsClient] Product Description from props (Client):",
      product.description
    );
  }, [product]); // Dependency array includes product to re-log if product props change

  const handleDealEnd = () => {
    setIsDealActive(false);
    console.log("[ProductDetailsClient] Deal ended."); // Debug log
  };

  const originalPrice = Number(product.price);
  const discount =
    isDealActive && typeof product.discountPercentage === "number"
      ? product.discountPercentage
      : 0;
  const displayPrice = originalPrice * (1 - discount / 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 items-start">
      <div className="col-span-1 md:col-span-2 md:sticky md:top-24 h-fit ">
        <ProductImages images={product.images} />
      </div>
      <div className="col-span-1 md:col-span-3">
        <div className="space-y-8 p-8 md:p-12 lg:p-16 bg-white rounded-lg">
          <div className="space-y-3">
            <p className="text-sm font-medium tracking-wider uppercase text-gray-500">
              {product.brand}
            </p>
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 pt-1">
              <Rating value={Number(product.rating)} />
              <a
                href="#reviews"
                className="text-sm text-gray-600 hover:text-primary transition"
              >
                ({product.numReviews} reviews)
              </a>
            </div>
          </div>
          <hr />

          <div>
            <div className="flex items-baseline gap-3">
              {isDealActive && (
                <p className="text-xl text-gray-400 line-through">
                  Rs.{originalPrice.toFixed(0)}
                </p>
              )}
              <ProductPrice
                value={displayPrice}
                className="text-4xl font-semibold text-gray-800"
              />
              {isDealActive && product.discountPercentage && (
                <Badge className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 text-sm">
                  {product.discountPercentage}% OFF
                </Badge>
              )}
            </div>
            {isDealActive && (
              <div className="mt-6">
                <DealCountdown
                  variant="compact"
                  dealEndDate={
                    product.discountEndDate
                      ? new Date(product.discountEndDate)
                      : undefined
                  }
                  onDealEnd={handleDealEnd}
                />
              </div>
            )}
          </div>

          <Card className="border-gray-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center text-lg">
                <div className="font-semibold">Status:</div>
                <div>
                  {product.stock > 0 ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 text-base py-1 px-4"
                    >
                      In Stock
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="text-base py-1 px-4"
                    >
                      Out Of Stock
                    </Badge>
                  )}
                </div>
              </div>
              {product.stock > 0 && (
                <div className="pt-2">
                  <AddToCart
                    cart={cart || undefined}
                    item={{
                      productId: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: displayPrice.toString(),
                      qty: 1,
                      image: product.images![0],
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3 pt-4">
            <h2 className="font-bold text-xl text-gray-800">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
          <div id="reviews" className="mt-10">
            <h2 className="h2-bold">Customer Reviews</h2>
            <ReviewList
              userId={userId || ""}
              productId={product.id}
              productSlug={product.slug}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
