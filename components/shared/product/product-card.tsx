// FILE: components/shared/product/product-card.tsx

import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }: { product: Product }) => {
  const originalPrice = Number(product.price);

  const isDealActive =
    product.discountPercentage &&
    product.discountPercentage > 0 &&
    product.discountEndDate &&
    new Date(product.discountEndDate) > new Date();

  const discount = isDealActive ? product.discountPercentage || 0 : 0;
  const displayPrice = originalPrice * (1 - discount / 100);

  return (
    <div className="flex flex-col h-full overflow-hidden group border border-gray-200 hover:shadow-xl transition-shadow duration-300 bg-[rgb(253,253,253)] md:p-5">
      {/* Replaces CardHeader */}
      <div className="p-0 relative">
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
        {/* No Sale badge as requested */}
      </div>

      {/* Replaces CardContent */}
      <div className="p-2 flex-grow flex flex-col items-center text-center">
        {" "}
        {/* Added items-center and text-center here */}
        <div className="flex-grow">
          <h3 className="text-sm sm:text-base font-normal tracking-tight min-h-14 leading-tight hover:text-primary transition-colors">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
        </div>
        <div className="flex flex-col mt-1">
          {isDealActive ? (
            <>
              <p className="text-gray-500 line-through text-xs sm:text-sm">
                Rs.{originalPrice.toFixed(0)}
              </p>
              <p className="text-sm sm:text-base font-normal text-gray-900">{`Rs.${displayPrice.toFixed(0)}`}</p>
            </>
          ) : (
            <p className="text-lg sm:text-base font-semibold text-gray-900">{`Rs.${originalPrice.toFixed(0)}`}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
