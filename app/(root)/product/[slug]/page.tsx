// FILE: app/(root)/product/[slug]/page.tsx

import {
  getProductBySlug,
  getRandomRelatedProducts,
} from "@/lib/actions/prodct.actions";
import { notFound } from "next/navigation";
import { getMyCart } from "@/lib/actions/cart.actions";
import { auth } from "@/auth";
import { Metadata } from "next";
import ProductCard from "@/components/shared/product/product-card";
import ProductDetailsClient from "./product-details-client";
import { convertToPlainObject } from "@/lib/utils";
import { Product } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const productData = await getProductBySlug(slug);

  if (!productData) {
    return { title: "Product Not Found" };
  }
  return {
    title: productData.name,
    description: productData.description,
    openGraph: {
      title: productData.name,
      description: productData.description,
      images: [{ url: productData.images[0] }],
    },
  };
}

const ProductDetailsPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const rawProduct = await getProductBySlug(slug);

  if (!rawProduct) {
    notFound();
  }

  const product = convertToPlainObject(rawProduct) as unknown as Product;

  const [rawCart, rawRelatedProducts] = await Promise.all([
    getMyCart(),
    getRandomRelatedProducts({
      productId: product.id,
      categoryId: product.categoryId,
    }),
  ]);

  const cart = rawCart ? convertToPlainObject(rawCart) : null;
  const relatedProducts = convertToPlainObject(
    rawRelatedProducts
  ) as unknown as Product[];

  // --- THIS IS THE FINAL FIX ---
  // We wrap the entire expression in `!!` to guarantee the result is a true boolean.
  const isDealInitiallyActive = !!(
    product.discountPercentage &&
    product.discountPercentage > 0 &&
    product.discountEndDate &&
    new Date(product.discountEndDate) > new Date()
  );

  const session = await auth();
  const userId = session?.user?.id;

  return (
    <>
      <section className="wrapper my-8">
        <ProductDetailsClient
          product={product}
          cart={cart}
          userId={userId}
          isDealInitiallyActive={isDealInitiallyActive}
        />
      </section>

      {relatedProducts && relatedProducts.length > 0 && (
        <section className="wrapper my-12">
          <h2 className="h2-bold mb-6 text-center md:text-left">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetailsPage;
