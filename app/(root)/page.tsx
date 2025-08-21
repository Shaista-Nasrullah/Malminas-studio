// FILE: app/(root)/page.tsx

import { getLatestProducts } from "@/lib/actions/prodct.actions";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products-button";
import IconBoxes from "@/components/icon-boxes";
import HeroSection from "@/components/shared/HeroSection";
import ShopByCategory from "@/components/shared/ShopByCategory";
// --- 1. IMPORT THE UTILS AND TYPES ---
import { convertToPlainObject } from "@/lib/utils";
import { Product } from "@/types";

const Homepage = async () => {
  // 2. Fetch the "raw" data from the server. It has Decimal and Date objects.
  const rawLatestProducts = await getLatestProducts();

  // --- 3. THIS IS THE FINAL FIX ---
  // We serialize the data and forcefully assert the type to match our client-side definition.
  const latestProducts = convertToPlainObject(
    rawLatestProducts
  ) as unknown as Product[];

  return (
    <>
      <HeroSection />
      <ShopByCategory />
      {/* 4. Pass the correctly typed, serializable data to the client component */}
      <ProductList data={latestProducts} title="Newest Arrivals" />
      <ViewAllProductsButton />
      <IconBoxes />
    </>
  );
};

export default Homepage;
