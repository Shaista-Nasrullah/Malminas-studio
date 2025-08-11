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

// --- 1. IMPORT THE CONVERSION UTILITY ---
import { convertToPlainObject, convertToPlainObject1 } from "@/lib/utils";

// generateMetadata remains unchanged.
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const productData = await getProductBySlug(slug); // Use a different variable name to avoid confusion
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

  // --- 2. FETCH THE RAW, "FANCY" DATA ---
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

  // --- 3. CONVERT THE RAW DATA TO "PLAIN" OBJECTS ---
  // This is the crucial step that fixes the error.
  const product = convertToPlainObject(rawProduct);
  const cart = rawCart ? convertToPlainObject(rawCart) : null;

  // --- The rest of the logic remains the same ---
  const isDealInitiallyActive =
    product.discountPercentage > 0 &&
    product.discountEndDate &&
    new Date(product.discountEndDate) > new Date();

  const session = await auth();
  const userId = session?.user?.id;

  return (
    <>
      <section className="wrapper my-8">
        {/* --- 4. PASS THE "PLAIN" OBJECTS AS PROPS --- */}
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
            {/* We can pass the raw relatedProducts here if ProductCard doesn't cause issues,
                but it's safer to convert them too if they are passed to client components. */}
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={convertToPlainObject1(p)} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetailsPage;
