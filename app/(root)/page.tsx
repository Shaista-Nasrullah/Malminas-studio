// --- THIS IS THE FIX ---
// Add this line to the very top of the file.
// This tells Next.js to never cache this page and always re-render it on the server.
export const revalidate = 0;

import { getLatestProducts } from "@/lib/actions/prodct.actions";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products-button";
import IconBoxes from "@/components/icon-boxes";
import HeroSection from "@/components/shared/HeroSection";
import ShopByCategory from "@/components/shared/ShopByCategory";
import { convertToPlainObject } from "@/lib/utils";
import { Product } from "@/types";

const Homepage = async () => {
  const rawLatestProducts = await getLatestProducts();

  const latestProducts = convertToPlainObject(
    rawLatestProducts
  ) as unknown as Product[];

  return (
    <>
      <HeroSection />
      <ShopByCategory />
      <ProductList data={latestProducts} title="Newest Arrivals" />
      <ViewAllProductsButton />
      <IconBoxes />
    </>
  );
};

export default Homepage;
