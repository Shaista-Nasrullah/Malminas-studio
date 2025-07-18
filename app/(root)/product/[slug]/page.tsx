import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getDealOfTheMonthProduct,
  getProductBySlug,
} from "@/lib/actions/prodct.actions";
import { notFound } from "next/navigation";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/product/add-to-card";
import { getMyCart } from "@/lib/actions/cart.actions";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/shared/product/rating";
import DealCountdown from "@/components/deal-countdown";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0] }],
    },
  };
}

const ProductDetailsPage = async ({ params }: Props) => {
  const { slug } = params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const originalPrice = Number(product.price);
  const hasDiscount =
    product.discountPercentage && product.discountPercentage > 0;
  const salePrice = hasDiscount
    ? originalPrice * (1 - product.discountPercentage / 100)
    : originalPrice;

  const session = await auth();
  const userId = session?.user?.id;
  const cart = await getMyCart();
  const dealProduct = await getDealOfTheMonthProduct();

  const isDealProductPage = dealProduct && dealProduct.slug === product.slug;

  return (
    <>
      <section className="wrapper my-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 items-start">
          <div className="col-span-1 md:col-span-2 md:sticky md:top-24 h-fit">
            <ProductImages images={product.images} />
          </div>

          {/* --- START OF REDESIGNED RIGHT COLUMN --- */}
          {/* We've removed padding/flex from this outer div */}
          <div className="col-span-1 md:col-span-3">
            {/* A new inner container holds the padding and vertical spacing */}
            <div className="space-y-8 p-8 md:p-12 lg:p-16 bg-white rounded-lg">
              {/* --- Section 1: Core Product Info --- */}
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-wider uppercase text-gray-500">
                  {product.brand}
                </p>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
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

              {/* --- Section 2: Price & Deal Info --- */}
              <div>
                <div className="flex items-baseline gap-3">
                  {hasDiscount && (
                    <p className="text-xl text-gray-400 line-through">
                      Rs.{originalPrice.toFixed(0)}
                    </p>
                  )}
                  <ProductPrice
                    value={salePrice}
                    className="text-4xl font-bold text-gray-800"
                  />
                  {hasDiscount && (
                    <Badge className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 text-sm">
                      {product.discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
                {/* Countdown is placed right after the price for urgency */}
                {isDealProductPage && (
                  <div className="mt-6">
                    <DealCountdown
                      variant="compact"
                      dealEndDate={
                        dealProduct.discountEndDate
                          ? new Date(dealProduct.discountEndDate)
                          : undefined
                      }
                    />
                  </div>
                )}
              </div>

              {/* --- Section 3: Actions Card --- */}
              <Card className="border-gray-200 shadow-md">
                <CardContent className="p-6">
                  <div className="space-y-4">
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
                          cart={cart}
                          item={{
                            productId: product.id,
                            name: product.name,
                            slug: product.slug,
                            price: salePrice.toString(),
                            qty: 1,
                            image: product.images![0],
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* --- Section 4: Description --- */}
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
          {/* --- END OF REDESIGNED RIGHT COLUMN --- */}
        </div>
      </section>
    </>
  );
};

export default ProductDetailsPage;
