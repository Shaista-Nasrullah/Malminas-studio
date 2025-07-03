import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/prodct.actions";
import ProductList from "@/components/shared/product/product-list";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";
import IconBoxes from "@/components/icon-boxes";
import DealCountdown from "@/components/deal-countdown";
import HeroSection from "@/components/shared/HeroSection";
import ShopByCategory from "@/components/shared/ShopByCategory";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <HeroSection />
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ShopByCategory />
      <ProductList data={latestProducts} title="Newest Arrivals" />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
    </>
  );
};

export default Homepage;
