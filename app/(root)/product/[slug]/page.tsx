// app/(root)/product/[slug]/page.tsx

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

// --- 1. IMPORT THE 'Product' TYPE FROM PRISMA ---
// This gives us a proper type to use instead of 'any'.
import { Product } from "@prisma/client";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
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

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const rawProduct = await getProductBySlug(slug);

  if (!rawProduct) {
    notFound();
  }

  const [rawCart, relatedProducts] = await Promise.all([
    getMyCart(),
    getRandomRelatedProducts({
      productId: rawProduct.id,
      categoryId: rawProduct.categoryId,
      limit: 4,
    }),
  ]);

  const product = convertToPlainObject(rawProduct);
  const cart = rawCart ? convertToPlainObject(rawCart) : null;

  const isDealInitiallyActive =
    product.discountPercentage > 0 &&
    product.discountEndDate &&
    new Date(product.discountEndDate) > new Date();

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

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="wrapper my-12">
          <h2 className="h2-bold mb-6 text-center md:text-left">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/*
              --- 2. THE FIX: Replace 'any' with the imported 'Product' type ---
              This resolves the 'no-explicit-any' build error.
            */}
            {relatedProducts.map((p: Product) => (
              <ProductCard key={p.id} product={convertToPlainObject(p)} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetailsPage;
